<?php
// database/migrations/2026_03_31_171120_add_ats_index_to_applications.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add index for better query performance
        Schema::table('applications', function (Blueprint $table) {
            if (!$this->columnIndexed('applications', 'user_id')) {
                $table->index('user_id', 'applications_user_id_ats_index');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('applications', function (Blueprint $table) {
            if ($this->indexExists('applications', 'applications_user_id_ats_index')) {
                $table->dropIndex('applications_user_id_ats_index');
            }
        });
    }

    /**
     * Check if a column has an index.
     */
    private function columnIndexed(string $table, string $column): bool
    {
        $result = DB::select(
            'SHOW INDEX FROM `' . str_replace('`', '``', $table) . '` WHERE Column_name = ?',
            [$column]
        );

        return !empty($result);
    }

    /**
     * Check if an index exists.
     */
    private function indexExists(string $table, string $indexName): bool
    {
        $result = DB::select(
            'SHOW INDEX FROM `' . str_replace('`', '``', $table) . '` WHERE Key_name = ?',
            [$indexName]
        );

        return !empty($result);
    }
};
