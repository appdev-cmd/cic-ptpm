import { useState } from 'react';
import { 
  Plus, 
  ChevronRight, 
  ChevronDown, 
  Play, 
  Calendar,
  Layers,
  Bug,
  HelpCircle
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  type: 'story' | 'task' | 'bug';
  priority: 'high' | 'medium' | 'low';
  storyPoints: number;
  assignee: { name: string; avatar: string } | null;
}

interface Sprint {
  id: string;
  name: string;
  status: 'active' | 'planning' | 'completed';
  startDate: string;
  endDate: string;
  tasks: Task[];
}

const INITIAL_SPRINTS: Sprint[] = [
  {
    id: 'sprint-1',
    name: 'Sprint 1 - Kiến trúc cốt lõi',
    status: 'active',
    startDate: '2026-07-10',
    endDate: '2026-07-24',
    tasks: [
      { id: 'TASK-1', title: 'Thiết kế cơ cấu dữ liệu và RLS của Supabase', type: 'story', priority: 'high', storyPoints: 5, assignee: { name: 'Thành viên A', avatar: 'A' } },
      { id: 'TASK-2', title: 'Viết Supabase Edge Function đón nhận Webhook', type: 'task', priority: 'high', storyPoints: 8, assignee: { name: 'Thành viên B', avatar: 'B' } },
      { id: 'BUG-1', title: 'Lỗi parse webhook đối với PR merge không đúng task ID', type: 'bug', priority: 'medium', storyPoints: 3, assignee: { name: 'Thành viên A', avatar: 'A' } }
    ]
  },
  {
    id: 'sprint-2',
    name: 'Sprint 2 - Giao diện & Realtime',
    status: 'planning',
    startDate: '2026-07-25',
    endDate: '2026-08-08',
    tasks: [
      { id: 'TASK-3', title: 'Tích hợp kéo thả dnd-kit trên bảng Kanban', type: 'story', priority: 'medium', storyPoints: 5, assignee: null },
      { id: 'TASK-4', title: 'Xây dựng trang Dashboard và biểu đồ Burndown Chart', type: 'task', priority: 'low', storyPoints: 3, assignee: null }
    ]
  }
];

const INITIAL_BACKLOG: Task[] = [
  { id: 'TASK-5', title: 'Cấu hình GitHub OAuth đăng nhập ứng dụng', type: 'task', priority: 'medium', storyPoints: 2, assignee: null },
  { id: 'TASK-6', title: 'Hệ thống gửi thông báo Email khi task trễ hạn', type: 'story', priority: 'low', storyPoints: 5, assignee: null },
  { id: 'BUG-2', title: 'Giao diện Sidebar hiển thị lệch nút chọn dự án trên Safari', type: 'bug', priority: 'low', storyPoints: 1, assignee: null }
];

export default function Backlog() {
  const [sprints] = useState<Sprint[]>(INITIAL_SPRINTS);
  const [backlog] = useState<Task[]>(INITIAL_BACKLOG);
  const [expandedSprints, setExpandedSprints] = useState<Record<string, boolean>>({
    'sprint-1': true,
    'sprint-2': true
  });

  const toggleSprint = (id: string) => {
    setExpandedSprints(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getTaskIcon = (type: Task['type']) => {
    switch (type) {
      case 'story': return <Layers size={14} className="text-info-500" />;
      case 'bug': return <Bug size={14} className="text-danger-500" />;
      default: return <HelpCircle size={14} className="text-warning-500" />;
    }
  };

  const getPriorityInfo = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return { name: 'Cao', class: 'bg-danger-500/10 text-danger-500 border-danger-500/20' };
      case 'medium': return { name: 'Trung bình', class: 'bg-warning-500/10 text-warning-500 border-warning-500/20' };
      default: return { name: 'Thấp', class: 'bg-bd/40 text-txt-secondary border-bd' };
    }
  };

  const getTaskTypeName = (type: Task['type']) => {
    switch (type) {
      case 'story': return 'Tính năng';
      case 'bug': return 'Sửa lỗi';
      default: return 'Nhiệm vụ';
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[16px] font-bold text-txt-primary">Quản lý Backlog</h3>
          <p className="text-[12px] text-txt-muted">Lên kế hoạch cho các Sprint và các hạng mục công việc tồn đọng</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-xl border border-bd bg-surface px-4 py-2 text-[13px] font-bold text-txt-primary hover:border-bd-subtle transition-colors">
            <Plus size={16} />
            <span>Tạo Sprint mới</span>
          </button>
          <button className="flex items-center gap-2 rounded-xl bg-primary-500 hover:bg-primary-600 px-4 py-2 text-[13px] font-bold text-white transition-all shadow-card active:scale-95">
            <Plus size={16} />
            <span>Tạo Nhiệm vụ mới</span>
          </button>
        </div>
      </div>

      {/* Sprints List */}
      <div className="space-y-4">
        {sprints.map((sprint) => {
          const isExpanded = expandedSprints[sprint.id];
          const totalPoints = sprint.tasks.reduce((sum, t) => sum + t.storyPoints, 0);

          return (
            <div key={sprint.id} className="card overflow-hidden">
              {/* Sprint Header */}
              <div 
                onClick={() => toggleSprint(sprint.id)}
                className="flex items-center justify-between bg-surface/50 px-4 py-3 cursor-pointer select-none border-b border-bd/50 hover:bg-subtle/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {isExpanded ? <ChevronDown size={16} className="text-txt-muted" /> : <ChevronRight size={16} className="text-txt-muted" />}
                  <span className="text-[14px] font-bold text-txt-primary">{sprint.name}</span>
                  <div className="flex items-center gap-1.5 text-[11px] text-txt-muted px-2 py-0.5 rounded bg-bd/30">
                    <Calendar size={12} />
                    <span>{sprint.startDate} đến {sprint.endDate}</span>
                  </div>
                  {sprint.status === 'active' && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-success-500 bg-success-500/10 px-2 py-0.5 rounded">
                      <Play size={10} fill="currentColor" /> Đang chạy
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-semibold text-txt-muted">{sprint.tasks.length} nhiệm vụ</span>
                  <span className="rounded-lg bg-bd/50 px-2 py-1 text-[11px] font-bold text-txt-primary mono">{totalPoints} Điểm SP</span>
                </div>
              </div>

              {/* Sprint Tasks */}
              {isExpanded && (
                <div className="divide-y divide-bd bg-surface/10 p-1">
                  {sprint.tasks.length === 0 ? (
                    <div className="text-center py-6 text-[13px] text-txt-muted">Kéo thả các nhiệm vụ vào đây để lập kế hoạch cho Sprint này</div>
                  ) : (
                    sprint.tasks.map((task) => {
                      const priorityInfo = getPriorityInfo(task.priority);
                      return (
                        <div key={task.id} className="flex items-center justify-between px-3 py-2.5 hover:bg-subtle/40 rounded-xl transition-colors group">
                          <div className="flex items-center gap-3">
                            <span title={getTaskTypeName(task.type)} className="flex items-center">
                              {getTaskIcon(task.type)}
                            </span>
                            <span className="text-[12px] font-semibold text-txt-muted mono select-text">{task.id}</span>
                            <span className="text-[13px] text-txt-primary hover:text-[rgb(var(--primary-500))] cursor-pointer font-medium" title={getTaskTypeName(task.type)}>
                              {task.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border ${priorityInfo.class}`}>
                              {priorityInfo.name}
                            </span>
                            <span className="rounded-lg bg-bd/30 border border-bd px-2 py-0.5 text-[11px] font-bold text-txt-secondary mono">
                              {task.storyPoints} Điểm SP
                            </span>
                            <div className="h-6 w-6 rounded-full bg-bd flex items-center justify-center text-[10px] font-bold text-txt-primary" title={task.assignee ? `Giao cho: ${task.assignee.name}` : 'Chưa phân công'}>
                              {task.assignee ? task.assignee.avatar : '?'}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Backlog Section */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between bg-surface/50 px-4 py-3 border-b border-bd/50">
          <div className="flex items-center gap-3">
            <Layers size={16} className="text-txt-muted" />
            <span className="text-[14px] font-bold text-txt-primary">Backlog Chung</span>
          </div>
          <span className="text-[11px] font-semibold text-txt-muted">{backlog.length} nhiệm vụ</span>
        </div>
        <div className="divide-y divide-bd p-1 bg-surface/10">
          {backlog.map((task) => {
            const priorityInfo = getPriorityInfo(task.priority);
            return (
              <div key={task.id} className="flex items-center justify-between px-3 py-2.5 hover:bg-subtle/40 rounded-xl transition-colors">
                <div className="flex items-center gap-3">
                  <span title={getTaskTypeName(task.type)} className="flex items-center">
                    {getTaskIcon(task.type)}
                  </span>
                  <span className="text-[12px] font-semibold text-txt-muted mono select-text">{task.id}</span>
                  <span className="text-[13px] text-txt-primary hover:text-[rgb(var(--primary-500))] cursor-pointer font-medium" title={getTaskTypeName(task.type)}>
                    {task.title}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border ${priorityInfo.class}`}>
                    {priorityInfo.name}
                  </span>
                  <span className="rounded-lg bg-bd/30 border border-bd px-2 py-0.5 text-[11px] font-bold text-txt-secondary mono">
                    {task.storyPoints} Điểm SP
                  </span>
                  <div className="h-6 w-6 rounded-full bg-bd flex items-center justify-center text-[10px] font-bold text-txt-primary" title="Chưa phân công">
                    ?
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
