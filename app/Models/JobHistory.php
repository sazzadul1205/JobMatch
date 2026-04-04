<?php
// app/Models/JobHistory.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Validation\ValidationException;

class JobHistory extends Model
{
    use HasFactory, SoftDeletes;

    const MAX_ENTRIES_PER_PROFILE = 3;

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

    /* ========== VALIDATION ========== */

    /**
     * Check if user has reached the maximum number of entries
     */
    public static function hasReachedMaxEntries($applicantProfileId)
    {
        return self::where('applicant_profile_id', $applicantProfileId)
            ->count() >= self::MAX_ENTRIES_PER_PROFILE;
    }

    /**
     * Get remaining slots for a profile
     */
    public static function getRemainingSlots($applicantProfileId)
    {
        $currentCount = self::where('applicant_profile_id', $applicantProfileId)->count();
        return max(0, self::MAX_ENTRIES_PER_PROFILE - $currentCount);
    }

    /**
     * Boot method to add global constraints
     */
    protected static function boot()
    {
        parent::boot();

        // Check before creating a new record
        static::creating(function ($model) {
            if (self::hasReachedMaxEntries($model->applicant_profile_id)) {
                throw ValidationException::withMessages([
                    'job_history' => sprintf(
                        'Maximum %d job history entries allowed per profile.',
                        self::MAX_ENTRIES_PER_PROFILE
                    )
                ]);
            }
        });
    }
}
