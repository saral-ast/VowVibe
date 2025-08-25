<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $collection) {
            $collection->id();
            $collection->foreignId('wedding_id')->index();
            $collection->string('title');
            $collection->string('status')->default('pending')->index(); // Index for filtering
            $collection->date('due_date')->nullable();
            $collection->text('description')->nullable();
            $collection->string('priority');
            $collection->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};