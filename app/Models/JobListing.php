<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobListing extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'title',
        'description',
        'requirements',
        'location',
        'salary_range',
        'job_type',
        'category',
        'experience_level',
        'keywords',
        'application_deadline',
        'is_active',
        'user_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected function casts(): array
    {
        return [
            'keywords' => 'array',
            'application_deadline' => 'date',
            'is_active' => 'boolean',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /**
     * Get the employer who posted this job
     */
    public function employer()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get all applications for this job
     */
    public function applications()
    {
        return $this->hasMany(Application::class);
    }

    /**
     * Get active applications (pending and reviewed)
     */
    public function activeApplications()
    {
        return $this->hasMany(Application::class)->whereIn('status', ['pending', 'reviewed', 'shortlisted']);
    }

    /**
     * Check if job is still accepting applications
     */
    public function isAcceptingApplications(): bool
    {
        return $this->is_active && $this->application_deadline->isFuture();
    }

    /**
     * Scope a query to only include active jobs
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true)
            ->where('application_deadline', '>=', now());
    }

    /**
     * Scope a query to filter by job type
     */
    public function scopeOfType($query, $jobType)
    {
        return $query->where('job_type', $jobType);
    }

    /**
     * Scope a query to filter by category
     */
    public function scopeInCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    /**
     * Scope a query to filter by experience level
     */
    public function scopeWithExperience($query, $experienceLevel)
    {
        return $query->where('experience_level', $experienceLevel);
    }

    /**
     * Scope a query to filter by location
     */
    public function scopeInLocation($query, $location)
    {
        return $query->where('location', 'LIKE', "%{$location}%");
    }

    /**
     * Get keywords as array
     */
    public function getKeywordsAttribute($value)
    {
        if (is_string($value)) {
            return json_decode($value, true) ?? [];
        }
        return $value ?? [];
    }

    /**
     * Set keywords as JSON
     */
    public function setKeywordsAttribute($value)
    {
        if (is_array($value)) {
            $this->attributes['keywords'] = json_encode($value);
        } else {
            $this->attributes['keywords'] = $value;
        }
    }
}
