// resources/js/components/budget/ExpenseList.tsx

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Calendar, Edit2, Trash2, Plus, Receipt } from 'lucide-react';
import { BudgetCategory, Expense } from '@/types/budget.types';
import { format } from 'date-fns';
import { useMediaQuery } from '@/hooks/use-media-query';

interface ExpenseListProps {
  expenses: Expense[];
  budgetCategories: BudgetCategory[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

const getStatusBadge = (status: 'paid' | 'pending' | 'overdue' | string) => {
  switch (status) {
    case 'paid': 
      return <Badge className="bg-green-500 hover:bg-green-600 text-white">Paid</Badge>;
    case 'pending': 
      return <Badge variant="secondary">Pending</Badge>;
    case 'overdue': 
      return <Badge variant="destructive">Overdue</Badge>;
    default: 
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, budgetCategories, onEdit, onDelete }) => {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  // No debug logging in production

  const renderDesktopTable = () => (
    <div className="hidden md:block">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.map((expense) => {
            // Convert both IDs to strings for comparison to handle MongoDB ObjectId
            const category = budgetCategories.find(cat => {
              const catId = cat.id || cat._id || '';
              const expenseCatId = expense.budget_category_id || '';
              return String(catId) === String(expenseCatId);
            });
            return (
              <TableRow key={expense.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">
                  <div>
                    <div className="font-semibold">{expense.title}</div>
                    {expense.description && (
                      <div className="text-xs text-muted-foreground line-clamp-1">
                        {expense.description}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-2 h-2 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: category?.color || '#ccc' }}
                    />
                    <span className="truncate max-w-[120px]">
                      {category?.title || category?.name || 'Uncategorized'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground whitespace-nowrap">
                    <Calendar className="h-3 w-3 flex-shrink-0" />
                    {format(new Date(expense.date), 'MMM d, yyyy')}
                  </div>
                </TableCell>
                <TableCell>
                  {getStatusBadge(expense.status)}
                </TableCell>
                <TableCell className="text-right font-medium">
                  ${expense.amount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                      onClick={() => onEdit(expense)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Expense?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete the expense "{expense.title}"?
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => onDelete(expense.id || '')} 
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
          {expenses.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                No expenses found. Add your first expense to get started.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );

  const renderMobileList = () => (
    <div className="md:hidden space-y-2 mb-4">
      {expenses.map((expense) => {
        // Convert both IDs to strings for comparison to handle MongoDB ObjectId
        const category = budgetCategories.find(cat => {
          const catId = cat.id || cat._id || '';
          const expenseCatId = expense.budget_category_id || '';
          const match = String(catId) === String(expenseCatId);
          
          return match;
        });
        
        return (
          <Card key={expense.id} className="overflow-hidden mb-4">
            <div className="flex items-start p-4">
              <div className="flex-shrink-0 p-2 rounded-lg bg-muted/50 mr-3">
                <Receipt className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-base truncate">{expense.title}</h3>
                  <div className="font-semibold ml-2 whitespace-nowrap">
                    ${expense.amount.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </div>
                </div>
                
                <div className="mt-1 flex items-center text-sm text-muted-foreground">
                  <div 
                    className="w-2 h-2 rounded-full mr-1.5 flex-shrink-0" 
                    style={{ backgroundColor: category?.color || '#ccc' }}
                  />
                  <span className="truncate">
                    {category?.title || category?.name || 'Uncategorized'}
                  </span>
                  <span className="mx-1.5">•</span>
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {format(new Date(expense.date), 'MMM d')}
                  </div>
                </div>
                
                {expense.description && (
                  <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
                    {expense.description}
                  </p>
                )}
                
                <div className="mt-2 flex items-center justify-between">
                  <div>
                    {getStatusBadge(expense.status)}
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 px-2 text-muted-foreground"
                      onClick={() => onEdit(expense)}
                    >
                      <Edit2 className="h-3.5 w-3.5 mr-1" />
                      <span className="text-xs">Edit</span>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 px-2 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1" />
                          <span className="text-xs">Delete</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Expense?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete the expense "{expense.title}"?
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => onDelete(expense.id || '')} 
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
      
      {expenses.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-3 mb-3">
            <Receipt className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-1">No expenses yet</h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            Track your wedding expenses by adding your first expense
          </p>
          <Button className="mt-4" size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Add Expense
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Expense Records</CardTitle>
          <CardDescription>Track all your wedding expenses in one place</CardDescription>
        </div>
        <Button size="sm" className="gap-1">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Expense</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-md">
          {isDesktop ? renderDesktopTable() : renderMobileList()}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseList;
