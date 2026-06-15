<?php
// database/migrations/2026_01_01_000013_create_stats_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('stats', function (Blueprint $table) {
            $table->id();
            $table->string('page_slug', 100)->comment('home, about');
            $table->string('value', 50)->comment('20, 450K, 41,382');
            $table->string('suffix', 20)->nullable()->comment('+, M, K, %');
            $table->string('label', 200);
            $table->string('icon', 500)->nullable();
            $table->unsignedInteger('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['page_slug', 'order']);
            $table->index('is_active');
        });
    }

    public function down()
    {
        Schema::dropIfExists('stats');
    }
};
