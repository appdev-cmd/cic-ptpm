import { useState, useEffect } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { 
  GitBranch, 
  Globe, 
  HelpCircle,
  Copy,
  Check,
  Save,
  Database,
  CheckCircle2
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  repo: string;
  githubRepo: string;
  githubBranch: string;
  githubWebhookSecret: string;
  vercelUrl: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  customerId: string;
  goal?: string;
}

export default function Settings() {
  const { projects, setProjects } = useOutletContext<any>();
  const { projectId } = useParams<{ projectId: string }>();
  const selectedProject = projects.find((p: Project) => p.id === projectId) || projects[0];
  
  // Local form states
  const [githubRepo, setGithubRepo] = useState('');
  const [githubBranch, setGithubBranch] = useState('');
  const [githubWebhookSecret, setGithubWebhookSecret] = useState('');
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState('');
  
  const [copied, setCopied] = useState(false);
  const [successSaved, setSuccessSaved] = useState(false);
  
  const baseSupabaseUrl = selectedProject?.supabaseUrl || 'https://bpmatlkrotoftowpsbcz.supabase.co';
  const webhookUrl = `${baseSupabaseUrl}/functions/v1/github-webhook`;

  useEffect(() => {
    if (selectedProject) {
      setGithubRepo(selectedProject.githubRepo || '');
      setGithubBranch(selectedProject.githubBranch || 'main');
      setGithubWebhookSecret(selectedProject.githubWebhookSecret || '');
      setSupabaseUrl(selectedProject.supabaseUrl || '');
      setSupabaseAnonKey(selectedProject.supabaseAnonKey || '');
      setSuccessSaved(false);
    }
  }, [selectedProject]);

  const handleCopy = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveSettings = () => {
    const updated = projects.map((p: Project) => {
      if (p.id === selectedProject.id) {
        return {
          ...p,
          githubRepo,
          githubBranch,
          githubWebhookSecret,
          supabaseUrl,
          supabaseAnonKey
        };
      }
      return p;
    });
    setProjects(updated);
    setSuccessSaved(true);
    setTimeout(() => setSuccessSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[18px] font-black tracking-tight text-txt-primary">Cấu hình dự án</h2>
          <p className="text-[12px] text-txt-muted">Quản lý tích hợp GitHub Webhook và cơ sở dữ liệu Supabase của dự án hiện tại.</p>
        </div>
        <span className="text-[11px] font-bold text-primary-500 bg-primary-500/10 px-3 py-1 rounded-full border border-primary-500/20 uppercase tracking-widest font-mono">
          {selectedProject?.repo}
        </span>
      </div>

      {successSaved && (
        <div className="rounded-xl bg-success-500/10 border border-success-500/20 p-4 text-[13px] text-success-400 flex items-center gap-2 font-semibold animate-fadeIn">
          <CheckCircle2 size={16} />
          <span>Đã lưu thành công mọi thiết lập cấu hình của dự án "{selectedProject?.name}"!</span>
        </div>
      )}

      {/* GitHub Integration Card */}
      <div className="card p-6 space-y-6">
        <div className="border-b border-bd pb-4">
          <h3 className="text-[15px] font-black text-txt-primary flex items-center gap-2">
            <GitBranch size={16} className="text-primary-500" />
            <span>Liên kết Kho mã nguồn GitHub</span>
          </h3>
          <p className="text-[12px] text-txt-muted mt-1">Liên kết dự án của bạn với repository GitHub để tự động đồng bộ hóa hoạt động commits/PRs.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-txt-secondary block uppercase tracking-wider">Tên Repository (chủ_sở_hữu/tên_repo)</label>
            <input 
              type="text" 
              placeholder="Ví dụ: owner/repo-name" 
              value={githubRepo}
              onChange={e => setGithubRepo(e.target.value)}
              className="w-full rounded-xl border border-bd bg-app px-3 py-2.5 text-[13px] text-txt-primary focus:border-primary-500 focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-txt-secondary block uppercase tracking-wider">Nhánh mặc định (Default Branch)</label>
            <input 
              type="text" 
              value={githubBranch}
              onChange={e => setGithubBranch(e.target.value)}
              className="w-full rounded-xl border border-bd bg-app px-3 py-2.5 text-[13px] text-txt-primary focus:border-primary-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Supabase Configuration Card */}
      <div className="card p-6 space-y-6">
        <div className="border-b border-bd pb-4">
          <h3 className="text-[15px] font-black text-txt-primary flex items-center gap-2">
            <Database size={16} className="text-primary-500" />
            <span>Cấu hình Cơ sở dữ liệu Supabase</span>
          </h3>
          <p className="text-[12px] text-txt-muted mt-1">Lưu trữ các thông số kết nối Supabase phục vụ cho việc tích hợp tính năng Backend và Realtime.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="sm:col-span-1 space-y-2">
            <label className="text-[11px] font-bold text-txt-secondary block uppercase tracking-wider">Supabase URL</label>
            <input 
              type="text" 
              placeholder="https://your-project.supabase.co" 
              value={supabaseUrl}
              onChange={e => setSupabaseUrl(e.target.value)}
              className="w-full rounded-xl border border-bd bg-app px-3 py-2.5 text-[13px] text-txt-primary focus:border-primary-500 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2 space-y-2">
            <label className="text-[11px] font-bold text-txt-secondary block uppercase tracking-wider">Supabase Anon Key (Public Key)</label>
            <input 
              type="password" 
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." 
              value={supabaseAnonKey}
              onChange={e => setSupabaseAnonKey(e.target.value)}
              className="w-full rounded-xl border border-bd bg-app px-3 py-2.5 text-[13px] text-txt-primary focus:border-primary-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Webhook Configuration Card */}
      <div className="card p-6 space-y-6">
        <div className="border-b border-bd pb-4">
          <h3 className="text-[15px] font-black text-txt-primary flex items-center gap-2">
            <Globe size={16} className="text-primary-500" />
            <span>Cấu hình GitHub Webhook</span>
          </h3>
          <p className="text-[12px] text-txt-muted mt-1">Sao chép URL Webhook này và cấu hình trên kho GitHub của bạn để tự động cập nhật công việc.</p>
        </div>

        {/* Webhook URL Display */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-txt-secondary block uppercase tracking-wider">Payload URL (Địa chỉ nhận webhook)</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              readOnly 
              value={webhookUrl}
              className="flex-1 rounded-xl border border-bd bg-app/50 px-3 py-2.5 text-[13px] text-txt-muted mono focus:outline-none"
            />
            <button 
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-xl border border-bd bg-surface px-4 py-2.5 text-[13px] font-bold text-txt-primary hover:bg-subtle transition-colors shrink-0"
            >
              {copied ? <Check size={16} className="text-success-500" /> : <Copy size={16} />}
              <span>{copied ? 'Đã sao chép' : 'Sao chép'}</span>
            </button>
          </div>
        </div>

        {/* Webhook Secret Key */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-txt-secondary block uppercase tracking-wider">Khóa bảo mật Webhook (Webhook Secret)</label>
          <div className="relative">
            <input 
              type="password" 
              placeholder="Nhập secret key để xác thực chữ ký" 
              value={githubWebhookSecret}
              onChange={e => setGithubWebhookSecret(e.target.value)}
              className="w-full rounded-xl border border-bd bg-app px-3 py-2.5 text-[13px] text-txt-primary focus:border-primary-500 focus:outline-none"
            />
          </div>
          <p className="text-[11px] text-txt-muted">Khóa bảo mật dùng để xác thực các yêu cầu gửi đến từ GitHub.</p>
        </div>

        {/* Instructions */}
        <div className="rounded-xl bg-subtle/30 border border-bd p-4 space-y-2">
          <h4 className="text-[12px] font-bold text-txt-primary flex items-center gap-1.5">
            <HelpCircle size={14} className="text-info-500" />
            <span>Hướng dẫn cấu hình trên GitHub:</span>
          </h4>
          <ol className="list-decimal pl-5 text-[12px] text-txt-secondary space-y-1">
            <li>Truy cập vào GitHub Repository của bạn → chọn tab <strong>Settings</strong>.</li>
            <li>Chọn mục <strong>Webhooks</strong> ở danh mục bên trái → Click <strong>Add webhook</strong>.</li>
            <li>Dán URL vừa sao chép vào trường <strong>Payload URL</strong>.</li>
            <li>Đặt <strong>Content type</strong> thành <code className="bg-bd/50 px-1 py-0.5 rounded text-txt-primary">application/json</code>.</li>
            <li>Dán khóa bảo mật (Secret Key) tương tự vào trường <strong>Secret</strong>.</li>
            <li>Chọn sự kiện gửi đi: <strong>Just the push event</strong> và <strong>Pull requests</strong>.</li>
            <li>Bấm <strong>Add webhook</strong> để hoàn tất.</li>
          </ol>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button 
          onClick={handleSaveSettings}
          className="flex items-center gap-2 rounded-xl bg-primary-500 hover:bg-primary-600 px-6 py-3 text-[14px] font-bold text-white transition-all shadow-card active:scale-95"
        >
          <Save size={16} />
          <span>Lưu thiết lập</span>
        </button>
      </div>
    </div>
  );
}
