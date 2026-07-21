import { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderKanban,
  User,
  Users,
  Building2,
  Cpu,
  ClipboardList
} from 'lucide-react';
import { supabase } from '../utils/supabaseClient';

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
  currentStep?: number;
  stepProgress?: Record<string, number>;
  memberIds?: string[];
}

interface Customer {
  id: string;
  name: string;
  code: string;
  email: string;
  phone: string;
  address: string;
}

interface Employee {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  skills: string[];
  avatar: string;
}

export default function MainLayout() {
  const location = useLocation();

  const [projects, setProjects] = useState<Project[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Customers
      const { data: custData, error: custErr } = await supabase
        .from('customers')
        .select('*')
        .order('name');
      if (custErr) throw custErr;

      // 2. Fetch Projects
      const { data: projData, error: projErr } = await supabase
        .from('projects')
        .select('*')
        .order('id');
      if (projErr) throw projErr;

      // 3. Fetch Employees
      const { data: empData, error: empErr } = await supabase
        .from('employees')
        .select('*')
        .order('name');
      if (empErr) throw empErr;

      // Map DB snake_case columns back to camelCase properties for projects
      const mappedProjects = (projData || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        repo: p.repo,
        githubRepo: p.github_repo,
        githubBranch: p.github_branch,
        githubWebhookSecret: p.github_webhook_secret,
        vercelUrl: p.vercel_url,
        supabaseUrl: p.supabase_url,
        supabaseAnonKey: p.supabase_anon_key,
        customerId: p.customer_id,
        goal: p.goal,
        currentStep: p.current_step || 4,
        stepProgress: p.step_progress || { "1": 100, "2": 100, "3": 100, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0 },
        memberIds: p.member_ids || ['e1', 'e2', 'e3']
      }));

      // Auto-sync with GitHub: Fetch repos from appdev-cmd and insert missing ones
      try {
        const ghResponse = await fetch('https://api.github.com/users/appdev-cmd/repos?per_page=100&sort=created&direction=desc');
        if (ghResponse.ok) {
          const ghRepos = await ghResponse.json();
          const existingRepos = new Set(mappedProjects.map((p: any) => p.repo.toLowerCase()));
          const newProjects: any[] = [];
          
          for (const repo of ghRepos) {
            // Ignore template or unrelated repos if needed, here we accept all new ones
            if (!existingRepos.has(repo.name.toLowerCase())) {
              const newProjId = `p${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
              const newProjectObj = {
                id: newProjId,
                name: repo.description || repo.name,
                repo: repo.name,
                githubRepo: `appdev-cmd/${repo.name}`,
                githubBranch: repo.default_branch || 'main',
                currentStep: 1,
                stepProgress: { "1": 100, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0 },
                memberIds: ['e1', 'e2', 'e3']
              };
              
              newProjects.push(newProjectObj);
              
              // Insert into Supabase
              await supabase.from('projects').insert({
                id: newProjectObj.id,
                name: newProjectObj.name,
                repo: newProjectObj.repo,
                github_repo: newProjectObj.githubRepo,
                github_branch: newProjectObj.githubBranch,
                current_step: newProjectObj.currentStep,
                step_progress: newProjectObj.stepProgress,
                member_ids: newProjectObj.memberIds
              });
            }
          }
          
          if (newProjects.length > 0) {
            console.log(`Auto-synced ${newProjects.length} new repositories from GitHub.`);
            mappedProjects.push(...newProjects);
          }
        }
      } catch (ghErr) {
        console.error('Error auto-syncing GitHub repos:', ghErr);
      }

      setCustomers(custData || []);
      setProjects(mappedProjects);
      setEmployees(empData || []);
    } catch (err: any) {
      console.error('Error fetching data from Supabase:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Intercepting update functions to save to Supabase dynamically
  const handleUpdateProjects = async (newProjects: Project[]) => {
    setProjects(newProjects);
    try {
      for (const p of newProjects) {
        const oldP = projects.find(op => op.id === p.id);
        if (!oldP || JSON.stringify(oldP) !== JSON.stringify(p)) {
          const { error } = await supabase
            .from('projects')
            .upsert({
              id: p.id,
              name: p.name,
              repo: p.repo,
              github_repo: p.githubRepo,
              github_branch: p.githubBranch,
              github_webhook_secret: p.githubWebhookSecret,
              vercel_url: p.vercelUrl,
              supabase_url: p.supabaseUrl,
              supabase_anon_key: p.supabaseAnonKey,
              customer_id: p.customerId || null,
              goal: p.goal,
              current_step: p.currentStep || 4,
              step_progress: p.stepProgress || { "1": 100, "2": 100, "3": 100, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0 },
              member_ids: p.memberIds || ['e1', 'e2', 'e3']
            });
          if (error) throw error;
        }
      }
      for (const op of projects) {
        if (!newProjects.some(p => p.id === op.id)) {
          const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', op.id);
          if (error) throw error;
        }
      }
    } catch (err: any) {
      console.error('Error saving projects to Supabase:', err.message);
    }
  };

  const handleUpdateCustomers = async (newCustomers: Customer[]) => {
    setCustomers(newCustomers);
    try {
      for (const c of newCustomers) {
        const oldC = customers.find(oc => oc.id === c.id);
        if (!oldC || JSON.stringify(oldC) !== JSON.stringify(c)) {
          const { error } = await supabase
            .from('customers')
            .upsert(c);
          if (error) throw error;
        }
      }
      for (const oc of customers) {
        if (!newCustomers.some(c => c.id === oc.id)) {
          const { error } = await supabase
            .from('customers')
            .delete()
            .eq('id', oc.id);
          if (error) throw error;
        }
      }
    } catch (err: any) {
      console.error('Error saving customers to Supabase:', err.message);
    }
  };

  const handleUpdateEmployees = async (newEmployees: Employee[]) => {
    setEmployees(newEmployees);
    try {
      for (const e of newEmployees) {
        const oldE = employees.find(oe => oe.id === e.id);
        if (!oldE || JSON.stringify(oldE) !== JSON.stringify(e)) {
          const { error } = await supabase
            .from('employees')
            .upsert(e);
          if (error) throw error;
        }
      }
      for (const oe of employees) {
        if (!newEmployees.some(e => e.id === oe.id)) {
          const { error } = await supabase
            .from('employees')
            .delete()
            .eq('id', oe.id);
          if (error) throw error;
        }
      }
    } catch (err: any) {
      console.error('Error saving employees to Supabase:', err.message);
    }
  };

  const menuItems = [
    { path: '/', name: 'Tổng quan', icon: LayoutDashboard },
    { path: '/projects', name: 'Dự án', icon: FolderKanban },
    { path: '/employees', name: 'Nhân viên', icon: Users },
    { path: '/customers', name: 'Khách hàng', icon: Building2 },
    { path: '/processes', name: 'Quy trình', icon: ClipboardList },
  ];

  const getHeaderTitle = () => {
    if (location.pathname.startsWith('/projects/')) return 'Chi tiết dự án';
    return menuItems.find(item => item.path === location.pathname)?.name || 'Hệ thống';
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-app text-txt-primary">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-500/10 border border-primary-500/20 text-primary-500">
            <Cpu size={26} className="animate-spin" />
          </div>
          <div className="text-[13px] font-bold text-txt-secondary uppercase tracking-wider animate-pulse">
            Đang kết nối database Supabase Cloud...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-app text-txt-primary font-sans select-none">
      {/* Sidebar */}
      <aside className="flex w-64 flex-col border-r border-bd bg-surface">
        {/* Brand Header */}
        <div className="border-b border-bd p-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/10 border border-primary-500/20 text-primary-500">
            <Cpu size={22} className="animate-pulse" />
          </div>
          <div>
            <h1 className="text-[14px] font-black text-txt-primary leading-tight uppercase tracking-wider">Trung tâm PTPM</h1>
            <span className="text-[10px] font-bold text-txt-muted tracking-widest uppercase">CIC Software Hub</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 space-y-1 p-3">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path === '/projects' && location.pathname.startsWith('/projects/'));
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-[14px] font-medium transition-all ${
                  isActive 
                    ? 'bg-subtle text-txt-primary border-l-4 border-primary-500' 
                    : 'text-txt-secondary hover:bg-subtle hover:text-txt-primary'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-primary-500' : 'text-txt-muted'} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info Footbar */}
        <div className="border-t border-bd p-4 bg-app/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-subtle border border-bd text-txt-primary font-bold">
              <User size={18} />
            </div>
            <div>
              <div className="text-[13px] font-bold text-txt-primary">Phát Triển</div>
              <div className="text-[11px] text-txt-muted">Quản trị viên (SM)</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex h-14 items-center justify-between border-b border-bd bg-surface px-6">
          <h2 className="text-[16px] font-black tracking-tight text-txt-primary">
            {getHeaderTitle()}
          </h2>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-bd/20 border border-bd px-3 py-1 text-[11px] font-semibold text-txt-muted mono">
              phiên bản v1.0.0
            </div>
          </div>
        </header>

        {/* Route Pages Container */}
        <main className="flex-1 overflow-y-auto bg-app p-6">
          <div className="mx-auto max-w-7xl">
            <Outlet context={{ 
              projects, 
              setProjects: handleUpdateProjects, 
              customers, 
              setCustomers: handleUpdateCustomers,
              employees,
              setEmployees: handleUpdateEmployees
            }} />
          </div>
        </main>
      </div>
    </div>
  );
}
