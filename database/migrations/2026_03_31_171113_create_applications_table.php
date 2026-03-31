<?php
// database/migrations/2026_03_31_171113_create_applications_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_listing_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('applicant_profile_id')->nullable()->constrained()->onDelete('set null');
            $table->string('name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->string('resume_path');
            $table->decimal('expected_salary', 12, 2)->nullable();
            $table->json('ats_score')->nullable();
            $table->json('matched_keywords')->nullable();
            $table->json('missing_keywords')->nullable();
            $table->enum('status', ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'])->default('pending');
            $table->text('employer_notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            // Add indexes
            $table->index('status');
            $table->index(['job_listing_id', 'status']);
            $table->index('applicant_profile_id');
            $table->unique(['job_listing_id', 'user_id']); // Prevent duplicate applications
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('applications');
    }
};
