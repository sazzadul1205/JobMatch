<?php
// database/migrations/2026_01_01_000010_create_social_links_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('social_links', function (Blueprint $table) {
            $table->id();
            $table->string('platform', 50)->comment('facebook, instagram, linkedin, youtube, twitter');
            $table->string('icon_name', 50)->comment('FaFacebook, FaInstagram, FaLinkedin, FaYoutube, FaXTwitter');
            $table->string('url', 500);
            $table->string('hover_color', 50)->default('hover:text-blue-400');
            $table->unsignedInteger('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['order', 'is_active']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('social_links');
    }
};
