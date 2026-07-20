import { useState } from 'react';
import { 
  DndContext, 
  useSensor, 
  useSensors,
  PointerSensor
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import TaskCard from '../components/TaskCard';
import type { Task } from '../components/TaskCard';
import TaskDetailPanel from '../components/TaskDetailPanel';
import DroppableColumn from '../components/DroppableColumn';
import { Plus, GitBranch } from 'lucide-react';

const MOCK_BOARD_TASKS: Task[] = [
  { id: 'TASK-1', title: 'Thiết kế cơ cấu dữ liệu và RLS của Supabase', type: 'story', priority: 'high', storyPoints: 5, assignee: { name: 'Thành viên A', avatar: 'A' }, gitStats: { commits: 2, prs: 0 } },
  { id: 'TASK-2', title: 'Viết Supabase Edge Function đón nhận Webhook', type: 'task', priority: 'high', storyPoints: 8, assignee: { name: 'Thành viên B', avatar: 'B' }, gitStats: { commits: 1, prs: 1 } },
  { id: 'BUG-1', title: 'Lỗi parse webhook đối với PR merge không đúng task ID', type: 'bug', priority: 'medium', storyPoints: 3, assignee: { name: 'Thành viên A', avatar: 'A' }, gitStats: { commits: 0, prs: 1 } },
  { id: 'TASK-3', title: 'Tích hợp kéo thả dnd-kit trên bảng Kanban', type: 'story', priority: 'medium', storyPoints: 5, assignee: null },
  { id: 'TASK-4', title: 'Xây dựng trang Dashboard và biểu đồ Burndown Chart', type: 'task', priority: 'low', storyPoints: 3, assignee: null }
];

const COLUMNS = [
  { id: 'todo', name: 'Cần làm', color: 'bg-bd/20 border-bd' },
  { id: 'in_progress', name: 'Đang làm', color: 'bg-warning-500/5 border-warning-500/10' },
  { id: 'in_review', name: 'Đợi duyệt', color: 'bg-info-500/5 border-info-500/10' },
  { id: 'done', name: 'Hoàn thành', color: 'bg-success-500/5 border-success-500/10' }
];

const INITIAL_COLUMNS_DATA: Record<string, Task[]> = {
  todo: [MOCK_BOARD_TASKS[0], MOCK_BOARD_TASKS[3]],
  in_progress: [MOCK_BOARD_TASKS[1]],
  in_review: [MOCK_BOARD_TASKS[2]],
  done: [MOCK_BOARD_TASKS[4]]
};

export default function Board() {
  const [columnsData, setColumnsData] = useState<Record<string, Task[]>>(INITIAL_COLUMNS_DATA);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // Cấu hình Sensor để phân biệt kéo (drag) và nhấn chuột (click)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Di chuyển 8px mới bắt đầu kéo thả, dưới 8px coi như là click
      },
    })
  );

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsPanelOpen(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const destinationColId = over.id as string;

    // Tìm cột hiện tại chứa task
    let sourceColId = '';
    let activeTask: Task | null = null;

    for (const [colId, tasks] of Object.entries(columnsData)) {
      const found = tasks.find(t => t.id === taskId);
      if (found) {
        sourceColId = colId;
        activeTask = found;
        break;
      }
    }

    if (!activeTask || sourceColId === destinationColId) return;

    // Di chuyển task sang cột mới
    setColumnsData(prev => {
      const sourceTasks = prev[sourceColId].filter(t => t.id !== taskId);
      const destTasks = [...prev[destinationColId], activeTask!];

      return {
        ...prev,
        [sourceColId]: sourceTasks,
        [destinationColId]: destTasks
      };
    });
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="space-y-6 relative h-[calc(100vh-140px)] overflow-hidden">
        {/* Board Header Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h3 className="text-[16px] font-bold text-txt-primary">Sprint 1 - Kiến trúc cốt lõi</h3>
              <p className="text-[12px] text-txt-muted">Bảng Kanban tự động cập nhật thời gian thực từ GitHub (Kéo thả cục bộ)</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[11px] text-txt-secondary bg-surface border border-bd px-3 py-1.5 rounded-xl font-medium">
              <GitBranch size={14} className="text-txt-muted" />
              <span>Kho mã: <strong className="mono">cic-ibst</strong></span>
            </div>
            <button className="flex items-center gap-2 rounded-xl bg-primary-500 hover:bg-primary-600 px-4 py-2 text-[13px] font-bold text-white transition-all shadow-card active:scale-95">
              <Plus size={16} />
              <span>Tạo Nhiệm vụ</span>
            </button>
          </div>
        </div>

        {/* Board Columns Grid */}
        <div className="grid grid-cols-4 gap-4 h-[calc(100%-80px)] overflow-hidden">
          {COLUMNS.map((col) => {
            const tasks = columnsData[col.id] || [];
            const totalPoints = tasks.reduce((sum, t) => sum + t.storyPoints, 0);

            return (
              <div key={col.id} className={`flex flex-col h-full rounded-2xl border p-3 ${col.color}`}>
                {/* Column Header */}
                <div className="flex items-center justify-between mb-4 px-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-black text-txt-primary">{col.name}</span>
                    <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-bd/50 text-[10px] font-bold text-txt-secondary mono">
                      {tasks.length}
                    </span>
                  </div>
                  <span className="text-[10px] font-extrabold text-txt-muted mono bg-bd/30 px-1.5 py-0.5 rounded">
                    {totalPoints} SP
                  </span>
                </div>

                {/* Droppable Area */}
                <DroppableColumn id={col.id}>
                  {tasks.map((task) => (
                    <TaskCard 
                      key={task.id} 
                      task={task} 
                      onClick={() => handleTaskClick(task)}
                    />
                  ))}
                  {tasks.length === 0 && (
                    <div className="flex h-24 items-center justify-center rounded-xl border border-dashed border-bd/65 text-center p-4">
                      <span className="text-[11px] text-txt-muted">Kéo thả nhiệm vụ vào đây</span>
                    </div>
                  )}
                </DroppableColumn>
              </div>
            );
          })}
        </div>

        {/* Slideout Detail Panel */}
        <TaskDetailPanel 
          task={selectedTask}
          isOpen={isPanelOpen}
          onClose={() => setIsPanelOpen(false)}
        />
      </div>
    </DndContext>
  );
}
