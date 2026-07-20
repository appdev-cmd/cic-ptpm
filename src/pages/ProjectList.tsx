import { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  ChevronRight, 
  Building2, 
  GitBranch, 
  Database,
  ExternalLink,
  FolderKanban,
  X
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

interface Customer {
  id: string;
  name: string;
  code: string;
}

interface OutletContextType {
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  customers: Customer[];
}

const PROJECT_PROGRESS_DATA: Record<string, { progress: number; status: string }> = {
  'cic-ptpm': { progress: 68, status: 'Đang triển khai' },
  'cic-erp': { progress: 45, status: 'Đang triển khai' },
  'cic-ibst': { progress: 82, status: 'Đang triển khai' },
  'cic-web': { progress: 95, status: 'Nghiệm thu' },
  'cic-cde': { progress: 30, status: 'Đang triển khai' },
  'cic-ai-chatbox': { progress: 60, status: 'Đang triển khai' },
  'cic-nova': { progress: 50, status: 'Đang triển khai' },
  'cic-vicem': { progress: 75, status: 'Đang triển khai' },
  'qlda-ddht-ht-selfhost': { progress: 40, status: 'Đang triển khai' },
  'cic-ai': { progress: 55, status: 'Đang triển khai' }
};

const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case 'Hoàn thành': return 'bg-success-500/10 text-success-400 border-success-500/20';
    case 'Nghiệm thu': return 'bg-info-500/10 text-info-400 border-info-500/20';
    case 'Lập kế hoạch': return 'bg-bd text-txt-muted border-bd-subtle';
    default: return 'bg-warning-500/10 text-warning-400 border-warning-500/20';
  }
};

export default function ProjectList() {
  const { projects, setProjects, customers } = useOutletContext<OutletContextType>();
  const navigate = useNavigate();

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Project Form States
  const [newName, setNewName] = useState('');
  const [newRepo, setNewRepo] = useState('');
  const [newGithubRepo, setNewGithubRepo] = useState('');
  const [newCustomerId, setNewCustomerId] = useState('');
  const [newVercelUrl, setNewVercelUrl] = useState('');
  const [newSupabaseUrl, setNewSupabaseUrl] = useState('');
  const [newSupabaseAnonKey, setNewSupabaseAnonKey] = useState('');
  const [newGoal, setNewGoal] = useState('');

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newRepo) {
      alert('Vui lòng điền đầy đủ Tên dự án và Tên repository GitHub.');
      return;
    }

    const newProjId = String(projects.length + 1);
    const newProjObj: Project = {
      id: newProjId,
      name: newName,
      repo: newRepo.toLowerCase(),
      githubRepo: newGithubRepo || `appdev-cmd/${newRepo.toLowerCase()}`,
      githubBranch: 'main',
      githubWebhookSecret: `secret_${newRepo.toLowerCase()}`,
      vercelUrl: newVercelUrl,
      supabaseUrl: newSupabaseUrl,
      supabaseAnonKey: newSupabaseAnonKey,
      customerId: newCustomerId,
      goal: newGoal
    };

    setProjects([...projects, newProjObj]);
    
    // Clear state & close modal
    setNewName('');
    setNewRepo('');
    setNewGithubRepo('');
    setNewCustomerId('');
    setNewVercelUrl('');
    setNewSupabaseUrl('');
    setNewSupabaseAnonKey('');
    setNewGoal('');
    setShowAddModal(false);

    // Redirect to detail page of newly created project
    navigate(`/projects/${newProjId}`);
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.repo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCustomer = !selectedCustomerId || p.customerId === selectedCustomerId;
    return matchesSearch && matchesCustomer;
  });

  return (
    <div className="space-y-6">
      
      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full sm:max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-txt-muted" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm dự án (tên, repo)..."
            className="w-full rounded-xl border border-bd bg-surface pl-10 pr-4 py-2.5 text-[13px] text-txt-primary focus:border-primary-500 focus:outline-none"
          />
        </div>

        {/* Filters & Add Button */}
        <div className="flex w-full sm:w-auto items-center gap-3">
          <div className="relative flex-1 sm:flex-none">
            <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-txt-muted" />
            <select
              value={selectedCustomerId}
              onChange={e => setSelectedCustomerId(e.target.value)}
              className="w-full sm:w-48 rounded-xl border border-bd bg-surface pl-8 pr-3 py-2.5 text-[13px] text-txt-primary focus:border-primary-500 focus:outline-none appearance-none"
            >
              <option value="">Lọc theo khách hàng</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.code}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-primary-500 hover:bg-primary-600 px-4 py-2.5 text-[13px] font-bold text-white transition-all shadow-card shrink-0 active:scale-95"
          >
            <Plus size={16} />
            <span>Tạo dự án mới</span>
          </button>
        </div>
      </div>

      {/* Projects List Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((proj) => {
          const extra = PROJECT_PROGRESS_DATA[proj.repo] || { progress: 35, status: 'Lập kế hoạch' };
          const customer = customers.find(c => c.id === proj.customerId);
          
          return (
            <div 
              key={proj.id} 
              onClick={() => navigate(`/projects/${proj.id}`)}
              className="card p-5 space-y-4 flex flex-col justify-between hover:border-bd-subtle transition-all duration-300 group cursor-pointer"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-[15px] font-black text-txt-primary leading-snug group-hover:text-primary-500 transition-colors">
                    {proj.name}
                  </h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold shrink-0 ${getStatusBadgeColor(extra.status)}`}>
                    {extra.status}
                  </span>
                </div>

                <div className="space-y-2 text-[12px] text-txt-secondary font-medium">
                  <div className="flex items-center gap-2">
                    <Building2 size={13} className="text-txt-muted shrink-0" />
                    <span className="truncate">{customer ? customer.name : 'Chưa liên kết đối tác'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GitBranch size={13} className="text-txt-muted shrink-0" />
                    <span className="font-mono text-[11px] text-txt-muted truncate">{proj.githubRepo}</span>
                  </div>
                  {proj.vercelUrl && (
                    <div className="flex items-center gap-2">
                      <ExternalLink size={13} className="text-txt-muted shrink-0" />
                      <span className="text-primary-400 font-mono truncate text-[11px]">{proj.vercelUrl.replace('https://', '')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress & Bottom Bar */}
              <div className="border-t border-bd/40 pt-4 mt-auto space-y-2.5">
                <div className="flex justify-between items-center text-[11px] font-bold text-txt-secondary">
                  <span>Tiến độ tổng thể</span>
                  <span className="text-primary-500 font-mono">{extra.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-bd/40 rounded-full overflow-hidden">
                  <div 
                    className="bg-primary-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${extra.progress}%` }}
                  />
                </div>
                <div className="flex justify-end pt-1">
                  <span className="text-[12px] font-bold text-primary-500 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    <span>Xem chi tiết</span>
                    <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Project Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="card w-full max-w-2xl bg-surface border-bd p-6 space-y-6 shadow-pop relative max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-bd pb-3">
              <h3 className="text-[16px] font-black text-txt-primary flex items-center gap-2">
                <FolderKanban size={18} className="text-primary-500" />
                <span>Khởi tạo Dự án Mới</span>
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-txt-muted hover:text-txt-primary p-1.5 rounded-lg hover:bg-subtle transition-all"
              >
                <X size={16} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-txt-secondary block uppercase tracking-wider">Tên Dự án *</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    placeholder="Ví dụ: Hệ thống Quản lý Vật tư"
                    className="w-full rounded-xl border border-bd bg-app px-3 py-2 text-[13px] text-txt-primary focus:border-primary-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-txt-secondary block uppercase tracking-wider">Repository Key / Short name *</label>
                  <input
                    type="text"
                    required
                    value={newRepo}
                    onChange={e => setNewRepo(e.target.value)}
                    placeholder="Ví dụ: cic-vattu"
                    className="w-full rounded-xl border border-bd bg-app px-3 py-2 text-[13px] text-txt-primary focus:border-primary-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-txt-secondary block uppercase tracking-wider">GitHub Repo Path (org/repo)</label>
                  <input
                    type="text"
                    value={newGithubRepo}
                    onChange={e => setNewGithubRepo(e.target.value)}
                    placeholder="Ví dụ: appdev-cmd/cic-vattu (mặc định)"
                    className="w-full rounded-xl border border-bd bg-app px-3 py-2 text-[13px] text-txt-primary focus:border-primary-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-txt-secondary block uppercase tracking-wider">Khách hàng liên kết</label>
                  <select
                    value={newCustomerId}
                    onChange={e => setNewCustomerId(e.target.value)}
                    className="w-full rounded-xl border border-bd bg-app px-3 py-2 text-[13px] text-txt-primary focus:border-primary-500 focus:outline-none"
                  >
                    <option value="">-- Chưa liên kết khách hàng --</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-txt-secondary block uppercase tracking-wider">Mô tả mục tiêu dự án</label>
                <textarea
                  value={newGoal}
                  onChange={e => setNewGoal(e.target.value)}
                  placeholder="Mô tả ngắn gọn về nghiệp vụ và mục tiêu..."
                  className="w-full rounded-xl border border-bd bg-app px-3 py-2 text-[13px] text-txt-primary focus:border-primary-500 focus:outline-none"
                  rows={2}
                />
              </div>

              <div className="space-y-1.5 pt-2 border-t border-bd/40">
                <h4 className="text-[12px] font-bold text-txt-primary flex items-center gap-1.5">
                  <Database size={13} className="text-primary-500" />
                  <span>Cấu hình Deploy & Supabase (Tùy chọn)</span>
                </h4>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-txt-secondary block uppercase tracking-wider">Vercel Deployment URL</label>
                <input
                  type="text"
                  value={newVercelUrl}
                  onChange={e => setNewVercelUrl(e.target.value)}
                  placeholder="https://my-project-deploy.vercel.app"
                  className="w-full rounded-xl border border-bd bg-app px-3 py-2 text-[13px] text-txt-primary focus:border-primary-500 focus:outline-none"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="sm:col-span-1 space-y-1.5">
                  <label className="text-[11px] font-bold text-txt-secondary block uppercase tracking-wider">Supabase URL</label>
                  <input
                    type="text"
                    value={newSupabaseUrl}
                    onChange={e => setNewSupabaseUrl(e.target.value)}
                    placeholder="https://proj-id.supabase.co"
                    className="w-full rounded-xl border border-bd bg-app px-3 py-2 text-[13px] text-txt-primary focus:border-primary-500 focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-[11px] font-bold text-txt-secondary block uppercase tracking-wider">Supabase Anon Key</label>
                  <input
                    type="password"
                    value={newSupabaseAnonKey}
                    onChange={e => setNewSupabaseAnonKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1Ni..."
                    className="w-full rounded-xl border border-bd bg-app px-3 py-2 text-[13px] text-txt-primary focus:border-primary-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-bd hover:bg-subtle px-4 py-2.5 text-[13px] font-bold text-txt-secondary transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-primary-500 hover:bg-primary-600 px-5 py-2.5 text-[13px] font-bold text-white transition-all shadow-card"
                >
                  Khởi tạo dự án
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
