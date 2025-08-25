// database/migrations/YYYY_MM_DD_XXXXXX_create_weddings_collection.php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('weddings', function (Blueprint $collection) {
            $collection->id();
            $collection->foreignId('user_id')->index(); // Index for fast lookups
            $collection->string('bride_name');
            $collection->string('groom_name');
            $collection->date('wedding_date');
            $collection->string('venue');
            $collection->decimal('budget');
            $collection->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('weddings');
    }
};