// resources/js/components/budget/BudgetCategoryList.tsx

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Edit2, Trash2 } from 'lucide-react';
import { BudgetCategory } from '@/types/budget.types';

interface BudgetCategoryListProps {
  categories: BudgetCategory[];
  onEdit: (category: BudgetCategory) => void;
  onDelete: (id: string) => void;
}

const BudgetCategoryList: React.FC<BudgetCategoryListProps> = ({ categories, onEdit, onDelete }) => {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Budget Categories</CardTitle>
        <CardDescription>Manage spending across all wedding categories</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categories.map((category) => {
            return (
              <div key={category._id || category.id} className="space-y-2">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className="w-4 h-4 rounded-full flex-shrink-0 mt-1.5" style={{ backgroundColor: category.color }} />
                      <div>
                        <div className="font-medium">{category.title} <span className="text-muted-foreground text-sm font-normal">({category.name})</span></div>
                        {category.description && (
                          <div className="text-sm text-muted-foreground mt-0.5">{category.description}</div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(category)}><Edit2 className="w-4 h-4" /></Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-red-500"><Trash2 className="w-4 h-4" /></Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Category?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{category.name}"? This will also delete all associated expenses.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => onDelete(category.id || category._id || '')} 
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetCategoryList;
