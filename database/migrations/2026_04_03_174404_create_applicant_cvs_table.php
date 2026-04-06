<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('applicant_cvs', function (Blueprint $table) {
            $table->id();

            $table->foreignId('applicant_profile_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('cv_path');
            $table->string('original_name')->nullable();

            $table->enum('status', ['pending', 'active'])->default('pending');

            $table->integer('order_position')->default(0);

            $table->boolean('is_primary')->default(false);

            $table->timestamps();


            $table->index('applicant_profile_id');
            $table->index('status');
            $table->index('is_primary');

            // Prevent duplicate ordering per profile
            $table->unique(['applicant_profile_id', 'order_position']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('applicant_cvs');
    }
};
