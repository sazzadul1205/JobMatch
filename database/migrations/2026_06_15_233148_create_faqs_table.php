<?php
// database/migrations/2026_01_01_000011_create_faqs_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('faqs', function (Blueprint $table) {
            $table->id();
            $table->string('page_slug', 100)->comment('about, projects-programs, blogs, contact');
            $table->string('question', 500);
            $table->text('answer');
            $table->unsignedInteger('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['page_slug', 'order']);
            $table->index('is_active');
        });
    }

    public function down()
    {
        Schema::dropIfExists('faqs');
    }
};
