<?php
// app/Models/ApplicantCv.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Validation\ValidationException;

class ApplicantCv extends Model
{
    use HasFactory, SoftDeletes;

    const MAX_CVS_PER_PROFILE = 3;

    /**
     * Fillable fields
     */
    protected $fillable = [
        'applicant_profile_id',
        'cv_path',
        'original_name',
        'order_position',
        'is_primary',
    ];

    /**
     * Cast fields
     */
    protected $casts = [
        'is_primary' => 'boolean',
        'order_position' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * Boot method - handle primary CV logic and max limit
     */
    protected static function boot()
    {
        parent::boot();

        // Check before creating a new record
        static::creating(function ($cv) {
            if (self::hasReachedMaxEntries($cv->applicant_profile_id)) {
                throw ValidationException::withMessages([
                    'cv' => sprintf(
                        'Maximum %d CVs allowed per profile.',
                        self::MAX_CVS_PER_PROFILE
                    )
                ]);
            }

            if ($cv->is_primary) {
                static::where('applicant_profile_id', $cv->applicant_profile_id)
                    ->update(['is_primary' => false]);
            }
        });

        static::updating(function ($cv) {
            if ($cv->is_primary && $cv->getOriginal('is_primary') !== true) {
                static::where('applicant_profile_id', $cv->applicant_profile_id)
                    ->where('id', '!=', $cv->id)
                    ->update(['is_primary' => false]);
            }
        });

        // Before deleting, if this is primary CV, assign primary to another CV
        static::deleting(function ($cv) {
            if ($cv->is_primary) {
                $anotherCv = static::where('applicant_profile_id', $cv->applicant_profile_id)
                    ->where('id', '!=', $cv->id)
                    ->first();

                if ($anotherCv) {
                    $anotherCv->update(['is_primary' => true]);
                }
            }
        });
    }

    /* ========== RELATIONSHIPS ========== */

    public function applicantProfile()
    {
        return $this->belongsTo(ApplicantProfile::class);
    }

    /* ========== HELPER METHODS ========== */

    /**
     * Get full URL for CV
     */
    public function getUrlAttribute()
    {
        return asset('storage/' . $this->cv_path);
    }

    /* ========== VALIDATION METHODS ========== */

    /**
     * Check if user has reached the maximum number of CVs
     */
    public static function hasReachedMaxEntries($applicantProfileId)
    {
        return self::where('applicant_profile_id', $applicantProfileId)
            ->count() >= self::MAX_CVS_PER_PROFILE;
    }

    /**
     * Get remaining slots for a profile
     */
    public static function getRemainingSlots($applicantProfileId)
    {
        $currentCount = self::where('applicant_profile_id', $applicantProfileId)->count();
        return max(0, self::MAX_CVS_PER_PROFILE - $currentCount);
    }

    /**
     * Get current count for a profile
     */
    public static function getCurrentCount($applicantProfileId)
    {
        return self::where('applicant_profile_id', $applicantProfileId)->count();
    }

    /**
     * Get primary CV for a profile
     */
    public static function getPrimaryCv($applicantProfileId)
    {
        return self::where('applicant_profile_id', $applicantProfileId)
            ->where('is_primary', true)
            ->first();
    }

    /**
     * Set a specific CV as primary
     */
    public function setAsPrimary()
    {
        self::where('applicant_profile_id', $this->applicant_profile_id)
            ->update(['is_primary' => false]);

        $this->is_primary = true;
        $this->save();

        return $this;
    }

    /**
     * Reorder CVs after deletion
     */
    public static function reorderCvs($applicantProfileId)
    {
        $cvs = self::where('applicant_profile_id', $applicantProfileId)
            ->orderBy('order_position')
            ->get();

        foreach ($cvs as $index => $cv) {
            $cv->order_position = $index;
            $cv->save();
        }
    }
}
