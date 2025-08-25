<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('guests', function (Blueprint $collection) {
            $collection->id();
            $collection->foreignId('wedding_id')->index(); // Belongs to a wedding
            $collection->string('name');
            $collection->string('phone')->nullable();
            $collection->enum('side', ['bride', 'groom']);
            $collection->string('group'); // Family, Friends, Work Colleagues, etc.
            $collection->string('role'); // Bridesmaid, Best Man, Uncle, etc.
            $collection->string('invite_status')->default('pending');
            $collection->boolean('plus_one')->default(false);
            $collection->text('dietary_restrictions')->nullable();
            $collection->timestamps();
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('guests_collection');
    }
};