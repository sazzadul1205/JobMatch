<?php
// database/migrations/2026_03_22_140200_create_job_categories_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

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
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            // Add index
            $table->index('is_active');
        });

        // Insert industrial grade categories
        DB::table('job_categories')->insert([
            ['name' => 'Information Technology', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Engineering', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Healthcare', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Finance & Accounting', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Sales & Marketing', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Human Resources', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Administration', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Education & Training', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Customer Service', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Manufacturing', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Construction', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Logistics & Supply Chain', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Retail', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Hospitality & Tourism', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Media & Communications', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Legal', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Real Estate', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Agriculture', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Telecommunications', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Automotive', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()]
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_categories');
    }
};
