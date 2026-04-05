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
        'status',
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

    /* ========== RELATIONSHIPS ========== */

    public function applicantProfile()
    {
        return $this->belongsTo(ApplicantProfile::class);
    }

    /* ========== BOOT METHOD ========== */

    protected static function boot()
    {
        parent::boot();

        // Before creating
        static::creating(function ($cv) {
            // Count only active CVs
            if (self::hasReachedMaxEntries($cv->applicant_profile_id, true) && $cv->status === 'active') {
                throw ValidationException::withMessages([
                    'cv' => sprintf(
                        'Maximum %d active CVs allowed per profile.',
                        self::MAX_CVS_PER_PROFILE
                    )
                ]);
            }

            // If marked primary, unset others (consider only active CVs)
            if ($cv->is_primary && $cv->status === 'active') {
                static::where('applicant_profile_id', $cv->applicant_profile_id)
                    ->where('status', 'active')
                    ->update(['is_primary' => false]);
            }
        });

        // Before updating
        static::updating(function ($cv) {
            if ($cv->is_primary && $cv->getOriginal('is_primary') !== true && $cv->status === 'active') {
                static::where('applicant_profile_id', $cv->applicant_profile_id)
                    ->where('id', '!=', $cv->id)
                    ->where('status', 'active')
                    ->update(['is_primary' => false]);
            }
        });

        // Before deleting
        static::deleting(function ($cv) {
            if ($cv->is_primary) {
                $anotherCv = static::where('applicant_profile_id', $cv->applicant_profile_id)
                    ->where('id', '!=', $cv->id)
                    ->where('status', 'active')
                    ->first();

                if ($anotherCv) {
                    $anotherCv->update(['is_primary' => true]);
                }
            }
        });
    }

    /* ========== HELPERS ========== */

    /**
     * Get full URL for CV
     */
    public function getUrlAttribute()
    {
        return asset('storage/' . $this->cv_path);
    }

    /**
     * Check if user has reached the max number of CVs
     * @param bool $onlyActive Count only active CVs
     */
    public static function hasReachedMaxEntries($applicantProfileId, bool $onlyActive = false)
    {
        $query = self::where('applicant_profile_id', $applicantProfileId);
        if ($onlyActive) {
            $query->where('status', 'active');
        }
        return $query->count() >= self::MAX_CVS_PER_PROFILE;
    }

    /**
     * Get remaining slots for a profile
     */
    public static function getRemainingSlots($applicantProfileId)
    {
        $currentCount = self::where('applicant_profile_id', $applicantProfileId)
            ->where('status', 'active')
            ->count();
        return max(0, self::MAX_CVS_PER_PROFILE - $currentCount);
    }

    /**
     * Get primary CV (active only)
     */
    public static function getPrimaryCv($applicantProfileId)
    {
        return self::where('applicant_profile_id', $applicantProfileId)
            ->where('is_primary', true)
            ->where('status', 'active')
            ->first();
    }

    /**
     * Set a specific CV as primary (only active CVs)
     */
    public function setAsPrimary()
    {
        self::where('applicant_profile_id', $this->applicant_profile_id)
            ->where('status', 'active')
            ->update(['is_primary' => false]);

        $this->is_primary = true;
        $this->status = 'active'; // ensure active
        $this->save();

        return $this;
    }

    /**
     * Reorder CVs after deletion
     */
    public static function reorderCvs($applicantProfileId)
    {
        $cvs = self::where('applicant_profile_id', $applicantProfileId)
            ->where('status', 'active')
            ->orderBy('order_position')
            ->get();

        foreach ($cvs as $index => $cv) {
            $cv->order_position = $index;
            $cv->save();
        }
    }
}
