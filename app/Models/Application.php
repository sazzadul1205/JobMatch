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
     * Get the actual resume path for ATS parsing
     */
    public function getActualResumePath(): ?string
    {
        if (!empty($this->resume_path)) {
            return $this->resume_path;
        }

        $profile = $this->relationLoaded('applicantProfile')
            ? $this->applicantProfile
            : $this->applicantProfile()->with('primaryCv')->first();

        if ($profile && $profile->primaryCv) {
            return $profile->primaryCv->cv_path;
        }

        return null;
    }

    /**
     * Check if ATS calculation is completed
     */
    public function isAtsCompleted()
    {
        return $this->ats_calculation_status === self::ATS_COMPLETED;
    }

    /**
     * Check if ATS calculation is stuck (no update for a while)
     */
    public function isAtsCalculationStuck(int $minutes = 30): bool
    {
        if (!in_array($this->ats_calculation_status, [self::ATS_PENDING, self::ATS_PROCESSING])) {
            return false;
        }

        $cutoff = now()->subMinutes($minutes);

        if ($this->ats_last_attempted_at) {
            return $this->ats_last_attempted_at < $cutoff;
        }

        return $this->created_at < $cutoff;
    }

    /**
     * Calculate ATS score inline using ATSService
     */
    public function calculateATSScore(): bool
    {
        try {
            /** @var \App\Services\ATSService $atsService */
            $atsService = app(\App\Services\ATSService::class);

            $this->loadMissing('jobListing', 'applicantProfile');

            if (!$this->jobListing) {
                throw new \Exception('Job listing not found for ATS calculation');
            }

            $this->update([
                'ats_calculation_status' => self::ATS_PROCESSING,
            ]);

            $result = $atsService->calculateScore($this, $this->jobListing);

            $this->update([
                'ats_score' => $result,
                'matched_keywords' => $result['matched_keywords'] ?? [],
                'missing_keywords' => $result['missing_keywords'] ?? [],
                'ats_calculation_status' => self::ATS_COMPLETED,
                'ats_last_attempted_at' => now(),
                'ats_attempt_count' => ($this->ats_attempt_count ?? 0) + 1,
            ]);

            return true;
        } catch (\Throwable $e) {
            $this->update([
                'ats_calculation_status' => self::ATS_FAILED,
                'ats_score' => [
                    'percentage' => 0,
                    'error' => $e->getMessage(),
                    'status' => 'failed',
                    'analysis' => [
                        'level' => 'Error',
                        'message' => 'We are having trouble calculating the ATS score. Please try again later.',
                        'color' => 'red',
                        'matched_count' => 0,
                        'missing_count' => 0,
                        'top_matched' => [],
                        'top_missing' => [],
                        'suggestions' => [
                            'Please try uploading a different resume format (PDF, DOC, or DOCX).'
                        ]
                    ]
                ],
                'ats_last_attempted_at' => now(),
                'ats_attempt_count' => ($this->ats_attempt_count ?? 0) + 1,
            ]);

            return false;
        }
    }

    /**
     * Recalculate ATS score inline
     */
    public function recalculateAtsScoreInline(): bool
    {
        $this->update([
            'ats_calculation_status' => self::ATS_PENDING,
            'ats_score' => null,
            'matched_keywords' => null,
            'missing_keywords' => null,
            'ats_attempt_count' => 0,
        ]);

        return $this->calculateATSScore();
    }

    /**
     * Check if application can be updated
     */
    public function canBeUpdated()
    {
        return !in_array($this->status, [self::STATUS_HIRED, self::STATUS_REJECTED]);
    }

    /**
     * Get resume URL
     */
    public function getResumeUrlAttribute()
    {
        return $this->resume_path ? asset('storage/' . $this->resume_path) : null;
    }
}
