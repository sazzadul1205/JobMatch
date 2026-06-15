<?php
// database/migrations/2026_01_01_000006_create_programs_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('programs', function (Blueprint $table) {
            $table->id();
            $table->string('slug', 200)->unique();
            $table->string('title', 255);
            $table->string('breadcrumb', 255)->nullable();
            $table->text('excerpt')->comment('Short description for listing page');
            $table->longText('full_content')->comment('Full HTML for details page');
            $table->string('image', 500)->nullable();
            $table->string('bg_color', 50)->default('bg-white');
            $table->unsignedInteger('order')->default(0);
            $table->boolean('is_published')->default(true);
            $table->timestamps();

            $table->index(['order', 'is_published']);
            $table->index('slug');
        });
    }

    public function down()
    {
        Schema::dropIfExists('programs');
    }
};
