<?php
// database/migrations/2026_04_04_064402_create_job_histories_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('job_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('applicant_profile_id')->constrained()->onDelete('cascade');
            $table->string('company_name');
            $table->string('position');
            $table->year('starting_year');
            $table->year('ending_year')->nullable();
            $table->boolean('is_current')->default(false);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['applicant_profile_id', 'is_current']);
            $table->index('starting_year');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_histories');
    }
};
