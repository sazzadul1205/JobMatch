<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('page_sections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('page_id')->constrained()->cascadeOnDelete();
            $table->foreignId('section_id')->nullable()->constrained()->nullOnDelete();
            $table->string('section_key', 100);
            $table->integer('order')->default(0);
            $table->boolean('is_enabled')->default(true);
            $table->boolean('is_special_component')->default(false);
            $table->string('prop_name', 100)->nullable();
            $table->json('data');
            $table->json('custom_props')->nullable();
            $table->timestamps();

            $table->index('page_id');
            $table->index('section_id');
            $table->index('section_key');
            $table->index('order');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('page_sections');
    }
};
