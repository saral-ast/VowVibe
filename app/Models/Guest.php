<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Guest extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'guests';

    // Use snake_case to match your migration file
    protected $fillable = [
        'wedding_id',
        'name',
        'email',
        'phone',
        'side',
        'group',
        'role',
        'invite_status',
        'plus_one',
        'members_count',
        'dietary_restrictions',
    ];

    // This tells Eloquent how to handle specific data types
    protected $casts = [
        'plus_one' => 'boolean',
        'members_count' => 'integer',
    ];

    public function wedding(): BelongsTo
    {
        return $this->belongsTo(Wedding::class);
    }
}