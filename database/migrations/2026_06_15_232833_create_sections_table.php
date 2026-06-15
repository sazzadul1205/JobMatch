<?php
// database/migrations/2026_01_01_000002_create_sections_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('sections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('page_id')->constrained('pages')->onDelete('cascade');
            $table->string('section_key', 100)->comment('Unique identifier: banner, vision-mission, etc.');
            $table->string('component_name', 100)->comment('Matches SECTION_COMPONENTS keys');
            $table->json('data')->comment('Full content: title, html, images, buttons');
            $table->json('custom_props')->nullable()->comment('Styling: bgColor, paddingY, layout');
            $table->unsignedInteger('order')->default(0);
            $table->boolean('is_enabled')->default(true);
            $table->timestamps();

            $table->index(['page_id', 'order']);
            $table->index('component_name');
            $table->index('is_enabled');

            // Ensure section_key is unique per page
            $table->unique(['page_id', 'section_key']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('sections');
    }
};
