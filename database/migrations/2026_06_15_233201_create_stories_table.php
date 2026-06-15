<?php
// database/migrations/2026_01_01_000012_create_stories_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('stories', function (Blueprint $table) {
            $table->id();
            $table->string('title', 255);
            $table->text('description');
            $table->string('image', 500);
            $table->string('date', 100)->comment('June 6, 2023');
            $table->string('link', 500);
            $table->unsignedInteger('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['order', 'is_active']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('stories');
    }
};
