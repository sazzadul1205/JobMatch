<?php
// app/Models/ApplicantProfile.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ApplicantProfile extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * Fillable fields - add any field from migration here
     */
    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'birth_date',
        'gender',
        'blood_type',
        'phone',
        'address',
        'photo_path',
        'social_links',
        'headline',
        'summary',
        'experience_years',
        'current_job_title',
    ];

    /**
     * Cast fields - JSON fields, dates, etc.
     */
    protected $casts = [
        'birth_date' => 'date',
        'social_links' => 'array',      // Will be JSON in DB
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * Appended attributes (virtual fields)
     */
    protected $appends = ['full_name'];

    /**
     * Blood type options - easy to modify
     */
    public static $bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

    /* ========== RELATIONSHIPS ========== */

    /**
     * User relation - inverse
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Applications relation
     */
    public function applications()
    {
        return $this->hasMany(Application::class);
    }

    /**
     * CVs/Resumes relation
     */
    public function cvs()
    {
        return $this->hasMany(ApplicantCv::class)->orderBy('order_position');
    }

    /**
     * Primary CV relation (for quick access)
     */
    public function primaryCv()
    {
        return $this->hasOne(ApplicantCv::class)->where('is_primary', true);
    }

    /**
     * Work history relation
     */
    public function jobHistories()
    {
        return $this->hasMany(JobHistory::class)->orderBy('starting_year', 'desc');
    }

    /**
     * Current job relation
     */
    public function currentJob()
    {
        return $this->hasOne(JobHistory::class)->where('is_current', true);
    }

    /**
     * Education history relation
     */
    public function educationHistories()
    {
        return $this->hasMany(EducationHistory::class)->orderBy('passing_year', 'desc');
    }

    /**
     * Achievements/Certifications relation
     */
    public function achievements()
    {
        return $this->hasMany(Achievement::class);
    }

    /* ========== ACCESSORS ========== */

    /**
     * Get full name attribute
     */
    public function getFullNameAttribute()
    {
        return $this->first_name . ' ' . $this->last_name;
    }

    /* ========== SCOPES ========== */

    /**
     * Scope for completed profiles
     */
    public function scopeComplete($query)
    {
        return $query->whereNotNull('phone')
            ->whereNotNull('headline');
    }

    /* ========== HELPER METHODS ========== */

    /**
     * Check if profile is complete
     */
    public function isComplete()
    {
        return !empty($this->phone) && !empty($this->headline);
    }

    /**
     * Get profile completion percentage
     */
    public function completionPercentage()
    {
        $fields = ['first_name', 'last_name', 'phone', 'headline', 'summary', 'experience_years'];
        $filled = 0;

        foreach ($fields as $field) {
            if (!empty($this->$field)) {
                $filled++;
            }
        }

        return round(($filled / count($fields)) * 100);
    }
}
