<?php
// database/migrations/2026_01_01_000001_create_sections_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sections', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('component', 100);
            $table->text('description')->nullable();
            $table->string('preview_image', 255)->nullable();
            $table->json('default_props')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index('component');
            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sections');
    }
};
