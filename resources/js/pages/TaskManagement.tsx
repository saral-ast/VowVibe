import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Plus, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Layout from '@/components/Layout';
import { Task, TaskStatus, TaskFormData, TaskPriority } from '@/types/tasks';
import { taskService } from '@/services/taskService';
import { KanbanColumn } from '@/components/tasks/KanbanColumn';
import { TaskStats } from '@/components/tasks/TaskStats';
import { TaskForm } from '@/components/tasks/TaskForm';

interface TaskManagementProps {
  tasks: {
    todo: Task[];
    in_progress: Task[];
    completed: Task[];
  };
  stats: {
    total: number;
    completed: number;
    inProgress: number;
    todo: number;
    completionPercentage: number;
  };
}

type TaskState = {
  todo: Task[];
  in_progress: Task[];
  completed: Task[];
};

type StatsState = {
  total: number;
  completed: number;
  inProgress: number;
  todo: number;
  completionPercentage: number;
};

const taskCategories = [
  'Venue & Catering',
  'Photography & Video',
  'Flowers & Decorations',
  'Music & Entertainment',
  'Attire & Beauty',
  'Invitations & Stationery',
  'Transportation',
  'Legal & Documentation',
  'Other'
] as const;

const TaskManagement: React.FC<TaskManagementProps> = ({ tasks: initialTasks, stats: initialStats }) => {
  // State management
  const [tasks, setTasks] = useState<TaskState>({
    todo: initialTasks.todo || [],
    in_progress: initialTasks.in_progress || [],
    completed: initialTasks.completed || [],
  });
  const [isAddTaskOpen, setIsAddTaskOpen] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditTaskOpen, setIsEditTaskOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [stats, setStats] = useState<StatsState>(initialStats);

  // Refresh tasks after updates
  const refreshTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      const tasksData = await taskService.getTasks();
      console.log('Raw tasks data:', tasksData); // Debug log
      
      if (tasksData) {
        // Transform the response to match our state structure
        const updatedTasks = {
          todo: tasksData.todo || [],
          in_progress: tasksData.in_progress || [],
          completed: tasksData.completed || []
        };
        
        console.log('Updated tasks:', { // Debug log
          todoCount: updatedTasks.todo.length,
          inProgressCount: updatedTasks.in_progress.length,
          completedCount: updatedTasks.completed.length
        });
        
        // Update tasks state
        setTasks(updatedTasks);
        
        // Calculate and update stats
        const totalTasks = updatedTasks.todo.length + updatedTasks.in_progress.length + updatedTasks.completed.length;
        const completedCount = updatedTasks.completed.length;
        const inProgressCount = updatedTasks.in_progress.length;
        const todoCount = updatedTasks.todo.length;
        
        const newStats = {
          total: totalTasks,
          completed: completedCount,
          inProgress: inProgressCount,
          todo: todoCount,
          completionPercentage: totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0
        };
        
          console.log('New stats:', newStats); // Debug log
        setStats(newStats);
      }
    } catch (error) {
      console.error('Error refreshing tasks:', error);
      toast.error('Failed to refresh tasks');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Memoized filtered task lists
  const todoTasks = useMemo(
    () => tasks.todo, 
    [tasks.todo]
  );
  
  const inProgressTasks = useMemo(
    () => tasks.in_progress, 
    [tasks.in_progress]
  );
  
  const completedTasks = useMemo(
    () => tasks.completed, 
    [tasks.completed]
  );

  // Handle adding a new task
  const handleAddTask = async (taskData: TaskFormData): Promise<void> => {
    try {
      if (!taskData.title || !taskData.priority) {
        toast.error('Title and priority are required');
        return;
      }

      const taskToCreate: Omit<Task, 'id' | 'created_at' | 'updated_at'> = {
        title: taskData.title,
        description: taskData.description || '',
        priority: taskData.priority as TaskPriority,
        status: 'todo',
        due_date: taskData.due_date || null,
        wedding_id: 1, // TODO: Get from auth context
      };

      await taskService.createTask(taskToCreate);
      await refreshTasks();
      setIsAddTaskOpen(false);
      toast.success('Task added successfully!');
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Failed to add task');
    }
  };

  // Handle updating an existing task
  const handleUpdateTask = async (taskId: string, taskData: Partial<Task>): Promise<void> => {
    try {
      await taskService.updateTask(taskId, taskData);
      await refreshTasks();
      toast.success('Task updated successfully!');
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    }
  };

  // Handle task status change
  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    try {
      await handleUpdateTask(taskId, { status: newStatus });
    } catch (error) {
      console.error('Error changing task status:', error);
      toast.error('Failed to update task status');
    }
  };

  // Handle task deletion
  const handleDeleteTask = async (taskId: string) => {
    try {
      await taskService.deleteTask(taskId);
      await refreshTasks();
      toast.success('Task deleted successfully!');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  };

  // Open edit task dialog
  const openEditTask = (task: Task) => {
    setEditingTask(task);
    setIsEditTaskOpen(true);
  };

  // Handle form submission
  const handleSubmit = async (taskData: TaskFormData) => {
    if (editingTask) {
      await handleUpdateTask(editingTask.id, taskData);
      setIsEditTaskOpen(false);
      setEditingTask(null);
    } else {
      await handleAddTask(taskData);
    }
  };

 

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Task Management</h1>
          <Button onClick={() => setIsAddTaskOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>

        {/* Task Stats */}
        <div className="mb-6">
          <TaskStats 
            totalTasks={stats.total}
            completedCount={stats.completed}
            inProgressCount={stats.inProgress}
            in_progress={stats.inProgress} // Pass as both camelCase and snake_case for compatibility
            todoCount={stats.todo}
            completionPercentage={stats.completionPercentage}
          />
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 w-full h-[calc(100vh-280px)]">
          <div className="h-full flex flex-col">
            <KanbanColumn
              title="To Do"
              tasks={todoTasks}
              icon={<AlertCircle className="h-4 w-4 text-yellow-500" />}
              onEdit={openEditTask}
              onDelete={handleDeleteTask}
              onStatusChange={handleStatusChange}
            />
          </div>
          <div className="h-full flex flex-col">
            <KanbanColumn
              title="In Progress"
              tasks={inProgressTasks}
              icon={<Clock className="h-4 w-4 text-blue-500" />}
              onEdit={openEditTask}
              onDelete={handleDeleteTask}
              onStatusChange={handleStatusChange}
            />
          </div>
          <div className="h-full flex flex-col">
            <KanbanColumn
              title="Completed"
              tasks={completedTasks}
              icon={<CheckCircle className="h-4 w-4 text-green-500" />}
              onEdit={openEditTask}
              onDelete={handleDeleteTask}
              onStatusChange={handleStatusChange}
            />
          </div>
        </div>
      </div>

      {/* Add Task Dialog */}
      <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
            <DialogDescription>Create a new task and assign it to a team member.</DialogDescription>
          </DialogHeader>
          <TaskForm 
            formData={{
              title: '',
              description: '',
              status: 'todo',
              priority: 'medium',
              due_date: null,
              wedding_id: 1
            }}
            onSubmit={handleSubmit}
            onCancel={() => setIsAddTaskOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Task Dialog */}
      <Dialog open={isEditTaskOpen} onOpenChange={(open) => !open && setIsEditTaskOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>Update the task details below.</DialogDescription>
          </DialogHeader>
          {editingTask && (
            <TaskForm
              formData={{
                title: editingTask.title,
                description: editingTask.description || '',
                status: editingTask.status,
                priority: editingTask.priority,
                due_date: editingTask.due_date,
                wedding_id: editingTask.wedding_id
              }}
              isEdit={true}
              onSubmit={handleSubmit}
              onCancel={() => {
                setIsEditTaskOpen(false);
                setEditingTask(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default TaskManagement;
