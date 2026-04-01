<?php
// app/Models/JobListing.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class JobListing extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'requirements',
        'location_id',
        'salary',
        'job_type',
        'category_id',
        'experience_level',
        'education_requirement',
        'benefits',
        'skills',
        'responsibilities',
        'keywords',
        'application_deadline',
        'schedule_start_date',
        'is_active',
        'user_id',
        'show_linkedin',
        'show_facebook',
    ];

    protected $casts = [
        'benefits' => 'array',
        'skills' => 'array',
        'responsibilities' => 'array',
        'keywords' => 'array',
        'application_deadline' => 'date',
        'schedule_start_date' => 'date',
        'is_active' => 'boolean',
        'show_linkedin' => 'boolean',
        'show_facebook' => 'boolean',
    ];

    /**
     * Boot the model
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($jobListing) {
            if (empty($jobListing->slug)) {
                $jobListing->slug = Str::slug($jobListing->title);
            }
        });

        static::updating(function ($jobListing) {
            if ($jobListing->isDirty('title')) {
                $jobListing->slug = Str::slug($jobListing->title);
            }
        });
    }

    // Relationships
    public function location()
    {
        return $this->belongsTo(Location::class);
    }

    public function category()
    {
        return $this->belongsTo(JobCategory::class, 'category_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function applications()
    {
        return $this->hasMany(Application::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true)
            ->where('application_deadline', '>=', now());
    }

    public function scopeByType($query, $type)
    {
        return $query->where('job_type', $type);
    }

    public function scopeByCategory($query, $categoryId)
    {
        return $query->where('category_id', $categoryId);
    }

    public function scopeByLocation($query, $locationId)
    {
        return $query->where('location_id', $locationId);
    }
}
