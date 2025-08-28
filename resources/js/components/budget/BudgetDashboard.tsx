// resources/js/components/budget/BudgetDashboard.tsx

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { DollarSign, Plus, TrendingUp, TrendingDown, PieChart, BarChart3, FolderPlus } from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';
import { BudgetCategory } from '@/types/budget.types';

interface BudgetDashboardProps {
  totalBudget: number;
  budgetCategories: BudgetCategory[];
  monthlySpending: { month: string; amount: number }[];
  onAddCategory: () => void;
  onAddExpense: () => void;
}

// Compact budget stat card component
const CompactBudgetCard = ({ 
  value, 
  label, 
  icon: Icon,
  className = "",
  percentage,
  showProgress = false
}: { 
  value: number; 
  label: string; 
  icon: React.ElementType;
  className?: string;
  percentage?: number;
  showProgress?: boolean;
}) => (
  <Card className={`transition-all hover:shadow-sm ${className}`}>
    <CardContent className="px-3 py-3">
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <Icon className="h-3 w-3 text-muted-foreground" />
      </div>
      <div className="text-lg font-bold">${value.toLocaleString()}</div>
      {percentage !== undefined && (
        <p className="text-xs text-muted-foreground">{percentage.toFixed(1)}% of budget</p>
      )}
      {showProgress && percentage !== undefined && (
        <Progress value={percentage} className="mt-1 h-1" />
      )}
    </CardContent>
  </Card>
);

const BudgetDashboard: React.FC<BudgetDashboardProps> = ({ 
  totalBudget, 
  budgetCategories, 
  monthlySpending, 
  onAddCategory, 
  onAddExpense 
}) => {
  // Safely calculate total spent, defaulting to 0 if spent is undefined
  const totalSpent = budgetCategories.reduce((sum, cat) => sum + (cat.spent || 0), 0);
  const remainingBudget = totalBudget - totalSpent;
  const spentPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  const avgPerCategory = totalSpent / (budgetCategories.length || 1);

  return (
    <>
      {/* Header Section - Compact */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">Budget & Expenses</h1>
          <p className="text-sm text-muted-foreground">Track your wedding spending and stay within budget</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onAddCategory}>
            <FolderPlus className="w-3 h-3 mr-1" /> Add Category
          </Button>
          <Button size="sm" onClick={onAddExpense}>
            <Plus className="w-3 h-3 mr-1" /> Add Expense
          </Button>
        </div>
      </div>

      {/* Compact Stats Grid */}
      <div className="mb-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <CompactBudgetCard
            value={totalBudget}
            label="Total Budget"
            icon={DollarSign}
            className="bg-card/60"
          />
          <CompactBudgetCard
            value={totalSpent}
            label="Total Spent"
            icon={TrendingUp}
            className="bg-card/60"
            percentage={spentPercentage}
            showProgress={true}
          />
          <CompactBudgetCard
            value={remainingBudget}
            label="Remaining"
            icon={TrendingDown}
            className="bg-card/60"
          />
          <CompactBudgetCard
            value={avgPerCategory}
            label="Avg per Category"
            icon={BarChart3}
            className="bg-card/60"
          />
        </div>
      </div>

      {/* Charts Section - Compact */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <Card className="bg-card/60">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              <div>
                <CardTitle className="text-base">Budget Breakdown</CardTitle>
                <CardDescription className="text-xs">Spending by category</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie 
                    data={budgetCategories.map(cat => ({
                      ...cat,
                      spent: cat.spent || 0,
                      name: cat.title // Use title for display
                    }))} 
                    cx="50%" 
                    cy="50%" 
                    innerRadius={40} 
                    outerRadius={75} 
                    dataKey="spent" 
                    nameKey="name"
                  >
                    {budgetCategories.map((entry) => 
                      <Cell key={`cell-${entry._id || entry.id || ''}`} fill={entry.color} />
                    )}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/60">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <div>
                <CardTitle className="text-base">Monthly Spending</CardTitle>
                <CardDescription className="text-xs">Spending pattern over time</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlySpending}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 10 }}
                    axisLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 10 }}
                    axisLine={false}
                  />
                  <Tooltip 
                    formatter={(value) => `$${value.toLocaleString()}`}
                    contentStyle={{ 
                      fontSize: '12px',
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default BudgetDashboard;
