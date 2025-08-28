<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBudgetCategoryRequest;
use App\Http\Requests\StoreExpenseRequest;
use App\Models\BudgetCategory;
use App\Models\Expense;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BudgetController extends Controller
{
    /**
     * Display the main budget tracking page.
     */
    public function index()
    {
        $wedding = Auth::user()->wedding;

        // Fetch categories for this wedding
        $categories = $wedding->budgetCategories;

        // Calculate the 'spent' amount for each category
        $budgetCategories = $categories->map(function ($category) {
            $spent = $category->expenses()->sum('amount');
            return [
                'id' => $category->id,
                'name' => $category->name,
                'color' => $category->color,
                'spent' => (float) $spent,
                'budgeted' => (float) $category->budgeted ?? 0,
            ];
        });

        // Fetch all expenses for these categories
        $expenses = [];
        if ($categories->isNotEmpty()) {
            $expenses = Expense::whereIn('budget_category_id', $categories->pluck('_id'))
                ->orderBy('date', 'desc')
                ->get();
        }

        // Get monthly spending data for the last 6 months
        $monthlySpending = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $month = $date->format('M');
            $year = $date->year;
            
            $amount = Expense::whereIn('budget_category_id', $categories->pluck('_id'))
                ->whereYear('date', $year)
                ->whereMonth('date', $date->month)
                ->sum('amount');
                
            $monthlySpending[] = [
                'month' => $month,
                'amount' => (float) $amount
            ];
        }

        return Inertia::render('BudgetTracking', [
            'totalBudget' => (float) $wedding->budget,
            'budgetCategories' => $budgetCategories,
            'expenses' => $expenses,
            'monthlySpending' => $monthlySpending,
        ]);
    }
    // --- Budget Category Methods ---

    public function storeCategory(StoreBudgetCategoryRequest $request)
    {
        $wedding = Auth::user()->wedding;
        
        $wedding->budgetCategories()->create($request->validated());

        return redirect()->route('budget')->with('success', 'Category added successfully.');
    }

    public function updateCategory(StoreBudgetCategoryRequest $request, BudgetCategory $category)
    {
        $category->update($request->validated());
        return redirect()->route('budget')->with('success', 'Category updated successfully.');
    }

    public function destroyCategory(BudgetCategory $category)
    {
        $category->delete(); // Expenses will be deleted automatically due to onDelete('cascade')
        return redirect()->route('budget')->with('success', 'Category deleted successfully.');
    }


    // --- Expense Methods ---

    public function storeExpense(StoreExpenseRequest $request)
    {
        Expense::create($request->validated());
        return redirect()->route('budget')->with('success', 'Expense added successfully.');
    }

    public function updateExpense(StoreExpenseRequest $request, Expense $expense)
    {
        $expense->update($request->validated());
        return redirect()->route('budget')->with('success', 'Expense updated successfully.');
    }

    public function destroyExpense(Expense $expense)
    {
        $expense->delete();
        return redirect()->route('budget')->with('success', 'Expense deleted successfully.');
    }
}