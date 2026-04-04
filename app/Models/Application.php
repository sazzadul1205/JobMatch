<?php
// app/Models/Application.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Application extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * Fillable fields
     */
    protected $fillable = [
        'user_id',
        'job_listing_id',
        'applicant_profile_id',
        'name',
        'email',
        'phone',
        'education_level',
        'years_of_experience',
        'resume_path',
        'expected_salary',
        'ats_score',
        'matched_keywords',
        'missing_keywords',
        'ats_last_attempted_at',
        'ats_attempt_count',
        'ats_calculation_status',
        'status',
        'employer_notes',
        'facebook_link',
        'linkedin_link',
    ];

    /**
     * Cast fields
     */
    protected $casts = [
        'expected_salary' => 'decimal:2',
        'ats_score' => 'array',
        'matched_keywords' => 'array',
        'missing_keywords' => 'array',
        'ats_last_attempted_at' => 'datetime',
        'ats_attempt_count' => 'integer',
        'years_of_experience' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * Status constants
     */
    const STATUS_PENDING = 'pending';
    const STATUS_SHORTLISTED = 'shortlisted';
    const STATUS_REJECTED = 'rejected';
    const STATUS_HIRED = 'hired';

    public static $statuses = [
        self::STATUS_PENDING,
        self::STATUS_SHORTLISTED,
        self::STATUS_REJECTED,
        self::STATUS_HIRED,
    ];

    /**
     * ATS calculation status
     */
    const ATS_PENDING = 'pending';
    const ATS_PROCESSING = 'processing';
    const ATS_COMPLETED = 'completed';
    const ATS_FAILED = 'failed';

    public static $atsStatuses = [
        self::ATS_PENDING,
        self::ATS_PROCESSING,
        self::ATS_COMPLETED,
        self::ATS_FAILED,
    ];

    /* ========== RELATIONSHIPS ========== */

    /**
     * Applicant (user) relation
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Job listing relation
     */
    public function jobListing()
    {
        return $this->belongsTo(JobListing::class);
    }

    /**
     * Applicant profile relation
     */
    public function applicantProfile()
    {
        return $this->belongsTo(ApplicantProfile::class);
    }

    /**
     * Status timeline relation
     */
    public function statusTimelines()
    {
        return $this->hasMany(StatusTimeline::class)->orderBy('created_at');
    }

    /* ========== SCOPES ========== */

    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    public function scopeShortlisted($query)
    {
        return $query->where('status', self::STATUS_SHORTLISTED);
    }

    public function scopeRejected($query)
    {
        return $query->where('status', self::STATUS_REJECTED);
    }

    public function scopeHired($query)
    {
        return $query->where('status', self::STATUS_HIRED);
    }

    public function scopeByJob($query, $jobId)
    {
        return $query->where('job_listing_id', $jobId);
    }

    public function scopeByEmployer($query, $employerId)
    {
        return $query->whereHas('jobListing', function ($q) use ($employerId) {
            $q->where('user_id', $employerId);
        });
    }

    /* ========== HELPER METHODS ========== */

    /**
     * Update application status with timeline tracking
     */
    public function updateStatus($newStatus, $notes = null)
    {
        $oldStatus = $this->status;

        $this->update([
            'status' => $newStatus,
            'employer_notes' => $notes
        ]);

        // Log to timeline
        $this->statusTimelines()->create([
            'status' => $newStatus,
            'notes' => $notes,
        ]);

        return true;
    }

    /**
     * Get ATS score percentage
     */
    public function getAtsScorePercentageAttribute()
    {
        if (!$this->ats_score || !isset($this->ats_score['percentage'])) {
            return null;
        }

        return $this->ats_score['percentage'];
    }

    /**
     * Check if ATS calculation is completed
     */
    public function isAtsCompleted()
    {
        return $this->ats_calculation_status === self::ATS_COMPLETED;
    }

    /**
     * Check if application can be updated
     */
    public function canBeUpdated()
    {
        return !in_array($this->status, [self::STATUS_HIRED, self::STATUS_REJECTED]);
    }
}
