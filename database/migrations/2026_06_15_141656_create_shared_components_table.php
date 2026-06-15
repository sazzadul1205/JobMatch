<?php
// database/migrations/2026_01_01_000002_create_shared_components_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shared_components', function (Blueprint $table) {
            $table->id();
            $table->string('component_key', 100)->unique()->comment('topbar, navbar, footer');
            $table->string('name', 100);
            $table->text('description')->nullable();
            $table->json('data')->comment('Complete data for the shared component');
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shared_components');
    }
};
