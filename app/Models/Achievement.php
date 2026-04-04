<?php
// app/Models/Achievement.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class Achievement extends Model
{
    use HasFactory, SoftDeletes;

    const MAX_ACHIEVEMENTS_PER_PROFILE = 3;

    /**
     * Fillable fields
     */
    protected $fillable = [
        'applicant_profile_id',
        'achievement_name',
        'achievement_details',
    ];

    /**
     * Cast fields
     */
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /* ========== RELATIONSHIPS ========== */

    public function applicantProfile()
    {
        return $this->belongsTo(ApplicantProfile::class);
    }

    /* ========== VALIDATION METHODS ========== */

    /**
     * Check if user has reached the maximum number of achievements
     */
    public static function hasReachedMaxEntries($applicantProfileId)
    {
        return self::where('applicant_profile_id', $applicantProfileId)
            ->count() >= self::MAX_ACHIEVEMENTS_PER_PROFILE;
    }

    /**
     * Get remaining slots for a profile
     */
    public static function getRemainingSlots($applicantProfileId)
    {
        $currentCount = self::where('applicant_profile_id', $applicantProfileId)->count();
        return max(0, self::MAX_ACHIEVEMENTS_PER_PROFILE - $currentCount);
    }

    /**
     * Get current count for a profile
     */
    public static function getCurrentCount($applicantProfileId)
    {
        return self::where('applicant_profile_id', $applicantProfileId)->count();
    }

    /**
     * Get all achievements for a profile with formatted data
     */
    public static function getFormattedAchievements($applicantProfileId)
    {
        return self::where('applicant_profile_id', $applicantProfileId)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($achievement) {
                return [
                    'id' => $achievement->id,
                    'name' => $achievement->achievement_name,
                    'details' => $achievement->achievement_details,
                    'created_at' => $achievement->created_at->format('Y-m-d'),
                ];
            });
    }

    /**
     * Get achievement statistics for a profile
     */
    public static function getStats($applicantProfileId)
    {
        return [
            'current_count' => self::getCurrentCount($applicantProfileId),
            'max_allowed' => self::MAX_ACHIEVEMENTS_PER_PROFILE,
            'remaining_slots' => self::getRemainingSlots($applicantProfileId),
            'has_achievements' => self::where('applicant_profile_id', $applicantProfileId)->exists(),
        ];
    }

    /* ========== MODEL EVENTS ========== */

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
                    'achievement' => sprintf(
                        'Maximum %d achievements allowed per profile.',
                        self::MAX_ACHIEVEMENTS_PER_PROFILE
                    )
                ]);
            }
        });

        // Optional: Add logging when achievement is created/updated/deleted
        static::created(function ($achievement) {
            Log::info('Achievement created', [
                'profile_id' => $achievement->applicant_profile_id,
                'achievement_id' => $achievement->id,
                'total_count' => self::getCurrentCount($achievement->applicant_profile_id)
            ]);
        });

        static::deleted(function ($achievement) {
            Log::info('Achievement deleted', [
                'profile_id' => $achievement->applicant_profile_id,
                'achievement_id' => $achievement->id,
                'remaining_count' => self::getCurrentCount($achievement->applicant_profile_id)
            ]);
        });
    }

    /* ========== SCOPES ========== */

    /**
     * Scope a query to only include recent achievements
     */
    public function scopeRecent($query, $limit = 5)
    {
        return $query->orderBy('created_at', 'desc')->limit($limit);
    }

    /**
     * Scope a query to search achievements by name or details
     */
    public function scopeSearch($query, $searchTerm)
    {
        return $query->where('achievement_name', 'like', "%{$searchTerm}%")
            ->orWhere('achievement_details', 'like', "%{$searchTerm}%");
    }
}
