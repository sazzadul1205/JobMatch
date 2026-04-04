<?php
// app/Models/JobHistory.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class JobHistory extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * Fillable fields
     */
    protected $fillable = [
        'applicant_profile_id',
        'company_name',
        'position',
        'starting_year',
        'ending_year',
        'is_current',
    ];

    /**
     * Cast fields
     */
    protected $casts = [
        'starting_year' => 'integer',
        'ending_year' => 'integer',
        'is_current' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /* ========== RELATIONSHIPS ========== */

    public function applicantProfile()
    {
        return $this->belongsTo(ApplicantProfile::class);
    }

    /* ========== ACCESSORS ========== */

    /**
     * Get formatted duration (e.g., "2020 - Present")
     */
    public function getDurationAttribute()
    {
        $start = $this->starting_year;

        if ($this->is_current) {
            return $start . ' - Present';
        }

        $end = $this->ending_year ?? 'Present';
        return $start . ' - ' . $end;
    }
}
