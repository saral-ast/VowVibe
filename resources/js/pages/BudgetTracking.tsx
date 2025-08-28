// resources/js/pages/BudgetTracking.tsx

import React, { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import Layout from '@/components/Layout';
import BudgetDashboard from '@/components/budget/BudgetDashboard';
import BudgetCategoryList from '@/components/budget/BudgetCategoryList';
import ExpenseList from '@/components/budget/ExpenseList';
import { BudgetCategoryForm } from '@/components/budget/BudgetCategoryForm';
import { ExpenseForm } from '@/components/budget/ExpenseForm';
import { BudgetCategory, Expense } from '@/types/budget.types';
import { toast } from 'sonner';

// Monthly spending data comes from the backend

const BudgetTracking = () => {
  // Data from your Laravel Controller
  const { totalBudget, budgetCategories, expenses, monthlySpending } = usePage<{ 
    totalBudget: number,
    budgetCategories: BudgetCategory[], 
    expenses: Expense[],
    monthlySpending: { month: string; amount: number }[]
  }>().props;

  // State for controlling modals
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isEditExpenseOpen, setIsEditExpenseOpen] = useState(false);
  
  const [editingCategory, setEditingCategory] = useState<BudgetCategory | null>(null);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  // --- Handlers for opening modals ---
  const handleAddCategory = () => {
    setEditingCategory(null);
    setIsAddCategoryOpen(true);
    setIsEditCategoryOpen(false);
  };

  const handleEditCategory = (category: BudgetCategory) => {
    setEditingCategory(category);
    setIsEditCategoryOpen(true);
    setIsAddCategoryOpen(false);
  };
  
  const handleAddExpense = () => {
    setEditingExpense(null);
    setIsAddExpenseOpen(true);
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setIsEditExpenseOpen(true);
  };
  
  // --- Centralized close handlers for modals ---
  const closeCategoryForm = () => {
    setIsAddCategoryOpen(false);
    setIsEditCategoryOpen(false);
    setEditingCategory(null); // Reset editing state on close
  };

  const closeExpenseForm = () => {
    setIsAddExpenseOpen(false);
    setIsEditExpenseOpen(false);
    setEditingExpense(null); // Reset editing state on close
  };

  // --- Form submission handlers (using Inertia) ---
  const handleCategorySubmit = (data: Partial<BudgetCategory>) => {
    // Format the data for the server
    const formattedData = {
      ...data,
      budgeted: Number(data.budgeted) || 0,
      // Ensure color is always set
      color: data.color || '#3b82f6',
    };

    const options = {
      onSuccess: () => {
        closeCategoryForm();
        toast.success(`Category ${editingCategory ? 'updated' : 'added'} successfully!`);
      },
      onError: (errors: any) => {
        if (typeof errors === 'object') {
          Object.values(errors).forEach(error => 
            Array.isArray(error) 
              ? error.forEach(err => toast.error(err as string))
              : toast.error(error as string)
          );
        } else {
          toast.error('An error occurred while saving the category');
        }
      },
      preserveScroll: true,
    };

    if (editingCategory?.id) {
      router.put(`/budget/categories/${editingCategory.id}`, formattedData, options);
    } else {
      router.post('/budget/categories', formattedData, options);
    }
  };

  const handleExpenseSubmit = (data: Partial<Expense>) => {
    // Format the data for the server
    const formattedData = {
      ...data,
      amount: Number(data.amount) || 0,
      date: data.date ? new Date(data.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      budget_category_id: data.budget_category_id,
      // Ensure status is always set
      status: data.status || 'pending',
    };

    const options = {
      onSuccess: () => {
        closeExpenseForm();
        toast.success(`Expense ${editingExpense ? 'updated' : 'added'} successfully!`);
      },
      onError: (errors: any) => {
        if (typeof errors === 'object') {
          Object.values(errors).forEach(error => 
            Array.isArray(error) 
              ? error.forEach(err => toast.error(err as string))
              : toast.error(error as string)
          );
        } else {
          toast.error('An error occurred while saving the expense');
        }
      },
      preserveScroll: true,
    };

    if (editingExpense?.id) {
      router.put(`/budget/expenses/${editingExpense.id}`, formattedData, options);
    } else {
      router.post('/budget/expenses', formattedData, options);
    }
  };

  const handleDeleteCategory = (id: string) => {
    router.delete(`/budget/categories/${id}`, {
      onSuccess: () => toast.success('Category and its expenses deleted successfully!'),
      preserveScroll: true,
    });
  };

  const handleDeleteExpense = (id: string) => {
    router.delete(`/budget/expenses/${id}`, {
      onSuccess: () => toast.success('Expense deleted successfully!'),
      preserveScroll: true,
    });
  };

  return (
    <div className="container mx-auto p-4 gap-4">
      <BudgetDashboard
        totalBudget={totalBudget}
        budgetCategories={budgetCategories}
        monthlySpending={monthlySpending}
        onAddCategory={handleAddCategory}
        onAddExpense={handleAddExpense}
      />
      
      <BudgetCategoryList
        categories={budgetCategories}
        onEdit={handleEditCategory}
        onDelete={handleDeleteCategory}
      />
      
      <ExpenseList
        expenses={expenses}
        budgetCategories={budgetCategories}
        onEdit={handleEditExpense}
        onDelete={handleDeleteExpense}
      />

      {/* Forms and Modals */}
      {isAddCategoryOpen && (
        <BudgetCategoryForm
          open={isAddCategoryOpen}
          onOpenChange={closeCategoryForm}
          onSubmit={handleCategorySubmit}
          category={null}
        />
      )}
      {isEditCategoryOpen && editingCategory && (
        <BudgetCategoryForm
          key={`edit-${editingCategory.id}`}
          open={isEditCategoryOpen}
          onOpenChange={closeCategoryForm}
          onSubmit={handleCategorySubmit}
          category={editingCategory}
        />
      )}
      
      <ExpenseForm
        open={isAddExpenseOpen || isEditExpenseOpen}
        onOpenChange={closeExpenseForm} // Use the new, stable close handler
        budgetCategories={budgetCategories}
        onSubmit={handleExpenseSubmit}
        expense={editingExpense}
      />
    </div>
  );
};

BudgetTracking.layout = (page: React.ReactElement) => <Layout>{page}</Layout>;
export default BudgetTracking;
