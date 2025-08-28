// resources/js/components/budget/BudgetCategoryForm.tsx

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Save } from 'lucide-react';
import { BudgetCategory } from '@/types/budget.types';

interface BudgetCategoryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<BudgetCategory>) => void;
  category?: BudgetCategory | null;
}

const availableColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

export const BudgetCategoryForm: React.FC<BudgetCategoryFormProps> = ({ open, onOpenChange, onSubmit, category }) => {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<BudgetCategory>({
    defaultValues: {
      id: '',
      title: '',
      name: '',
      description: '',
      budgeted: 0,
      color: availableColors[0],
      ...category
    }
  });

  const selectedColor = watch('color');

  // Reset form when category changes
  useEffect(() => {
    if (category) {
      reset({
        id: category.id,
        title: category.title || '',
        name: category.name,
        description: category.description || '',
        budgeted: category.budgeted,
        color: category.color || availableColors[0],
        spent: category.spent
      });
    } else if (open) {
      // Only reset to defaults when opening for a new category
      reset({
        id: '',
        title: '',
        name: '',
        description: '',
        budgeted: 0,
        color: availableColors[0],
        spent: 0
      });
    }
  }, [category, open, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{category ? 'Edit' : 'Add'} Budget Category</DialogTitle>
          <DialogDescription>
            {category ? 'Update the details for this category.' : 'Create a new category to track expenses against.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit((data) => {
          const { spent, ...rest } = data;
          onSubmit(rest);
        })} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input id="title" {...register('title', { required: true })} placeholder="e.g., Venue, Catering" />
              {errors.title && <p className="text-red-500 text-xs mt-1">Title is required</p>}
            </div>
            <div>
              <Label htmlFor="name">Short Name *</Label>
              <Input id="name" {...register('name', { required: true })} placeholder="e.g., VENUE, CAT" />
              {errors.name && <p className="text-red-500 text-xs mt-1">Short name is required</p>}
            </div>
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input id="description" {...register('description')} placeholder="Optional description for this category" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="budgeted">Budgeted Amount *</Label>
              <Input 
                id="budgeted" 
                type="number" 
                step="0.01"
                {...register('budgeted', { required: true, valueAsNumber: true, min: 0 })}
              />
              {errors.budgeted && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.budgeted.type === 'required' 
                    ? 'Budgeted amount is required' 
                    : 'Must be a positive number'}
                </p>
              )}
            </div>
            <div>
              <Label>Color</Label>
              <div className="flex gap-2 flex-wrap mt-2">
                {availableColors.map(color => (
                  <button
                    key={color}
                    type="button"
                    className={`w-6 h-6 rounded-full border-2 transition-all ${selectedColor === color ? 'border-primary scale-110' : 'border-transparent'}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setValue('color', color)}
                  />
                ))}
              </div>
              {!selectedColor && (
                <p className="text-red-500 text-xs mt-1">Please select a color</p>
              )}
              <input type="hidden" {...register('color', { required: true })} />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit"><Save className="w-4 h-4 mr-2" /> Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
