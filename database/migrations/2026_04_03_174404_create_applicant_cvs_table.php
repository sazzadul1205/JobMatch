<?php
// database/migrations/2026_04_03_174404_create_applicant_cvs_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('applicant_cvs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('applicant_profile_id')->constrained()->onDelete('cascade');
            $table->string('cv_path');
            $table->string('original_name');
            $table->integer('order_position')->default(0);
            $table->boolean('is_primary')->default(false);
            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index('is_primary');

            // Ensure unique order_position per applicant
            $table->unique(['applicant_profile_id', 'order_position']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('applicant_cvs');
    }
};
