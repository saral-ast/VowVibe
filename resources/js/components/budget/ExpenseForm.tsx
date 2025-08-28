// resources/js/components/budget/ExpenseForm.tsx

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Save } from 'lucide-react';
import { BudgetCategory, Expense } from '@/types/budget.types';

interface ExpenseFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<Expense>) => void;
  budgetCategories: BudgetCategory[];
  expense?: Expense | null;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ open, onOpenChange, onSubmit, budgetCategories, expense }) => {
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<Expense>({
    defaultValues: expense || {
      id: '',
      title: '',
      description: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      budget_category_id: '',
      vendor: ''
    }
  });

  useEffect(() => {
    reset(expense || {});
  }, [expense, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{expense ? 'Edit' : 'Add'} Expense</DialogTitle>
          <DialogDescription>
            {expense ? 'Update the details for this expense.' : 'Record a new wedding expense.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input 
                id="title" 
                {...register('title', { 
                  required: 'Title is required',
                  maxLength: { value: 255, message: 'Title is too long' }
                })} 
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.title.message || 'Title is required'}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="amount">Amount *</Label>
              <Input 
                id="amount" 
                type="number" 
                step="0.01"
                min="0"
                {...register('amount', { 
                  required: 'Amount is required',
                  valueAsNumber: true,
                  min: { value: 0.01, message: 'Amount must be greater than 0' }
                })} 
              />
              {errors.amount && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.amount.message || 'A valid amount is required'}
                </p>
              )}
            </div>
          </div>
          <div>
            <Label htmlFor="budget_category_id">Budget Category *</Label>
            <Controller
              name="budget_category_id"
              control={control}
              rules={{ required: 'Category is required' }}
              render={({ field }) => (
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value}
                  disabled={budgetCategories.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={
                      budgetCategories.length === 0 
                        ? 'No categories available' 
                        : 'Select a category'
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {budgetCategories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.budget_category_id && (
              <p className="text-red-500 text-xs mt-1">
                {errors.budget_category_id.message || 'Category is required'}
              </p>
            )}
            {budgetCategories.length === 0 && (
              <p className="text-yellow-600 text-xs mt-1">
                Please create a budget category first
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              {...register('description', {
                maxLength: { value: 1000, message: 'Description is too long' }
              })} 
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">
                {errors.description.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date *</Label>
              <Controller
                name="date"
                control={control}
                rules={{ required: 'Date is required' }}
                render={({ field }) => (
                  <Input 
                    id="date" 
                    type="date" 
                    value={field.value?.toString().split('T')[0] || ''}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                )}
              />
              {errors.date && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.date.message || 'Date is required'}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="status">Status *</Label>
              <Controller
                name="status"
                control={control}
                rules={{ required: 'Status is required' }}
                render={({ field }) => (
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                    defaultValue="pending"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.status && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.status.message || 'Status is required'}
                </p>
              )}
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
