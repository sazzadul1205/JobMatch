<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('applications', function (Blueprint $table) {
            // Add ATS calculation status tracking
            $table->enum('ats_calculation_status', ['pending', 'processing', 'completed', 'failed'])->default('pending')->after('ats_score');
            $table->unsignedTinyInteger('ats_attempt_count')->default(0)->after('ats_calculation_status');
            $table->timestamp('ats_last_attempted_at')->nullable()->after('ats_attempt_count');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('applications', function (Blueprint $table) {
            $table->dropColumn(['ats_calculation_status', 'ats_attempt_count', 'ats_last_attempted_at']);
        });
    }
};
