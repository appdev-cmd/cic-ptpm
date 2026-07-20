import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

// HMAC-SHA256 signature verification helper
async function verifySignature(secret: string, header: string | null, payload: string): Promise<boolean> {
  if (!header || !secret) return false;
  
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const payloadBytes = encoder.encode(payload);
  const signatureBuffer = await crypto.subtle.sign("HMAC", cryptoKey, payloadBytes);
  
  const signatureArray = Array.from(new Uint8Array(signatureBuffer));
  const computedHex = signatureArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  const signatureHex = header.replace("sha256=", "").toLowerCase().trim();
  
  return computedHex === signatureHex;
}

serve(async (req) => {
  // Only accept POST requests
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const signature = req.headers.get("x-hub-signature-256");
    const event = req.headers.get("x-github-event");
    const rawBody = await req.text();
    const payload = JSON.parse(rawBody);

    const repoName = payload.repository?.full_name;
    if (!repoName) {
      return new Response(JSON.stringify({ error: "Repository name missing" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Initialize Supabase admin client (Service Role key)
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Fetch the project configuration to verify webhook secret
    const { data: project, error: projectError } = await supabaseAdmin
      .from("projects")
      .select("id, github_webhook_secret, github_branch")
      .eq("github_repo", repoName)
      .single();

    if (projectError || !project) {
      console.error(`Project not found in DB for repository: ${repoName}`, projectError);
      return new Response(JSON.stringify({ error: "Project not registered in system" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Verify webhook signature
    const isValid = await verifySignature(project.github_webhook_secret, signature, rawBody);
    if (!isValid) {
      console.warn(`Signature verification failed for repo: ${repoName}`);
      return new Response(JSON.stringify({ error: "Invalid webhook signature" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log(`Processing GitHub Webhook event '${event}' for repo: ${repoName}`);

    const updatedTasks: string[] = [];

    // 1. Handle PUSH event
    if (event === "push") {
      // Check branch
      const refBranch = payload.ref.replace("refs/heads/", "");
      if (refBranch !== project.github_branch) {
        return new Response(JSON.stringify({ message: `Ignored push to branch ${refBranch} (tracking ${project.github_branch})` }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      for (const commit of payload.commits || []) {
        const message = commit.message;
        // Parse task IDs: e.g. TASK-1, BUG-2, etc.
        const taskRegex = /(TASK|BUG)-\d+/gi;
        const matches = message.match(taskRegex);

        if (matches) {
          for (const match of matches) {
            const taskId = match.toUpperCase();
            let newStatus = "inprogress"; // Default to in progress when committed

            // Check transition keywords: e.g. closes TASK-1, fix TASK-2, resolve BUG-1
            const lowerMessage = message.toLowerCase();
            const doneKeywords = ["close", "closes", "closed", "fix", "fixes", "fixed", "resolve", "resolves", "resolved", "#done"];
            const reviewKeywords = ["#review", "pr", "pull-request"];
            const todoKeywords = ["#todo"];

            if (doneKeywords.some(keyword => lowerMessage.includes(`${keyword} ${taskId.toLowerCase()}`) || lowerMessage.includes(`#done`))) {
              newStatus = "done";
            } else if (reviewKeywords.some(keyword => lowerMessage.includes(keyword))) {
              newStatus = "review";
            } else if (todoKeywords.some(keyword => lowerMessage.includes(keyword))) {
              newStatus = "todo";
            }

            // Update Task status in Supabase
            const { error: updateError } = await supabaseAdmin
              .from("tasks")
              .update({ status: newStatus })
              .eq("id", taskId)
              .eq("project_id", project.id);

            if (!updateError) {
              updatedTasks.push(`${taskId} -> ${newStatus}`);
            } else {
              console.error(`Error updating task ${taskId}:`, updateError);
            }
          }
        }
      }
    }

    // 2. Handle PULL REQUEST event
    if (event === "pull_request") {
      const action = payload.action; // opened, closed, synchronized, etc.
      const pr = payload.pull_request;
      const title = pr.title || "";
      const body = pr.body || "";
      
      const taskRegex = /(TASK|BUG)-\d+/gi;
      const titleMatches = title.match(taskRegex) || [];
      const bodyMatches = body.match(taskRegex) || [];
      const matches = Array.from(new Set([...titleMatches, ...bodyMatches]));

      if (matches.length > 0) {
        let newStatus = "review"; // Opened PR -> set tasks to Review
        if (action === "closed" && pr.merged === true) {
          newStatus = "done"; // PR merged -> set tasks to Done
        } else if (action === "closed" && pr.merged === false) {
          newStatus = "todo"; // PR closed without merging -> revert to Todo or keep as is. Let's set to todo.
        }

        for (const match of matches) {
          const taskId = match.toUpperCase();
          const { error: updateError } = await supabaseAdmin
            .from("tasks")
            .update({ status: newStatus })
            .eq("id", taskId)
            .eq("project_id", project.id);

          if (!updateError) {
            updatedTasks.push(`${taskId} -> ${newStatus} (PR ${action})`);
          } else {
            console.error(`Error updating task ${taskId} from PR:`, updateError);
          }
        }
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: `Processed event successfully`, 
      updatedTasks 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err: any) {
    console.error("Webhook processing error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
