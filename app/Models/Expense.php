<?php

namespace App\Models;

// Use the MongoDB Eloquent Model
use MongoDB\Laravel\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Expense extends Model
{
    // Add these two lines to use MongoDB
    protected $connection = 'mongodb';
    protected $collection = 'expenses';

    protected $fillable = [
        'budget_category_id',
        'title',
        'description',
        'amount',
        'date',
        'status',
    ];

    protected $casts = [
        'date' => 'date',
        'budget_category_id' => 'string',
    ];
    
    protected $appends = ['budget_category_id_string'];
    
    public function getBudgetCategoryIdStringAttribute()
    {
        return (string) $this->budget_category_id;
    }

    public function budgetCategory(): BelongsTo
    {
        return $this->belongsTo(BudgetCategory::class);
    }
}