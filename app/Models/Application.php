<?php
// app/Models/Application.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Application extends Model
{
    protected $fillable = [
        'job_id',
        'user_id',
        'name',
        'email',
        'phone',
        'resume_path',
        'ats_score',
        'matched_keywords',
        'missing_keywords',
        'status',
        'employer_notes'
    ];

    protected $casts = [
        'ats_score' => 'array',
        'matched_keywords' => 'array',
        'missing_keywords' => 'array',
    ];

    public function job(): BelongsTo
    {
        return $this->belongsTo(Job::class);
    }

    public function applicant(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function scopeShortlisted($query)
    {
        return $query->where('status', 'shortlisted');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeByScore($query)
    {
        return $query->orderByRaw('CAST(JSON_EXTRACT(ats_score, "$.percentage") AS UNSIGNED) DESC');
    }
}
