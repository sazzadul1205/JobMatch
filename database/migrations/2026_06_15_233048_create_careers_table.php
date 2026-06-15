<?php
// database/migrations/2026_06_15_233048_create_careers_table.php (RENAME FILE)

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('careers', function (Blueprint $table) {  // ← CHANGED FROM 'jobs'
            $table->id();
            $table->string('title', 255);
            $table->string('type', 50)->comment('Full time, Part time, Contract, Remote, Internship');
            $table->string('department', 150);
            $table->string('location', 255);
            $table->text('description');
            $table->string('link', 500);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['is_active', 'type']);
            $table->index('department');
        });
    }

    public function down()
    {
        Schema::dropIfExists('careers');  // ← CHANGED FROM 'jobs'
    }
};
