<?php
// database/migrations/2026_04_04_000008_create_job_views_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('job_views', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_listing_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->string('ip_address', 45)->nullable();
            $table->timestamps();

            // Prevent duplicate views from same user/ip on same job
            $table->index(['job_listing_id', 'user_id']);
            $table->index(['job_listing_id', 'ip_address']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_views');
    }
};
