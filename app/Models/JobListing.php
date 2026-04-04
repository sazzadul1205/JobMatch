<?php
// app/Models/JobListing.php

namespace App\Models;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class JobListing extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * Fillable fields - add any new job field here
     */
    protected $fillable = [
        'title',
        'slug',
        'description',
        'requirements',
        'job_type',
        'salary_min',
        'salary_max',
        'is_salary_negotiable',
        'as_per_companies_policy',
        'category_id',
        'experience_level',
        'education_requirement',
        'benefits',
        'skills',
        'responsibilities',
        'keywords',
        'application_deadline',
        'publish_at',
        'views_count',
        'external_apply_links',
        'is_external_apply',
        'is_active',
        'user_id',
        'required_facebook_link',
        'required_linkedin_link',
    ];

    /**
     * Cast fields
     */
    protected $casts = [
        'salary_min' => 'decimal:2',
        'salary_max' => 'decimal:2',
        'is_salary_negotiable' => 'boolean',
        'as_per_companies_policy' => 'boolean',
        'benefits' => 'array',
        'skills' => 'array',
        'responsibilities' => 'array',
        'keywords' => 'array',
        'external_apply_links' => 'array',
        'is_external_apply' => 'boolean',
        'is_active' => 'boolean',
        'required_facebook_link' => 'boolean',
        'required_linkedin_link' => 'boolean',
        'application_deadline' => 'date',
        'publish_at' => 'date',
        'views_count' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * Job type options - easy to add more
     */
    public static $jobTypes = ['full-time', 'part-time', 'contract', 'internship', 'remote', 'hybrid'];

    /**
     * Experience level options
     */
    public static $experienceLevels = ['entry', 'junior', 'mid-level', 'senior', 'lead', 'executive'];

    /**
     * Boot method - auto-generate slug
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($job) {
            if (empty($job->slug)) {
                $job->slug = Str::slug($job->title . '-' . uniqid());
            }
        });
    }

    /* ========== RELATIONSHIPS ========== */

    /**
     * Employer relation (who posted this job)
     */
    public function employer()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Category relation
     */
    public function category()
    {
        return $this->belongsTo(JobCategory::class, 'category_id');
    }

    /**
     * Locations relation (many-to-many)
     */
    public function locations()
    {
        return $this->belongsToMany(Location::class, 'job_listing_location')
            ->withTimestamps();
    }

    /**
     * Applications received for this job
     */
    public function applications()
    {
        return $this->hasMany(Application::class);
    }

    /**
     * Views tracking
     */
    public function views()
    {
        return $this->hasMany(JobView::class);
    }

    /* ========== SCOPES ========== */

    /**
     * Scope for active jobs (not expired)
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true)
            ->where('application_deadline', '>=', now());
    }

    /**
     * Scope for published jobs
     */
    public function scopePublished($query)
    {
        return $query->where('publish_at', '<=', now());
    }

    /**
     * Scope by employer
     */
    public function scopeByEmployer($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope by category
     */
    public function scopeByCategory($query, $categoryId)
    {
        return $query->where('category_id', $categoryId);
    }

    /**
     * Scope by job type
     */
    public function scopeByJobType($query, $jobType)
    {
        return $query->where('job_type', $jobType);
    }

    /* ========== HELPER METHODS ========== */

    /**
     * Get formatted salary range
     */
    public function getSalaryRangeAttribute()
    {
        if ($this->as_per_companies_policy) {
            return 'As per company policy';
        }

        if ($this->is_salary_negotiable) {
            return 'Negotiable';
        }

        if ($this->salary_min && $this->salary_max) {
            return number_format($this->salary_min) . ' - ' . number_format($this->salary_max) . ' BDT';
        }

        if ($this->salary_min) {
            return 'From ' . number_format($this->salary_min) . ' BDT';
        }

        return 'Not specified';
    }

    /**
     * Increment view counter
     */
    public function incrementViews()
    {
        $this->increment('views_count');
    }

    /**
     * Check if job is expired
     */
    public function isExpired()
    {
        return $this->application_deadline < now();
    }

    /**
     * Check if application is allowed
     */
    public function canApply()
    {
        return $this->is_active && !$this->isExpired();
    }

    /**
     * Get application count
     */
    public function getApplicationCountAttribute()
    {
        return $this->applications()->count();
    }
}
