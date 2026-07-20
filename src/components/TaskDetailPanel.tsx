import { 
  X, 
  Layers, 
  Bug, 
  HelpCircle, 
  GitCommit, 
  GitPullRequest,
  ExternalLink
} from 'lucide-react';
import type { Task } from './TaskCard';

interface GitActivity {
  id: string;
  type: 'commit' | 'pull_request';
  title: string;
  url: string;
  author: string;
  timestamp: string;
  branch?: string;
  prStatus?: 'open' | 'merged' | 'closed';
}

interface TaskDetailPanelProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  gitActivities?: GitActivity[];
}

const MOCK_GIT_ACTIVITIES: Record<string, GitActivity[]> = {
  'TASK-1': [
    { id: 'git-1', type: 'commit', title: 'feat: #TASK-1 setup schema migration and add triggers', url: '#', author: 'Thành viên A', timestamp: '2 giờ trước', branch: 'feature/task-1' },
    { id: 'git-2', type: 'commit', title: 'refactor: #TASK-1 update RLS policy for profile queries', url: '#', author: 'Thành viên A', timestamp: '3 giờ trước', branch: 'feature/task-1' }
  ],
  'TASK-2': [
    { id: 'git-3', type: 'pull_request', title: 'PR #12: feat: #TASK-2 github webhook handler receiver', url: '#', author: 'Thành viên B', timestamp: '1 ngày trước', prStatus: 'merged' },
    { id: 'git-4', type: 'commit', title: 'fix: #TASK-2 check signature hash verify correctly', url: '#', author: 'Thành viên B', timestamp: '1 ngày trước', branch: 'main' }
  ],
  'BUG-1': [
    { id: 'git-5', type: 'pull_request', title: 'PR #15: fix: #BUG-1 resolve missing task id when PR merge action occurs', url: '#', author: 'Thành viên A', timestamp: '30 phút trước', prStatus: 'open' }
  ]
};

export default function TaskDetailPanel({ task, isOpen, onClose }: TaskDetailPanelProps) {
  if (!task) return null;

  const activities = MOCK_GIT_ACTIVITIES[task.id] || [];

  const getTaskIcon = (type: Task['type']) => {
    switch (type) {
      case 'story': return <Layers size={16} className="text-info-500" />;
      case 'bug': return <Bug size={16} className="text-danger-500" />;
      default: return <HelpCircle size={16} className="text-warning-500" />;
    }
  };

  const getTaskTypeName = (type: Task['type']) => {
    switch (type) {
      case 'story': return 'Tính năng';
      case 'bug': return 'Lỗi (Bug)';
      default: return 'Nhiệm vụ';
    }
  };

  const getPriorityInfo = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return { name: 'Cao', class: 'bg-danger-500/10 text-danger-500 border-danger-500/20' };
      case 'medium': return { name: 'Trung bình', class: 'bg-warning-500/10 text-warning-500 border-warning-500/20' };
      default: return { name: 'Thấp', class: 'bg-bd/40 text-txt-secondary border-bd' };
    }
  };

  return (
    <div className={`fixed inset-y-0 right-0 z-50 w-[450px] border-l border-bd bg-surface shadow-pop transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      {/* Header */}
      <div className="flex h-14 items-center justify-between border-b border-bd px-4">
        <div className="flex items-center gap-2">
          {getTaskIcon(task.type)}
          <span className="text-[13px] font-bold text-txt-muted mono">{task.id}</span>
        </div>
        <button 
          onClick={onClose}
          className="rounded-lg p-1.5 text-txt-muted hover:bg-subtle hover:text-txt-primary transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Content */}
      <div className="h-[calc(100vh-56px)] overflow-y-auto p-5 space-y-6">
        {/* Title */}
        <div>
          <h3 className="text-[16px] font-bold text-txt-primary leading-snug">{task.title}</h3>
        </div>

        {/* Task Details Metadata Table */}
        <div className="rounded-xl border border-bd bg-app/50 p-4 space-y-3">
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-txt-muted">Loại công việc</span>
            <span className="rounded-lg bg-subtle border border-bd px-2.5 py-1 font-bold text-txt-primary uppercase text-[11px]">
              {getTaskTypeName(task.type)}
            </span>
          </div>

          <div className="flex items-center justify-between text-[13px]">
            <span className="text-txt-muted">Độ ưu tiên</span>
            <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border ${getPriorityInfo(task.priority).class}`}>
              {getPriorityInfo(task.priority).name}
            </span>
          </div>

          <div className="flex items-center justify-between text-[13px]">
            <span className="text-txt-muted">Độ khó (Story Points)</span>
            <span className="rounded-lg bg-bd/40 px-2 py-0.5 text-[11px] font-bold text-txt-primary mono">
              {task.storyPoints} Điểm SP
            </span>
          </div>

          <div className="flex items-center justify-between text-[13px]">
            <span className="text-txt-muted">Người thực hiện</span>
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-bd flex items-center justify-center text-[10px] font-bold text-txt-primary">
                {task.assignee ? task.assignee.avatar : '?'}
              </div>
              <span className="text-txt-secondary font-medium">{task.assignee ? task.assignee.name : 'Chưa phân công'}</span>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="space-y-2">
          <h4 className="eyebrow block">Mô tả chi tiết</h4>
          <div className="text-[13px] text-txt-secondary leading-relaxed bg-subtle/20 rounded-xl p-3 border border-bd">
            Đây là phần mô tả của công việc. Trong thực tế, lập trình viên và PO sẽ mô tả các yêu cầu kỹ thuật, tiêu chí chấp nhận (Acceptance Criteria) và các ghi chú thực hiện tại đây.
          </div>
        </div>

        {/* Git Activities Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="eyebrow">Hoạt động GitHub liên quan</h4>
            <span className="rounded bg-success-500/10 border border-success-500/20 px-1.5 py-0.5 text-[10px] font-bold text-success-500 mono">
              Thời gian thực
            </span>
          </div>

          {activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-bd bg-app/20 p-6 text-center">
              <div className="text-[12px] text-txt-muted">Chưa có commit hoặc PR nào được liên kết.</div>
              <div className="text-[10px] text-txt-muted mt-1">Nhập mã <code className="bg-bd px-1 py-0.5 rounded text-txt-primary">#{task.id}</code> vào commit message để liên kết tự động.</div>
            </div>
          ) : (
            <div className="space-y-3">
              {activities.map((act) => (
                <div key={act.id} className="rounded-xl border border-bd bg-app/30 p-3 hover:bg-app/50 transition-colors flex items-start justify-between group">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {act.type === 'commit' ? (
                        <GitCommit size={14} className="text-txt-muted" />
                      ) : (
                        <GitPullRequest size={14} className={act.prStatus === 'merged' ? 'text-success-500' : 'text-info-500'} />
                      )}
                      <span className="text-[12px] font-bold text-txt-primary line-clamp-1">{act.title}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-[10px] text-txt-muted">
                      <span className="font-semibold text-txt-secondary">{act.author}</span>
                      <span>•</span>
                      <span>{act.timestamp}</span>
                      {act.branch && (
                        <>
                          <span>•</span>
                          <span className="rounded bg-bd/50 px-1 text-txt-secondary mono">{act.branch}</span>
                        </>
                      )}
                      {act.prStatus && (
                        <>
                          <span>•</span>
                          <span className={`px-1 rounded font-bold uppercase text-[9px] ${
                            act.prStatus === 'merged' ? 'bg-success-500/10 text-success-500 border border-success-500/20' : 'bg-info-500/10 text-info-500 border border-info-500/20'
                          }`}>
                            {act.prStatus === 'merged' ? 'Đã trộn' : 'Đang mở'}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <a href={act.url} className="text-txt-muted hover:text-txt-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink size={14} />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
