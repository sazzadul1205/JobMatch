<?php
// database/migrations/2026_01_01_000009_create_offices_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('offices', function (Blueprint $table) {
            $table->id();
            $table->string('title', 150);
            $table->text('address');
            $table->json('phones')->comment('["+880 1761-493412", "+880 1781 732352"]');
            $table->json('emails')->comment('["dusdhaka@gmail.com", "dus.eddus@gmail.com"]');
            $table->string('map_url', 500);
            $table->json('coordinates')->nullable()->comment('{"lat": 23.7570, "lng": 90.3620}');
            $table->unsignedInteger('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['order', 'is_active']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('offices');
    }
};
