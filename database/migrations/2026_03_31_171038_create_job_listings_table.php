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

            $table->longText('description');
            $table->longText('requirements');

            $table->string('job_type');

            // Salary structure (BD-friendly + scalable)
            $table->decimal('salary_min', 10, 2)->nullable();
            $table->decimal('salary_max', 10, 2)->nullable();
            $table->boolean('is_salary_negotiable')->default(false);
            $table->boolean('as_per_companies_policy')->default(false);

            // Foreign key to locations and categories
            $table->foreignId('category_id')->constrained('job_categories')->onDelete('cascade');

            // Education requirement & experience level
            $table->string('experience_level');
            $table->string('education_requirement')->nullable();
            $table->string("education_details")->nullable();

            // JSON fields for multiple items
            $table->json('benefits')->nullable();
            $table->json('skills')->nullable();
            $table->json('responsibilities')->nullable();

            $table->json('keywords')->nullable();
            $table->date('application_deadline');

            // Publish date (optional)
            $table->date('publish_at')->nullable();

            // Quick counter cache for views
            $table->unsignedInteger('views_count')->default(0);

            // External apply fields
            $table->json('external_apply_links')->nullable();
            $table->boolean('is_external_apply')->default(false);

            $table->boolean('is_active')->default(true);
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // Social media toggles
            $table->boolean('required_facebook_link')->default(false);
            $table->boolean('required_linkedin_link')->default(false);


            // Timestamps and soft deletes
            $table->timestamps();
            $table->softDeletes();

            // Add indexes for better performance
            $table->index(['is_active', 'application_deadline']);
            $table->index('job_type');
            $table->index('publish_at');
            $table->index('user_id');
            $table->index('category_id');
            $table->index(['is_active', 'publish_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_listings');
    }
};
