// src/components/tasks/KanbanColumn.tsx

import { useDroppable } from '@dnd-kit/core';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Task, TaskStatus } from '@/types/tasks';
import { TaskCard } from './TaskCard';
import { ReactNode } from 'react';

interface KanbanColumnProps {
  title: string;
  tasks: Task[];
  icon: ReactNode;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
}

export function KanbanColumn({
  title,
  tasks,
  icon,
  onEdit,
  onDelete,
  onStatusChange,
}: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id: title.toLowerCase().replace(' ', '-'), // e.g., 'to-do', 'in-progress'
  });

  return (
    <div ref={setNodeRef} className="h-full flex flex-col bg-card border rounded-lg overflow-hidden shadow-sm">
      {/* Header */}
      <div className="p-3 border-b flex items-center justify-between bg-muted/20">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-sm font-medium">{title}</h3>
        </div>
        <span className="text-xs bg-muted rounded-full px-2 py-0.5 font-semibold">
          {tasks.length}
        </span>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-2">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
                onStatusChange={onStatusChange}
              />
            ))
          ) : (
            <div className="text-center p-4 m-2 text-muted-foreground border-2 border-dashed rounded-lg">
              <div className="mx-auto w-8 h-8 mb-2 opacity-50">
                {icon}
              </div>
              <p className="text-xs">No tasks</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}