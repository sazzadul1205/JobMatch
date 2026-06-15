<?php
// database/migrations/2026_01_01_000014_create_navbar_links_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('navbar_links', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('href', 200);
            $table->unsignedInteger('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['order', 'is_active']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('navbar_links');
    }
};
