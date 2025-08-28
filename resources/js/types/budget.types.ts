export interface BudgetCategory {
    id?: string;  // Optional since MongoDB uses _id
    _id?: string; // MongoDB _id field
    title: string;
    name: string;
    description?: string;
    budgeted: number;
    spent?: number; // Made optional since it's calculated
    color: string;
  }
  
  export interface Expense {
    id?: string;
    title: string;
    description?: string;
    amount: number;
    date: string;
    status: 'paid' | 'pending' | 'overdue';
    budget_category_id: string;
    vendor?: string;
  }
  