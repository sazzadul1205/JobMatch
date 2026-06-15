<?php
// database/migrations/2026_01_01_000003_create_blogs_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('blogs', function (Blueprint $table) {
            $table->id();
            $table->string('slug', 200)->unique();
            $table->string('title', 255);
            $table->text('excerpt');
            $table->longText('content')->comment('Full HTML content');
            $table->string('image', 500)->nullable();
            $table->date('date');
            $table->string('created_by', 100)->default('Admin');
            $table->string('timer_read', 50)->default('5 min read');
            $table->boolean('is_published')->default(true);
            $table->timestamps();

            $table->index(['is_published', 'date']);
            $table->index('slug');
            $table->index('title');
        });
    }

    public function down()
    {
        Schema::dropIfExists('blogs');
    }
};
