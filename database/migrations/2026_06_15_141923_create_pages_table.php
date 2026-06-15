<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('parent_id')->nullable()->constrained('pages')->cascadeOnDelete();
            $table->string('slug', 255);
            $table->string('name', 100);
            $table->string('title', 255);
            $table->text('description')->nullable();
            $table->text('keywords')->nullable();
            $table->string('og_image', 255)->nullable();
            $table->string('template', 100)->default('dynamic');
            $table->enum('page_type', ['regular', 'blog', 'program', 'about_sub'])->default('regular');
            $table->boolean('is_published')->default(true);
            $table->timestamp('published_at')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();

            $table->unique(['slug', 'parent_id']);
            $table->index('parent_id');
            $table->index('page_type');
            $table->index('is_published');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pages');
    }
};
