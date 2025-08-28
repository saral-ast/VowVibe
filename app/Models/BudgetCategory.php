<?php

namespace App\Models;

// Use the MongoDB Eloquent Model
use MongoDB\Laravel\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BudgetCategory extends Model
{
    // Add these two lines to use MongoDB
    protected $connection = 'mongodb';
    protected $collection = 'budget_categories';

    protected $fillable = [
        'wedding_id',
        'name',
        'title',
        'description',
        'budgeted',
        'spent',
        'color',
    ];
    
    protected $casts = [
        'budgeted' => 'float',
        'spent' => 'float',
    ];
    
    protected $appends = ['id_string'];
    
    public function getIdStringAttribute()
    {
        return (string) $this->getKey();
    }

    public function wedding(): BelongsTo
    {
        return $this->belongsTo(Wedding::class);
    }

    public function expenses(): HasMany
    {
        return $this->hasMany(Expense::class);
    }
}