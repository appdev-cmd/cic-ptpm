import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Layers, 
  KanbanSquare, 
  Settings, 
  ChevronDown, 
  FolderKanban,
  User,
  Plus
} from 'lucide-react';

const MOCK_PROJECTS = [
  { id: '1', name: 'Hệ thống Quản lý IBST', repo: 'cic-ibst' },
  { id: '2', name: 'Đồ họa SoDoBo', repo: 'cic-sodobo' },
  { id: '3', name: 'Cổng thông tin HUD', repo: 'cic-hud' }
];

export default function MainLayout() {
  const location = useLocation();
  const [selectedProject, setSelectedProject] = useState(MOCK_PROJECTS[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const menuItems = [
    { path: '/', name: 'Tổng quan', icon: LayoutDashboard },
    { path: '/backlog', name: 'Kế hoạch Backlog', icon: Layers },
    { path: '/board', name: 'Bảng Sprint hiện tại', icon: KanbanSquare },
    { path: '/settings', name: 'Cấu hình dự án', icon: Settings },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-app text-txt-primary font-sans select-none">
      {/* Sidebar */}
      <aside className="flex w-64 flex-col border-r border-bd bg-surface">
        {/* Brand & Project Selector */}
        <div className="relative border-b border-bd p-4">
          <div className="flex items-center gap-2 eyebrow mb-2">
            <FolderKanban size={12} />
            <span>Không gian làm việc</span>
          </div>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex w-full items-center justify-between gap-2 rounded-xl border border-bd bg-app px-3 py-2 text-[14px] font-bold text-txt-primary hover:border-bd-subtle transition-colors"
          >
            <span className="truncate">{selectedProject.name}</span>
            <ChevronDown size={16} className={`text-txt-muted transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute left-4 right-4 z-50 mt-1 rounded-xl border border-bd bg-elevated shadow-pop p-1">
              {MOCK_PROJECTS.map((proj) => (
                <button
                  key={proj.id}
                  onClick={() => {
                    setSelectedProject(proj);
                    setIsDropdownOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-[13px] text-left hover:bg-subtle transition-colors ${selectedProject.id === proj.id ? 'font-bold text-rgb(var(--primary-500)) bg-subtle/50' : 'text-txt-secondary'}`}
                >
                  <span>{proj.name}</span>
                </button>
              ))}
              <div className="border-t border-bd my-1"></div>
              <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[13px] text-txt-muted hover:bg-subtle transition-colors">
                <Plus size={14} />
                <span>Tạo dự án mới</span>
              </button>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 space-y-1 p-3">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-[14px] font-medium transition-colors ${
                  isActive 
                    ? 'bg-subtle text-txt-primary border-l-4 border-[rgb(var(--primary-500))]' 
                    : 'text-txt-secondary hover:bg-subtle hover:text-txt-primary'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-[rgb(var(--primary-500))]' : 'text-txt-muted'} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info Footbar */}
        <div className="border-t border-bd p-4 bg-app/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-subtle border border-bd text-txt-primary">
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
            {menuItems.find(item => item.path === location.pathname)?.name || 'Hệ thống'}
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
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
