<?php
// app/Models/Application.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Services\ATSService;

class Application extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'job_listing_id',
        'user_id',
        'name',
        'email',
        'phone',
        'resume_path',
        'ats_score',
        'matched_keywords',
        'missing_keywords',
        'status',
        'employer_notes',
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
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
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
     * Get the applicant user
     */
    public function applicant()
    {
        return $this->belongsTo(User::class, 'user_id');
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
     * Get ATS score as percentage
     */
    public function getAtsScorePercentage(): ?int
    {
        if (!$this->ats_score) {
            return null;
        }

        return $this->ats_score['total'] ?? null;
    }

    /**
     * Calculate ATS score for this application
     */
    public function calculateATSScore(): void
    {
        $atsService = new ATSService();
        $scoreData = $atsService->calculateScore($this, $this->jobListing);

        $this->update([
            'ats_score' => [
                'total' => $scoreData['total'],
                'percentage' => $scoreData['percentage'],
                'extracted_skills' => $scoreData['extracted_skills'],
                'extracted_experience_years' => $scoreData['extracted_experience_years'],
                'extracted_education' => $scoreData['extracted_education'],
                'analysis_details' => $scoreData['analysis_details']
            ],
            'matched_keywords' => $scoreData['matched_keywords'],
            'missing_keywords' => $scoreData['missing_keywords'],
        ]);
    }

    /**
     * Scope a query to only include applications with specific status
     */
    public function scopeWithStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope a query to only include pending applications
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope a query to only include reviewed applications
     */
    public function scopeReviewed($query)
    {
        return $query->where('status', 'reviewed');
    }

    /**
     * Scope a query to only include shortlisted applications
     */
    public function scopeShortlisted($query)
    {
        return $query->where('status', 'shortlisted');
    }

    /**
     * Scope a query to only include applications for a specific job
     */
    public function scopeForJob($query, $jobListingId)
    {
        return $query->where('job_listing_id', $jobListingId);
    }
}
