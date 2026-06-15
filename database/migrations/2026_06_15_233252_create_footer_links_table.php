<?php
// database/migrations/2026_01_01_000015_create_footer_links_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('footer_links', function (Blueprint $table) {
            $table->id();
            $table->enum('category', ['quick_links', 'programs']);
            $table->string('name', 200);
            $table->string('url', 500);
            $table->unsignedInteger('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->index(['category', 'order']);
            $table->index('is_active');
        });
    }

    public function down()
    {
        Schema::dropIfExists('footer_links');
    }
};