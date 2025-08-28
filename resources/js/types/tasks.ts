export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in_progress' | 'completed';

export interface TasksResponse {
  todo: Task[];
  in_progress: Task[];
  completed: Task[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  due_date: string | null;
  created_at: string;
  updated_at: string;
  wedding_id: number;
}

// Define base task fields that are required in the form
type BaseTaskFields = 'title' | 'priority' | 'status' | 'due_date' | 'wedding_id';

// Make all fields required except ID and timestamps
export type TaskFormData = {
  [K in keyof Pick<Task, BaseTaskFields>]: Task[K];
} & {
  // Make description optional
  description?: string;
  // Allow status to be optional for new tasks
  status?: TaskStatus;
  // Make wedding_id optional in the form (will be set by the parent component)
  wedding_id?: number;
};

export interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
}

export interface TaskFormProps {
  formData: TaskFormData;
  isEdit?: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  onFormChange: (data: TaskFormData) => void;
}

export interface KanbanColumnProps {
  title: string;
  tasks: Task[];
  icon: React.ReactNode;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
}

export interface TaskStatsProps {
  totalTasks: number;
  completedCount: number;
  inProgressCount: number;
  todoCount: number;
  completionPercentage: number;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  [key: string]: any;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}
