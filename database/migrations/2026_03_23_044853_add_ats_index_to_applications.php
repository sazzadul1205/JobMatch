<?php
// database/migrations/2024_01_01_000000_add_ats_index_to_applications.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddAtsIndexToApplications extends Migration
{
    public function up()
    {
        // Add index for better query performance
        Schema::table('applications', function (Blueprint $table) {
            $table->index('status');
            $table->index('job_listing_id');
            $table->index('user_id');
        });
    }

    public function down()
    {
        Schema::table('applications', function (Blueprint $table) {
            $table->dropIndex(['status']);
            $table->dropIndex(['job_listing_id']);
            $table->dropIndex(['user_id']);
        });
    }
}
