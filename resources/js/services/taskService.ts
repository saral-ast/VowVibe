import { router } from '@inertiajs/react';
import { Task, TaskStatus, TasksResponse, ApiResponse, ApiError } from '@/types/tasks';

// Helper type for Inertia page props
interface InertiaPageProps {
  props: {
    tasks?: TasksResponse;
    task?: Task;
    flash?: {
      success?: string;
      error?: string;
    };
    [key: string]: any;
  };
}


export const taskService = {
  // Get task statistics
  async getTaskStats(): Promise<{
    total: number;
    completed: number;
    inProgress: number;
    todo: number;
    completionPercentage: number;
  }> {
    try {
      const response = await new Promise<InertiaPageProps>((resolve) => {
        router.get('/tasks/stats', {}, {
          only: ['stats'],
          preserveState: true,
          onSuccess: (page) => resolve(page as unknown as InertiaPageProps),
          onError: () => resolve({ props: {} })
        });
      });

      const defaultStats = {
        total: 0,
        completed: 0,
        inProgress: 0,
        todo: 0,
        completionPercentage: 0
      };

      return response?.props?.stats || defaultStats;
    } catch (error) {
      console.error('Error fetching task stats:', error);
      return {
        total: 0,
        completed: 0,
        inProgress: 0,
        todo: 0,
        completionPercentage: 0
      };
    }
  },

  // Get all tasks grouped by status
  async getTasks(): Promise<TasksResponse> {
    try {
      const response = await new Promise<InertiaPageProps>((resolve) => {
        router.get('/tasks', {}, {
          only: ['tasks'],
          preserveState: true,
          onSuccess: (page) => resolve(page as unknown as InertiaPageProps),
          onError: () => resolve({ props: {} })
        });
      });
      
      // Handle both formats (with and without underscores)
      const tasks = response.props.tasks || { todo: [], in_progress: [], completed: [] };
      return {
        todo: tasks.todo || [],
        in_progress: tasks.in_progress || [],
        completed: tasks.completed || []
      };
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return { todo: [], in_progress: [], completed: [] };
    }
  },

  // Create a new task
  async createTask(taskData: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task> {
    return new Promise((resolve, reject) => {
      router.post('/tasks', taskData, {
        preserveScroll: true,
        preserveState: false,
        onSuccess: (page) => {
          const props = (page as unknown as InertiaPageProps).props || {};
          if (props.task) {
            resolve({
              ...props.task,
              // Ensure consistent status format
              status: (props.task.status as string).replace('-', '_') as TaskStatus
            });
          } else {
            const errorMessage = (props as any)?.flash?.error || 'Failed to create task';
            reject(new Error(errorMessage));
          }
        },
        onError: (errors) => {
          console.error('Error creating task:', errors);
          reject(new Error('Failed to create task'));
        }
      });
    });
  },

  // Update a task
  async updateTask(id: string, taskData: Partial<Task>): Promise<Task> {
    return new Promise((resolve, reject) => {
      router.put(`/tasks/${id}`, taskData, {
        preserveScroll: true,
        preserveState: false,
        onSuccess: (page) => {
          const props = (page as unknown as InertiaPageProps).props || {};
          if (props.task) {
            resolve({
              ...props.task,
              // Ensure consistent status format
              status: (props.task.status as string).replace('-', '_') as TaskStatus
            });
          } else {
            const errorMessage = (props as any)?.flash?.error || 'Failed to update task';
            reject(new Error(errorMessage));
          }
        },
        onError: (errors) => {
          console.error('Error updating task:', errors);
          reject(new Error('Failed to update task'));
        }
      });
    });
  },

  // Update task status
  async updateTaskStatus(taskId: string, status: TaskStatus): Promise<Task> {
    return new Promise((resolve, reject) => {
      router.put(
        `/tasks/${taskId}/status`, 
        { status },
        {
          preserveScroll: true,
          preserveState: false,
          onSuccess: (page) => {
            const props = (page as unknown as InertiaPageProps).props || {};
            if (props.task) {
              resolve({
                ...props.task,
                // Ensure consistent status format
                status: (props.task.status as string).replace('-', '_') as TaskStatus
              });
            } else {
              const errorMessage = (props as any)?.flash?.error || 'Failed to update task status';
              reject(new Error(errorMessage));
            }
          },
          onError: (errors) => {
            console.error('Error updating task status:', errors);
            reject(new Error('Failed to update task status'));
          }
        }
      );
    });
  },

  // Delete a task
  async deleteTask(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      router.delete(`/tasks/${id}`, {
        preserveScroll: true,
        preserveState: false,
        onSuccess: () => {
          resolve();
        },
        onError: (errors) => {
          console.error('Error deleting task:', errors);
          reject(new Error('Failed to delete task'));
        }
      });
    });
  }

}
