<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Guest extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'guests';

      protected $casts = [
        'plus_one' => 'boolean',
        'family_members' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];


    protected $fillable = [
        'wedding_id',
        'name',
        'email',
        'side',
        'group',
        'role',
        'invite_status',
        'plusOne',
        'dietaryRestrictions',
        'family_members',
    ];
   

    public function wedding(): BelongsTo
    {
        return $this->belongsTo(Wedding::class);
    }
}