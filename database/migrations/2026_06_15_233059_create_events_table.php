<?php
// database/migrations/2026_01_01_000008_create_events_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('title', 255);
            $table->text('description');
            $table->string('location', 255);
            $table->tinyInteger('date_day')->unsigned();
            $table->string('date_month', 10)->comment('Jan, Feb, Mar');
            $table->string('date_weekday', 10)->comment('MON, TUE, WED');
            $table->tinyInteger('date_day_number')->unsigned()->comment('1, 2, 3');
            $table->string('date_time', 20)->comment('10:30AM, 02:00PM');
            $table->string('link', 500);
            $table->string('image', 500)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['is_active', 'date_day', 'date_month']);
            $table->index(['date_day', 'date_month']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('events');
    }
};
