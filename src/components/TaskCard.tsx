import { useDraggable } from '@dnd-kit/core';
import { 
  Layers, 
  Bug, 
  HelpCircle, 
  GitBranch, 
  GitPullRequest 
} from 'lucide-react';

export interface Task {
  id: string;
  title: string;
  type: 'story' | 'task' | 'bug';
  priority: 'high' | 'medium' | 'low';
  storyPoints: number;
  assignee: { name: string; avatar: string } | null;
  gitStats?: { commits: number; prs: number };
}

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

export default function TaskCard({ task, onClick }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  });

  const style: React.CSSProperties = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.4 : undefined,
    cursor: 'grab',
    zIndex: isDragging ? 999 : undefined,
  };

  const getTaskIcon = (type: Task['type']) => {
    switch (type) {
      case 'story': return <Layers size={14} className="text-info-500" />;
      case 'bug': return <Bug size={14} className="text-danger-500" />;
      default: return <HelpCircle size={14} className="text-warning-500" />;
    }
  };

  const getPriorityBorder = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'border-l-4 border-l-danger-500';
      case 'medium': return 'border-l-4 border-l-warning-500';
      default: return 'border-l-4 border-l-bd';
    }
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className={`card ${getPriorityBorder(task.priority)} p-4 hover:border-bd-subtle hover:-translate-y-0.5 active:translate-y-0 active:border-bd transition-all duration-200 select-none`}
    >
      {/* Task Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          {getTaskIcon(task.type)}
          <span className="text-[11px] font-semibold text-txt-muted mono">{task.id}</span>
        </div>
        <span className="rounded-lg bg-bd/40 border border-bd px-1.5 py-0.5 text-[10px] font-bold text-txt-secondary mono">
          {task.storyPoints} SP
        </span>
      </div>

      {/* Task Title */}
      <h4 className="text-[13px] font-semibold leading-snug text-txt-primary mb-3 line-clamp-2">
        {task.title}
      </h4>

      {/* Task Footer */}
      <div className="flex items-center justify-between">
        {/* Git stats */}
        <div className="flex items-center gap-2 text-[10px] text-txt-muted">
          {task.gitStats && task.gitStats.commits > 0 && (
            <div className="flex items-center gap-0.5 rounded bg-subtle px-1 py-0.5 border border-bd">
              <GitBranch size={10} />
              <span className="mono">{task.gitStats.commits}</span>
            </div>
          )}
          {task.gitStats && task.gitStats.prs > 0 && (
            <div className="flex items-center gap-0.5 rounded bg-subtle px-1 py-0.5 border border-bd">
              <GitPullRequest size={10} className="text-success-500" />
              <span className="mono">{task.gitStats.prs}</span>
            </div>
          )}
        </div>

        {/* Assignee Avatar */}
        <div className="h-6 w-6 rounded-full bg-bd/80 border border-bd flex items-center justify-center text-[10px] font-bold text-txt-primary">
          {task.assignee ? task.assignee.avatar : '?'}
        </div>
      </div>
    </div>
  );
}
