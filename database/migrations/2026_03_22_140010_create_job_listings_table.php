<?php
// database/migrations/2026_03_22_140010_create_job_listings_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('job_listings', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->text('requirements');
            $table->string('location');
            $table->string('salary_range')->nullable();
            $table->string('job_type');
            $table->string('category');
            $table->string('experience_level');
            $table->json('keywords')->nullable();
            $table->date('application_deadline');
            $table->boolean('is_active')->default(true);
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->timestamps();

            // Add indexes for better performance
            $table->index(['is_active', 'application_deadline']);
            $table->index('category');
            $table->index('job_type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_listings');
    }
};
