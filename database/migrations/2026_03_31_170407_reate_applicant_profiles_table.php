<?php
// database/migrations/2026_03_22_140110_create_applicant_profiles_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('applicant_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('first_name');
            $table->string('last_name');
            $table->date('birth_date')->nullable();
            $table->string('email');
            $table->string('phone')->nullable();
            $table->string('photo_path')->nullable();
            $table->string('cv_path')->nullable();
            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index('user_id');
            $table->index('email');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('applicant_profiles');
    }
};
