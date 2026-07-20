import { useState } from 'react';
import { useParams, useOutletContext, Link } from 'react-router-dom';
import { 
  ArrowLeft,
  LayoutDashboard,
  Layers,
  KanbanSquare,
  Settings as SettingsIcon,
  Building2,
  GitBranch
} from 'lucide-react';
import Dashboard from './Dashboard';
import Backlog from './Backlog';
import Board from './Board';
import Settings from './Settings';

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
}

interface Customer {
  id: string;
  name: string;
  code: string;
}

interface OutletContextType {
  projects: Project[];
  customers: Customer[];
}

export default function ProjectDetail() {
  const { projectId } = useParams<{ projectId: string }>();
  const { projects, customers } = useOutletContext<OutletContextType>();
  const [activeTab, setActiveTab] = useState<'overview' | 'backlog' | 'board' | 'settings'>('overview');

  const currentProject = projects.find(p => p.id === projectId);

  if (!currentProject) {
    return (
      <div className="card p-8 text-center space-y-4 max-w-md mx-auto mt-12">
        <h3 className="text-[16px] font-black text-txt-primary">Không tìm thấy dự án</h3>
        <p className="text-[12px] text-txt-muted">Dự án bạn đang yêu cầu không tồn tại hoặc đã bị xóa khỏi hệ thống.</p>
        <Link 
          to="/projects"
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary-500 hover:bg-primary-600 px-4 py-2 text-[13px] font-bold text-white transition-all"
        >
          <ArrowLeft size={14} />
          <span>Quay lại danh sách</span>
        </Link>
      </div>
    );
  }

  const customer = customers.find(c => c.id === currentProject.customerId);

  const tabs = [
    { id: 'overview', name: 'Tổng quan', icon: LayoutDashboard },
    { id: 'backlog', name: 'Kế hoạch Backlog', icon: Layers },
    { id: 'board', name: 'Bảng Sprint', icon: KanbanSquare },
    { id: 'settings', name: 'Cấu hình', icon: SettingsIcon },
  ] as const;

  return (
    <div className="space-y-6">
      
      {/* Project Detail Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-bd pb-4">
        <div className="space-y-2">
          <Link 
            to="/projects"
            className="inline-flex items-center gap-1 text-[12px] font-bold text-txt-muted hover:text-primary-500 transition-colors"
          >
            <ArrowLeft size={12} />
            <span>Danh sách dự án</span>
          </Link>
          <h2 className="text-[20px] font-black text-txt-primary tracking-tight leading-snug">
            {currentProject.name}
          </h2>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] font-medium text-txt-secondary">
            {customer && (
              <span className="flex items-center gap-1.5">
                <Building2 size={13} className="text-txt-muted" />
                <span>Khách hàng: <strong>{customer.name}</strong></span>
              </span>
            )}
            <span className="flex items-center gap-1.5 font-mono text-[11px] text-txt-muted">
              <GitBranch size={13} />
              <span>{currentProject.githubRepo}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Selector Navigation */}
      <div className="flex border-b border-bd/60 gap-1 overflow-x-auto pb-px">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 text-[13px] font-bold transition-all border-b-2 shrink-0 ${
                isSelected 
                  ? 'border-primary-500 text-primary-500 bg-primary-500/5' 
                  : 'border-transparent text-txt-secondary hover:text-txt-primary hover:bg-subtle/40'
              }`}
            >
              <Icon size={16} />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Render Area */}
      <div className="py-2">
        {activeTab === 'overview' && <Dashboard />}
        {activeTab === 'backlog' && <Backlog />}
        {activeTab === 'board' && <Board />}
        {activeTab === 'settings' && <Settings />}
      </div>

    </div>
  );
}
