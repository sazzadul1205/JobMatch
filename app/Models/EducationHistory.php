<?php
// app/Models/EducationHistory.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Validation\ValidationException;

class EducationHistory extends Model
{
    use HasFactory, SoftDeletes;

    const MAX_ENTRIES_PER_PROFILE = 3;

    /**
     * Fillable fields
     */
    protected $fillable = [
        'applicant_profile_id',
        'institution_name',
        'degree',
        'passing_year',
    ];

    /**
     * Cast fields
     */
    protected $casts = [
        'passing_year' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /* ========== RELATIONSHIPS ========== */

    public function applicantProfile()
    {
        return $this->belongsTo(ApplicantProfile::class);
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
     * Get current count for a profile
     */
    public static function getCurrentCount($applicantProfileId)
    {
        return self::where('applicant_profile_id', $applicantProfileId)->count();
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
                    'education_history' => sprintf(
                        'Maximum %d education history entries allowed per profile.',
                        self::MAX_ENTRIES_PER_PROFILE
                    )
                ]);
            }
        });
    }
}
