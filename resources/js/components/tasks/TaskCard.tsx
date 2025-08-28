import { AlertCircle, Calendar, CheckCircle, Clock, Edit2, Flag, Trash2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Task, TaskPriority, TaskStatus } from '@/types/tasks';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
}

const getPriorityColor = (priority: TaskPriority) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800';
    case 'medium':
      return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
    case 'low':
      return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800';
    default:
      return 'bg-muted text-muted-foreground border-border';
  }
};

const getPriorityIcon = (priority: TaskPriority) => {
  switch (priority) {
    case 'high':
      return <AlertCircle className="w-3 h-3" />;
    case 'medium':
      return <Clock className="w-3 h-3" />;
    case 'low':
      return <Flag className="w-3 h-3" />;
    default:
      return null;
  }
};

const formatDate = (dateString: string | null) => {
  if (!dateString) return 'No due date';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric',
    month: 'short', 
    day: 'numeric' 
  });
};

const isOverdue = (dateString: string | null, status: TaskStatus) => {
  if (status === 'completed' || !dateString) return false;
  const dueDate = new Date(dateString);
  const today = new Date();
  // Reset time part for accurate date comparison
  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);
  return dueDate < today;
};

export function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  const overdue = isOverdue(task.due_date, task.status);
  const priorityColor = getPriorityColor(task.priority);
  const priorityIcon = getPriorityIcon(task.priority);

  return (
    <div 
      className="bg-card border rounded-lg overflow-hidden shadow-sm hover:shadow transition-all duration-200"
      style={{ 
        borderLeft: `3px solid ${
          task.priority === 'high' 
            ? '#EF4444' 
            : task.priority === 'medium' 
              ? '#F59E0B' 
              : '#10B981'
        }`
      }}
    >
      <div className="p-2">
        <div className="flex items-start justify-between gap-1">
          <h4 className="font-medium text-sm text-foreground line-clamp-2 pr-1 flex-1">
            {task.title}
          </h4>
          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task);
              }}
              className="h-5 w-5 p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <Edit2 className="w-3 h-3" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Task</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{task.title}"? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(task.id)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        
        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
            {task.description}
          </p>
        )}
        
        <div className="flex items-center justify-between mt-2 text-xs">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="w-3 h-3 flex-shrink-0" />
            <span className={cn(
              'whitespace-nowrap',
              overdue ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground'
            )}>
              {formatDate(task.due_date)}
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            <Badge 
              variant="outline" 
              className={cn(
                'h-5 text-[10px] font-normal gap-1 px-1',
                priorityColor
              )}
            >
              {priorityIcon}
              <span className="capitalize">{task.priority.charAt(0)}</span>
            </Badge>
            
            <div className="flex items-center border rounded-md overflow-hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onStatusChange(task.id, 'todo');
                }}
                className={cn(
                  'h-5 w-5 p-0 text-muted-foreground hover:text-foreground rounded-none',
                  task.status === 'todo' && 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300'
                )}
              >
                <span className="text-xs">T</span>
              </Button>
              <div className="h-4 w-px bg-border" />
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onStatusChange(task.id, 'in_progress');
                }}
                className={cn(
                  'h-5 w-5 p-0 text-muted-foreground hover:text-foreground rounded-none',
                  task.status === 'in_progress' && 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-300'
                )}
              >
                <span className="text-xs">I</span>
              </Button>
              <div className="h-4 w-px bg-border" />
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onStatusChange(task.id, 'completed');
                }}
                className={cn(
                  'h-5 w-5 p-0 text-muted-foreground hover:text-foreground rounded-none',
                  task.status === 'completed' && 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-300'
                )}
              >
                <span className="text-xs">D</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
