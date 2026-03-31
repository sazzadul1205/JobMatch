<?php
// database/migrations/2026_03_31_171038_create_job_listings_table.php

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
            $table->string('slug')->unique();
            $table->longText('description'); // Rich text
            $table->longText('requirements'); // Rich text
            $table->foreignId('location_id')->constrained()->onDelete('cascade');
            $table->string('salary')->nullable();
            $table->string('job_type');
            $table->foreignId('category_id')->constrained('job_categories')->onDelete('cascade');
            $table->string('experience_level');

            // Education requirement field
            $table->string('education_requirement')->nullable();

            // JSON fields for multiple items
            $table->json('benefits')->nullable();
            $table->json('skills')->nullable();
            $table->json('responsibilities')->nullable();

            $table->json('keywords')->nullable();
            $table->date('application_deadline');

            // Schedule start date (optional)
            $table->date('schedule_start_date')->nullable();

            $table->boolean('is_active')->default(true);
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // Social media toggles
            $table->boolean('show_linkedin')->default(false);
            $table->boolean('show_facebook')->default(false);

            $table->timestamps();

            // Soft delete
            $table->softDeletes();

            // Add indexes for better performance
            $table->index(['is_active', 'application_deadline']);
            $table->index('category_id');
            $table->index('location_id');
            $table->index('job_type');
            $table->index('slug');
            $table->index('schedule_start_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_listings');
    }
};
