<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Wedding extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'weddings';

    protected $fillable = [
        'user_id',
        'bride_name',
        'groom_name',
        'wedding_date',
        'budget',
    ];

    // A Wedding belongs to a User
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // A Wedding has many Guests
    public function guests()
    {
        return $this->hasMany(Guest::class);
    }

    // A Wedding has many Tasks
    public function tasks()
    {
        return $this->hasMany(Task::class);
    }
}