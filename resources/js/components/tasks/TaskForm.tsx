import { Save, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Task, TaskPriority, TaskStatus, TaskFormData } from '@/types/tasks';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import React from 'react';

interface TaskFormProps {
  formData: TaskFormData;
  isEdit?: boolean;
  onSubmit: (task: TaskFormData) => Promise<void>;
  onCancel: () => void;
  onFormChange?: (data: TaskFormData) => void;
  loading?: boolean;
  task?: Task; // Kept for backward compatibility
}

export function TaskForm({ 
  formData: initialFormData, 
  onSubmit, 
  onCancel, 
  isEdit, 
  onFormChange, 
  loading = false,
  task // Kept for backward compatibility
}: TaskFormProps) {
  // Initialize form data state
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    priority: 'medium',
    status: 'todo',
    due_date: null,
    wedding_id: 1, // TODO: Get from auth context
  });
  
  // Use the loading prop if provided, otherwise use local loading state
  const [isFormLoading, setIsFormLoading] = useState(loading || false);
  
  // Update local loading state when the loading prop changes
  useEffect(() => {
    if (loading !== undefined) {
      setIsFormLoading(loading);
    }
  }, [loading]);

  // Update form data when task or initialFormData changes
  useEffect(() => {
    const source = task || initialFormData;
    
    if (source) {
      setFormData({
        title: source.title || '',
        description: source.description || '',
        priority: (source.priority || 'medium') as TaskPriority,
        status: (source.status || 'todo') as TaskStatus,
        due_date: source.due_date || null,
        wedding_id: source.wedding_id || 1,
      });
    }
  }, [task, initialFormData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ensure required fields are present
    if (!formData.title || !formData.priority) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Format the due date if it exists
    let formattedDueDate = null;
    if (formData.due_date) {
      try {
        formattedDueDate = format(new Date(formData.due_date), 'yyyy-MM-dd');
      } catch (error) {
        console.error('Error formatting date:', error);
        toast.error('Invalid date format');
        return;
      }
    }

    // Prepare the data to submit
    const submitData: TaskFormData = {
      ...formData,
      due_date: formattedDueDate,
    };

    try {
      setIsFormLoading(true);
      await onSubmit(submitData);
    } catch (error) {
      console.error('Error submitting task:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save task';
      toast.error(errorMessage);
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleChange = <K extends keyof TaskFormData>(
    field: K, 
    value: TaskFormData[K] | Date | null
  ) => {
    // Handle date objects and format them as strings
    let processedValue: any = value;
    if (value instanceof Date) {
      processedValue = format(value, 'yyyy-MM-dd');
    } else if (value === null && field === 'due_date') {
      processedValue = null;
    }
    
    const updatedFormData = {
      ...formData,
      [field]: processedValue
    };
    
    setFormData(updatedFormData);
    
    // Only call onFormChange if it's provided
    if (onFormChange) {
      onFormChange(updatedFormData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Task title"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="priority">Priority <span className="text-red-500">*</span></Label>
          <Select
            value={formData.priority}
            onValueChange={(value) => handleChange('priority', value as TaskPriority)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Task description"
          rows={3}
        />
      </div>

 
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="due_date">Due Date</Label>
          <Input
            type="date"
            id="due_date"
            value={formData.due_date || ''}
            onChange={(e) => handleChange('due_date', e.target.value || null)}
            className="w-full"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isFormLoading}
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isFormLoading}
          className="gap-2"
        >
          {isFormLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isFormLoading ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  );
}
