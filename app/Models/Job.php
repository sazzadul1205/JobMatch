<?php
// app/Models/Job.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Job extends Model
{
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
        'user_id'
    ];

    protected $casts = [
        'keywords' => 'array',
        'application_deadline' => 'date',
        'is_active' => 'boolean',
    ];

    public function applications(): HasMany
    {
        return $this->hasMany(Application::class);
    }

    public function employer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true)
            ->where('application_deadline', '>=', now());
    }

    public function scopeFilter($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $query->where('title', 'like', '%' . $search . '%')
                ->orWhere('description', 'like', '%' . $search . '%')
                ->orWhere('location', 'like', '%' . $search . '%');
        });

        $query->when($filters['job_type'] ?? null, function ($query, $type) {
            $query->where('job_type', $type);
        });

        $query->when($filters['category'] ?? null, function ($query, $category) {
            $query->where('category', $category);
        });

        $query->when($filters['experience_level'] ?? null, function ($query, $level) {
            $query->where('experience_level', $level);
        });

        $query->when($filters['location'] ?? null, function ($query, $location) {
            $query->where('location', 'like', '%' . $location . '%');
        });
    }
}
