<?php
// database/migrations/2026_03_22_140200_create_job_categories_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('job_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();

            // Add index for better performance
            $table->index('is_active');
            $table->index('slug');
        });

        // Insert industrial grade categories
        $categories = [
            'Information Technology',
            'Engineering',
            'Healthcare',
            'Finance & Accounting',
            'Sales & Marketing',
            'Human Resources',
            'Administration',
            'Education & Training',
            'Customer Service',
            'Manufacturing',
            'Construction',
            'Logistics & Supply Chain',
            'Retail',
            'Hospitality & Tourism',
            'Media & Communications',
            'Legal',
            'Real Estate',
            'Agriculture',
            'Telecommunications',
            'Automotive',
        ];

        foreach ($categories as $category) {
            DB::table('job_categories')->insert([
                'name' => $category,
                'slug' => Str::slug($category),
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_categories');
    }
};
