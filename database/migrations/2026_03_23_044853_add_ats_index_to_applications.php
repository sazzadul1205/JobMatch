<?php
// database/migrations/2024_01_01_000000_add_ats_index_to_applications.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class AddAtsIndexToApplications extends Migration
{
    public function up()
    {
        // Add index for better query performance
        Schema::table('applications', function (Blueprint $table) {
            if (!$this->columnIndexed('applications', 'status')) {
                $table->index('status', 'applications_status_ats_index');
            }
            if (!$this->columnIndexed('applications', 'job_listing_id')) {
                $table->index('job_listing_id', 'applications_job_listing_id_ats_index');
            }
            if (!$this->columnIndexed('applications', 'user_id')) {
                $table->index('user_id', 'applications_user_id_ats_index');
            }
        });
    }

    public function down()
    {
        Schema::table('applications', function (Blueprint $table) {
            if ($this->indexExists('applications', 'applications_status_ats_index')) {
                $table->dropIndex('applications_status_ats_index');
            }
            if ($this->indexExists('applications', 'applications_job_listing_id_ats_index')) {
                $table->dropIndex('applications_job_listing_id_ats_index');
            }
            if ($this->indexExists('applications', 'applications_user_id_ats_index')) {
                $table->dropIndex('applications_user_id_ats_index');
            }
        });
    }

    private function columnIndexed(string $table, string $column): bool
    {
        $result = DB::select(
            'SHOW INDEX FROM `' . str_replace('`', '``', $table) . '` WHERE Column_name = ?',
            [$column]
        );

        return !empty($result);
    }

    private function indexExists(string $table, string $indexName): bool
    {
        $result = DB::select(
            'SHOW INDEX FROM `' . str_replace('`', '``', $table) . '` WHERE Key_name = ?',
            [$indexName]
        );

        return !empty($result);
    }
}
