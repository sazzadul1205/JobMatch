<?php
// app/Models/Application.php

namespace App\Models;

use App\Services\ATSService;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class Application extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'job_listing_id',
        'user_id',
        'applicant_profile_id',
        'name',
        'email',
        'phone',
        'resume_path',
        'expected_salary',
        'ats_score',
        'matched_keywords',
        'missing_keywords',
        'status',
        'employer_notes',
        'ats_calculation_status',
        'ats_attempt_count',
        'ats_last_attempted_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected function casts(): array
    {
        return [
            'ats_score' => 'array',
            'matched_keywords' => 'array',
            'missing_keywords' => 'array',
            'expected_salary' => 'decimal:2',
            'ats_last_attempted_at' => 'datetime',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
            'deleted_at' => 'datetime',
        ];
    }

    /**
     * Get the job listing for this application
     */
    public function jobListing()
    {
        return $this->belongsTo(JobListing::class);
    }

    /**
     * Get the user who applied
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the applicant profile
     */
    public function applicantProfile()
    {
        return $this->belongsTo(ApplicantProfile::class);
    }

    /**
     * Get applicant name (prioritize stored data, fallback to profile)
     */
    public function getApplicantNameAttribute()
    {
        // If custom name is stored, use it
        if ($this->name) {
            return $this->name;
        }

        // Otherwise get from profile if available
        if ($this->applicantProfile) {
            return $this->applicantProfile->full_name;
        }

        // Finally fallback to user
        if ($this->user) {
            return $this->user->name;
        }

        return 'Unknown';
    }

    /**
     * Get applicant email (prioritize stored data, fallback to profile)
     */
    public function getApplicantEmailAttribute()
    {
        // If custom email is stored, use it
        if ($this->email) {
            return $this->email;
        }

        // Otherwise get from profile if available
        if ($this->applicantProfile) {
            return $this->applicantProfile->email;
        }

        // Finally fallback to user
        if ($this->user) {
            return $this->user->email;
        }

        return 'Unknown';
    }

    /**
     * Get applicant phone (prioritize stored data, fallback to profile)
     */
    public function getApplicantPhoneAttribute()
    {
        // If custom phone is stored, use it
        if ($this->phone) {
            return $this->phone;
        }

        // Otherwise get from profile if available
        if ($this->applicantProfile) {
            return $this->applicantProfile->phone;
        }

        return null;
    }

    /**
     * Get resume URL (prioritize custom uploaded resume, fallback to profile CV)
     */
    public function getResumeUrlAttribute(): ?string
    {
        // Check if custom resume was uploaded for this application
        if ($this->resume_path) {
            return Storage::url('public/' . $this->resume_path);
        }

        // If no custom resume, use profile CV if available
        if ($this->applicantProfile && $this->applicantProfile->cv_path) {
            return Storage::url('public/' . $this->applicantProfile->cv_path);
        }

        return null;
    }

    /**
     * Get resume filename
     */
    public function getResumeFilenameAttribute(): string
    {
        if ($this->resume_path) {
            return basename($this->resume_path);
        }

        if ($this->applicantProfile && $this->applicantProfile->cv_path) {
            return basename($this->applicantProfile->cv_path);
        }

        return 'No resume';
    }

    /**
     * Check if application has custom resume uploaded
     */
    public function hasCustomResume(): bool
    {
        return !empty($this->resume_path);
    }

    /**
     * Check if application has resume (either custom or from profile)
     */
    public function hasResume(): bool
    {
        return $this->hasCustomResume() ||
            ($this->applicantProfile && $this->applicantProfile->hasCV());
    }

    /**
     * Check if application is using profile data (no custom data stored)
     */
    public function isUsingProfileData(): bool
    {
        return empty($this->name) && empty($this->email) && empty($this->phone) && !$this->resume_path;
    }

    /**
     * Get status badge class
     */
    public function getStatusBadgeClass(): string
    {
        return match ($this->status) {
            'pending' => 'bg-yellow-100 text-yellow-800',
            'reviewed' => 'bg-blue-100 text-blue-800',
            'shortlisted' => 'bg-green-100 text-green-800',
            'rejected' => 'bg-red-100 text-red-800',
            'hired' => 'bg-purple-100 text-purple-800',
            default => 'bg-gray-100 text-gray-800',
        };
    }

    /**
     * Get status label
     */
    public function getStatusLabel(): string
    {
        return match ($this->status) {
            'pending' => 'Pending',
            'reviewed' => 'Reviewed',
            'shortlisted' => 'Shortlisted',
            'rejected' => 'Rejected',
            'hired' => 'Hired',
            default => ucfirst($this->status),
        };
    }

    /**
     * Get ATS score as percentage
     */
    public function getAtsScorePercentage(): ?int
    {
        if (!$this->ats_score) {
            return null;
        }

        return $this->ats_score['percentage'] ?? $this->ats_score['total'] ?? null;
    }

    /**
     * Get formatted ATS score
     */
    public function getFormattedAtsScore(): string
    {
        $score = $this->getAtsScorePercentage();
        if ($score === null) {
            return 'N/A';
        }

        return "{$score}%";
    }

    /**
     * Get matched keywords count
     */
    public function getMatchedKeywordsCount(): int
    {
        return is_array($this->matched_keywords) ? count($this->matched_keywords) : 0;
    }

    /**
     * Get missing keywords count
     */
    public function getMissingKeywordsCount(): int
    {
        return is_array($this->missing_keywords) ? count($this->missing_keywords) : 0;
    }

    /**
     * Check if application is pending
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Check if application is reviewed
     */
    public function isReviewed(): bool
    {
        return $this->status === 'reviewed';
    }

    /**
     * Check if application is shortlisted
     */
    public function isShortlisted(): bool
    {
        return $this->status === 'shortlisted';
    }

    /**
     * Check if application is rejected
     */
    public function isRejected(): bool
    {
        return $this->status === 'rejected';
    }

    /**
     * Check if application is hired
     */
    public function isHired(): bool
    {
        return $this->status === 'hired';
    }

    /**
     * Scope a query to only include applications with specific status
     */
    public function scopeWithStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope a query to only include applications for a specific job
     */
    public function scopeForJob($query, $jobListingId)
    {
        return $query->where('job_listing_id', $jobListingId);
    }

    /**
     * Scope a query to only include applications for a specific user
     */
    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope a query to only include applications using profile data
     */
    public function scopeUsingProfileData($query)
    {
        return $query->whereNull('name')
            ->whereNull('email')
            ->whereNull('phone')
            ->whereNull('resume_path');
    }

    /**
     * Scope a query to only include applications with custom data
     */
    public function scopeWithCustomData($query)
    {
        return $query->where(function ($q) {
            $q->whereNotNull('name')
                ->orWhereNotNull('email')
                ->orWhereNotNull('phone')
                ->orWhereNotNull('resume_path');
        });
    }

    /**
     * Get applications with high ATS score
     */
    public function scopeHighScore($query, $minScore = 70)
    {
        return $query->whereRaw('JSON_EXTRACT(ats_score, "$.percentage") >= ?', [$minScore]);
    }

    /**
     * Boot the model
     */
    protected static function boot()
    {
        parent::boot();

        // Auto-populate from profile if no custom data is provided
        static::creating(function ($application) {
            // If no custom name/email/phone are provided, use profile data
            if (empty($application->name) && empty($application->email) && empty($application->phone)) {
                if ($application->applicantProfile) {
                    $profile = $application->applicantProfile;

                    $application->name = $profile->full_name;
                    $application->email = $profile->email;
                    $application->phone = $profile->phone;
                } elseif ($application->user) {
                    $application->name = $application->user->name;
                    $application->email = $application->user->email;
                }
            }

            // Set applicant_profile_id if not set
            if (empty($application->applicant_profile_id) && $application->user && $application->user->applicantProfile) {
                $application->applicant_profile_id = $application->user->applicantProfile->id;
            }
        });
    }

    /**
     * Get the actual resume file path (either custom or from profile)
     */
    public function getActualResumePath(): ?string
    {
        // Check for custom resume first
        if ($this->resume_path) {
            return $this->resume_path;
        }

        // Fall back to profile CV
        if ($this->applicantProfile && $this->applicantProfile->cv_path) {
            return $this->applicantProfile->cv_path;
        }

        return null;
    }

    /**
     * Calculate ATS score inline (without queue)
     */
    public function calculateATSScore(): void
    {
        if (!$this->jobListing) {
            Log::error('Cannot calculate ATS score: Job listing not loaded', [
                'application_id' => $this->id
            ]);
            return;
        }

        $atsService = app(ATSService::class);
        $result = $atsService->calculateScore($this, $this->jobListing);

        $this->update([
            'ats_score' => $result,
            'matched_keywords' => $result['matched_keywords'] ?? [],
            'missing_keywords' => $result['missing_keywords'] ?? [],
            'ats_calculation_status' => 'completed',
            'ats_attempt_count' => 1,
            'ats_last_attempted_at' => now(),
        ]);
    }

    /**
     * Recalculate ATS score (inline)
     * Use this for immediate recalculation when a calculation is stuck
     *
     * @return bool True if successful, false otherwise
     */
    public function recalculateAtsScoreInline(): bool
    {
        try {
            $this->load('jobListing');
            
            if (!$this->jobListing) {
                Log::error('Cannot recalculate ATS score: Job listing not found', [
                    'application_id' => $this->id
                ]);
                return false;
            }

            $atsService = app(ATSService::class);
            $result = $atsService->calculateScore($this, $this->jobListing);

            $this->update([
                'ats_score' => $result,
                'matched_keywords' => $result['matched_keywords'] ?? [],
                'missing_keywords' => $result['missing_keywords'] ?? [],
                'ats_calculation_status' => 'completed',
                'ats_attempt_count' => 0,
                'ats_last_attempted_at' => now(),
            ]);

            Log::info('ATS score recalculated successfully (inline)', [
                'application_id' => $this->id,
                'percentage' => $result['percentage'] ?? 0
            ]);

            return true;
        } catch (\Throwable $e) {
            Log::error('Inline ATS recalculation failed: ' . $e->getMessage(), [
                'application_id' => $this->id,
                'trace' => $e->getTraceAsString()
            ]);

            $this->update([
                'ats_calculation_status' => 'failed',
                'ats_last_attempted_at' => now(),
            ]);

            return false;
        }
    }

    /**
     * Recalculate ATS score using queue
     * Use this for asynchronous recalculation
     */
    public function recalculateAtsScoreQueued(): void
    {
        $this->update([
            'ats_calculation_status' => 'pending',
            'ats_attempt_count' => 0,
        ]);

        \App\Jobs\CalculateAtsScore::dispatch($this->id);

        Log::info('ATS score queued for recalculation', [
            'application_id' => $this->id
        ]);
    }

    /**
     * Check if ATS calculation status is pending/processing
     */
    public function isAtsCalculationPending(): bool
    {
        return in_array($this->ats_calculation_status, ['pending', 'processing']);
    }

    /**
     * Check if ATS calculation is stuck (pending for too long)
     * Stuck if pending/processing for more than 30 minutes
     */
    public function isAtsCalculationStuck(): bool
    {
        if (!$this->isAtsCalculationPending()) {
            return false;
        }

        if (!$this->ats_last_attempted_at) {
            // If created more than 30 minutes ago - it's stuck
            return $this->created_at->diffInMinutes(now()) > 30;
        }

        // If last attempted more than 30 minutes ago - it's stuck
        return $this->ats_last_attempted_at->diffInMinutes(now()) > 30;
    }

    /**
     * Get ATS calculation status label
     */
    public function getAtsCalculationStatusLabel(): string
    {
        return match ($this->ats_calculation_status) {
            'pending' => 'Pending',
            'processing' => 'Calculating...',
            'completed' => 'Completed',
            'failed' => 'Failed',
            default => 'Unknown',
        };
    }

    /**
     * Check if can retry ATS calculation
     */
    public function canRetryAtsCalculation(): bool
    {
        return $this->ats_calculation_status === 'failed' || $this->isAtsCalculationStuck();
    }
}

