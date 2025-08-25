import React, { useState } from 'react';
import { DollarSign, Plus, TrendingUp, TrendingDown, PieChart, BarChart3, Calendar, Receipt, Edit2, Trash2, Save, FolderPlus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from 'recharts';
import { toast } from 'sonner';
import Layout from '@/components/Layout';

interface BudgetCategory {
  id: string;
  name: string;
  budgeted: number;
  spent: number;
  color: string;
}

interface Expense {
  id: string;
  category: string;
  vendor: string;
  description: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending' | 'overdue';
  budgetCategory: string;
}

const initialBudgetCategories: BudgetCategory[] = [
  { id: '1', name: 'Venue', budgeted: 20000, spent: 15000, color: '#3b82f6' },
  { id: '2', name: 'Catering', budgeted: 12000, spent: 8000, color: '#10b981' },
  { id: '3', name: 'Photography', budgeted: 5000, spent: 3500, color: '#f59e0b' },
  { id: '4', name: 'Flowers', budgeted: 3000, spent: 2000, color: '#ef4444' },
  { id: '5', name: 'Music', budgeted: 2500, spent: 1500, color: '#8b5cf6' },
  { id: '6', name: 'Attire', budgeted: 3000, spent: 1800, color: '#06b6d4' },
  { id: '7', name: 'Transportation', budgeted: 1500, spent: 800, color: '#84cc16' },
  { id: '8', name: 'Decorations', budgeted: 2000, spent: 1200, color: '#f97316' },
];

const initialExpenses: Expense[] = [
  {
    id: '1',
    category: 'Venue',
    vendor: 'Rosewood Manor',
    description: 'Final venue payment',
    amount: 5000,
    date: '2024-03-15',
    status: 'paid',
    budgetCategory: 'Venue'
  },
  {
    id: '2',
    category: 'Photography',
    vendor: 'Perfect Moments Studio',
    description: 'Wedding photography package',
    amount: 2500,
    date: '2024-03-12',
    status: 'paid',
    budgetCategory: 'Photography'
  },
  {
    id: '3',
    category: 'Catering',
    vendor: 'Gourmet Delights',
    description: 'Menu tasting and deposit',
    amount: 1200,
    date: '2024-03-10',
    status: 'pending',
    budgetCategory: 'Catering'
  },
  {
    id: '4',
    category: 'Flowers',
    vendor: 'Bloom & Blossom',
    description: 'Bridal bouquet and centerpieces',
    amount: 800,
    date: '2024-03-08',
    status: 'paid',
    budgetCategory: 'Flowers'
  },
];

const monthlySpending = [
  { month: 'Jan', amount: 5000 },
  { month: 'Feb', amount: 8500 },
  { month: 'Mar', amount: 12000 },
  { month: 'Apr', amount: 6500 },
  { month: 'May', amount: 4200 },
  { month: 'Jun', amount: 2800 },
];

const availableColors = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', 
  '#06b6d4', '#84cc16', '#f97316', '#6366f1', '#ec4899'
];

export default function BudgetTracking() {
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>(initialBudgetCategories);
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isEditExpenseOpen, setIsEditExpenseOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [editingCategory, setEditingCategory] = useState<BudgetCategory | null>(null);
  const [expenseFormData, setExpenseFormData] = useState<Partial<Expense>>({});
  const [categoryFormData, setCategoryFormData] = useState<Partial<BudgetCategory>>({});
  
  const totalBudget = budgetCategories.reduce((sum, cat) => sum + cat.budgeted, 0);
  const totalSpent = budgetCategories.reduce((sum, cat) => sum + cat.spent, 0);
  const remainingBudget = totalBudget - totalSpent;
  const spentPercentage = (totalSpent / totalBudget) * 100;

  const handleAddExpense = () => {
    if (!expenseFormData.vendor || !expenseFormData.amount || !expenseFormData.budgetCategory || !expenseFormData.date || !expenseFormData.status) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newExpense: Expense = {
      id: Date.now().toString(),
      category: expenseFormData.budgetCategory || '',
      vendor: expenseFormData.vendor || '',
      description: expenseFormData.description || '',
      amount: expenseFormData.amount || 0,
      date: expenseFormData.date || '',
      status: expenseFormData.status as 'paid' | 'pending' | 'overdue',
      budgetCategory: expenseFormData.budgetCategory || ''
    };

    setExpenses([...expenses, newExpense]);
    
    // Update category spent amount
    setBudgetCategories(cats => 
      cats.map(cat => 
        cat.name === newExpense.budgetCategory 
          ? { ...cat, spent: cat.spent + newExpense.amount }
          : cat
      )
    );

    setExpenseFormData({});
    setIsAddExpenseOpen(false);
    toast.success('Expense added successfully!');
  };

  const handleEditExpense = () => {
    if (!editingExpense || !expenseFormData.vendor || !expenseFormData.amount || !expenseFormData.budgetCategory || !expenseFormData.date || !expenseFormData.status) {
      toast.error('Please fill in all required fields');
      return;
    }

    const oldExpense = editingExpense;
    const updatedExpense = {
      ...editingExpense,
      ...expenseFormData
    };

    setExpenses(expenses.map(exp => exp.id === editingExpense.id ? updatedExpense : exp));
    
    // Update category spent amounts
    setBudgetCategories(cats => 
      cats.map(cat => {
        // Remove old amount from old category
        if (cat.name === oldExpense.budgetCategory) {
          return { ...cat, spent: cat.spent - oldExpense.amount };
        }
        // Add new amount to new category
        if (cat.name === updatedExpense.budgetCategory) {
          return { ...cat, spent: cat.spent + updatedExpense.amount };
        }
        return cat;
      })
    );

    setEditingExpense(null);
    setExpenseFormData({});
    setIsEditExpenseOpen(false);
    toast.success('Expense updated successfully!');
  };

  const handleDeleteExpense = (expenseId: string) => {
    const expense = expenses.find(exp => exp.id === expenseId);
    if (expense) {
      setExpenses(expenses.filter(exp => exp.id !== expenseId));
      
      // Update category spent amount
      setBudgetCategories(cats => 
        cats.map(cat => 
          cat.name === expense.budgetCategory 
            ? { ...cat, spent: cat.spent - expense.amount }
            : cat
        )
      );
      
      toast.success('Expense deleted successfully!');
    }
  };

  const handleAddCategory = () => {
    if (!categoryFormData.name || !categoryFormData.budgeted) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newCategory: BudgetCategory = {
      id: Date.now().toString(),
      name: categoryFormData.name || '',
      budgeted: categoryFormData.budgeted || 0,
      spent: 0,
      color: categoryFormData.color || availableColors[budgetCategories.length % availableColors.length]
    };

    setBudgetCategories([...budgetCategories, newCategory]);
    setCategoryFormData({});
    setIsAddCategoryOpen(false);
    toast.success('Budget category added successfully!');
  };

  const handleEditCategory = () => {
    if (!editingCategory || !categoryFormData.name || !categoryFormData.budgeted) {
      toast.error('Please fill in all required fields');
      return;
    }

    const oldCategoryName = editingCategory.name;
    const updatedCategory = {
      ...editingCategory,
      ...categoryFormData
    };

    setBudgetCategories(budgetCategories.map(cat => cat.id === editingCategory.id ? updatedCategory : cat));
    
    // Update expense categories if category name changed
    if (oldCategoryName !== updatedCategory.name) {
      setExpenses(expenses.map(exp => 
        exp.budgetCategory === oldCategoryName 
          ? { ...exp, budgetCategory: updatedCategory.name, category: updatedCategory.name }
          : exp
      ));
    }

    setEditingCategory(null);
    setCategoryFormData({});
    setIsEditCategoryOpen(false);
    toast.success('Budget category updated successfully!');
  };

  const handleDeleteCategory = (categoryId: string) => {
    const category = budgetCategories.find(cat => cat.id === categoryId);
    if (category) {
      // Remove expenses in this category
      setExpenses(expenses.filter(exp => exp.budgetCategory !== category.name));
      setBudgetCategories(budgetCategories.filter(cat => cat.id !== categoryId));
      toast.success('Budget category deleted successfully!');
    }
  };

  const openEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setExpenseFormData({
      vendor: expense.vendor,
      amount: expense.amount,
      budgetCategory: expense.budgetCategory,
      description: expense.description,
      date: expense.date,
      status: expense.status
    });
    setIsEditExpenseOpen(true);
  };

  const openEditCategory = (category: BudgetCategory) => {
    setEditingCategory(category);
    setCategoryFormData({
      name: category.name,
      budgeted: category.budgeted,
      color: category.color
    });
    setIsEditCategoryOpen(true);
  };

  const resetExpenseForm = () => {
    setExpenseFormData({});
    setEditingExpense(null);
  };

  const resetCategoryForm = () => {
    setCategoryFormData({});
    setEditingCategory(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30">Paid</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 hover:bg-yellow-100 dark:hover:bg-yellow-900/30">Pending</Badge>;
      case 'overdue':
        return <Badge className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30">Overdue</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const ExpenseForm = ({ isEdit = false }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="vendor">Vendor *</Label>
          <Input
            id="vendor"
            placeholder="Vendor name"
            value={expenseFormData.vendor || ''}
            onChange={(e) => setExpenseFormData({ ...expenseFormData, vendor: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="amount">Amount *</Label>
          <Input
            id="amount"
            type="number"
            placeholder="0.00"
            step="0.01"
            value={expenseFormData.amount || ''}
            onChange={(e) => setExpenseFormData({ ...expenseFormData, amount: parseFloat(e.target.value) || 0 })}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="category">Budget Category *</Label>
        <Select value={expenseFormData.budgetCategory || ''} onValueChange={(value) => setExpenseFormData({ ...expenseFormData, budgetCategory: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {budgetCategories.map((cat) => (
              <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Expense description"
          value={expenseFormData.description || ''}
          onChange={(e) => setExpenseFormData({ ...expenseFormData, description: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="date">Date *</Label>
          <Input
            id="date"
            type="date"
            value={expenseFormData.date || ''}
            onChange={(e) => setExpenseFormData({ ...expenseFormData, date: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="status">Status *</Label>
          <Select value={expenseFormData.status || ''} onValueChange={(value) => setExpenseFormData({ ...expenseFormData, status: value as 'paid' | 'pending' | 'overdue' })}>
            <SelectTrigger>
              <SelectValue placeholder="Payment status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => {
            resetExpenseForm();
            isEdit ? setIsEditExpenseOpen(false) : setIsAddExpenseOpen(false);
          }}
        >
          Cancel
        </Button>
        <Button
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          onClick={isEdit ? handleEditExpense : handleAddExpense}
        >
          <Save className="w-4 h-4 mr-2" />
          {isEdit ? 'Update Expense' : 'Add Expense'}
        </Button>
      </div>
    </div>
  );

  const CategoryForm = ({ isEdit = false }) => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="categoryName">Category Name *</Label>
        <Input
          id="categoryName"
          placeholder="Enter category name"
          value={categoryFormData.name || ''}
          onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="budgeted">Budget Amount *</Label>
        <Input
          id="budgeted"
          type="number"
          placeholder="0.00"
          step="0.01"
          value={categoryFormData.budgeted || ''}
          onChange={(e) => setCategoryFormData({ ...categoryFormData, budgeted: parseFloat(e.target.value) || 0 })}
        />
      </div>
      <div>
        <Label htmlFor="color">Color</Label>
        <div className="flex gap-2 flex-wrap">
          {availableColors.map((color) => (
            <button
              key={color}
              type="button"
              className={`w-8 h-8 rounded-full border-2 transition-all ${
                categoryFormData.color === color ? 'border-foreground scale-110' : 'border-transparent hover:border-muted-foreground'
              }`}
              style={{ backgroundColor: color }}
              onClick={() => setCategoryFormData({ ...categoryFormData, color })}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {categoryFormData.color ? 'Selected color' : 'Choose a color for this category'}
        </p>
      </div>
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => {
            resetCategoryForm();
            isEdit ? setIsEditCategoryOpen(false) : setIsAddCategoryOpen(false);
          }}
        >
          Cancel
        </Button>
        <Button
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          onClick={isEdit ? handleEditCategory : handleAddCategory}
        >
          <Save className="w-4 h-4 mr-2" />
          {isEdit ? 'Update Category' : 'Add Category'}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Budget & Expenses</h1>
          <p className="text-muted-foreground">Track your wedding spending and stay within budget</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/30">
                <FolderPlus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add Budget Category</DialogTitle>
                <DialogDescription>Create a new budget category</DialogDescription>
              </DialogHeader>
              <CategoryForm />
            </DialogContent>
          </Dialog>

          <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                <Plus className="w-4 h-4 mr-2" />
                Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Expense</DialogTitle>
                <DialogDescription>Record a new wedding expense</DialogDescription>
              </DialogHeader>
              <ExpenseForm />
            </DialogContent>
          </Dialog>

          {/* Edit Dialogs */}
          <Dialog open={isEditExpenseOpen} onOpenChange={setIsEditExpenseOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Expense</DialogTitle>
                <DialogDescription>Update expense details</DialogDescription>
              </DialogHeader>
              <ExpenseForm isEdit={true} />
            </DialogContent>
          </Dialog>

          <Dialog open={isEditCategoryOpen} onOpenChange={setIsEditCategoryOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Category</DialogTitle>
                <DialogDescription>Update category details</DialogDescription>
              </DialogHeader>
              <CategoryForm isEdit={true} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Budget Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">${totalBudget.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Initial budget set</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Spent</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">${totalSpent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{spentPercentage.toFixed(1)}% of budget</p>
            <Progress value={spentPercentage} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Remaining</CardTitle>
            <TrendingDown className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">${remainingBudget.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{(100 - spentPercentage).toFixed(1)}% remaining</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg per Category</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">${Math.round(totalSpent / budgetCategories.length).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across {budgetCategories.length} categories</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget vs Spent Chart */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Budget Breakdown
            </CardTitle>
            <CardDescription>Budget vs actual spending by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={budgetCategories}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="spent"
                  >
                    {budgetCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => `$${value.toLocaleString()}`}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))'
                    }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Spending Trend */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
              Monthly Spending
            </CardTitle>
            <CardDescription>Your spending pattern over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlySpending}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="month" 
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    formatter={(value) => `$${value.toLocaleString()}`}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget Categories */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            Budget Categories
          </CardTitle>
          <CardDescription>Manage spending across all wedding categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {budgetCategories.map((category, index) => {
              const percentage = (category.spent / category.budgeted) * 100;
              const isOverBudget = category.spent > category.budgeted;
              
              return (
                <div key={category.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="font-medium text-foreground">{category.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="font-medium text-foreground">
                          ${category.spent.toLocaleString()} / ${category.budgeted.toLocaleString()}
                        </div>
                        <div className={`text-sm ${isOverBudget ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground'}`}>
                          {percentage.toFixed(1)}% used
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditCategory(category)}
                        className="w-8 h-8 p-0 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                      >
                        <Edit2 className="w-3 h-3" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-8 h-8 p-0 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Category</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{category.name}"? This will also delete all associated expenses.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteCategory(category.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                  <Progress 
                    value={Math.min(percentage, 100)} 
                    className="h-2"
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Expenses */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            Recent Expenses
          </CardTitle>
          <CardDescription>Your latest wedding purchases and payments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {expenses.map((expense) => (
              <div key={expense.id} className="flex items-center justify-between p-4 rounded-lg border border-border bg-accent/20">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ 
                      backgroundColor: budgetCategories.find(cat => cat.name === expense.budgetCategory)?.color || '#3b82f6'
                    }}
                  />
                  <div>
                    <div className="font-medium text-foreground">{expense.vendor}</div>
                    <div className="text-sm text-muted-foreground">{expense.description}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{expense.date}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="font-bold text-lg text-foreground">${expense.amount.toLocaleString()}</div>
                    <div className="mt-1">
                      {getStatusBadge(expense.status)}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditExpense(expense)}
                    className="w-8 h-8 p-0 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                  >
                    <Edit2 className="w-3 h-3" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-8 h-8 p-0 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Expense</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this expense from "{expense.vendor}"?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteExpense(expense.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

BudgetTracking.layout = (page: React.ReactElement) => <Layout>{page}</Layout>;