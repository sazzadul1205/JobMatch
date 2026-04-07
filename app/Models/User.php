<?php
// app/Models/User.php

namespace App\Models;

use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use HasFactory, Notifiable, SoftDeletes;

    /**
     * Table name (optional - Laravel will use 'users' by default)
     * protected $table = 'users';
     */

    /**
     * Fillable fields - add any new field here to allow mass assignment
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'old_password',
        'google_id',
        'google_avatar',
        'role',
        'email_verified_at',
    ];

    /**
     * Hidden fields for serialization
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Cast fields to native types
     * Add new cast fields here when needed
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * Role constants - easy to add more roles
     */
    const ROLE_ADMIN = 'admin';
    const ROLE_EMPLOYER = 'employer';
    const ROLE_JOB_SEEKER = 'job_seeker';

    // All roles in one place for easy access
    public static $roles = [
        self::ROLE_ADMIN,
        self::ROLE_EMPLOYER,
        self::ROLE_JOB_SEEKER,
    ];

    /* ========== RELATIONSHIPS ========== */

    /**
     * Applicant profile relation (for job seekers)
     * One user has one applicant profile
     */
    public function applicantProfile()
    {
        return $this->hasOne(ApplicantProfile::class);
    }

    /**
     * Job listings relation (for employers)
     * One user (employer) can have many job listings
     */
    public function jobListings()
    {
        return $this->hasMany(JobListing::class);
    }

    /**
     * Applications relation
     * One user can have many job applications
     */
    public function applications()
    {
        return $this->hasMany(Application::class);
    }

    /**
     * Job views relation
     * Track which jobs this user viewed
     */
    public function jobViews()
    {
        return $this->hasMany(JobView::class);
    }

    /* ========== HELPER METHODS ========== */

    /**
     * Check if user is admin
     */
    public function isAdmin()
    {
        return $this->role === self::ROLE_ADMIN;
    }

    /**
     * Check if user is employer
     */
    public function isEmployer()
    {
        return $this->role === self::ROLE_EMPLOYER;
    }

    /**
     * Check if user is job seeker
     */
    public function isJobSeeker()
    {
        return $this->role === self::ROLE_JOB_SEEKER;
    }

    /**
     * Check if user has a specific role
     * Usage: $user->hasRole('admin')
     */
    public function hasRole($role)
    {
        return $this->role === $role;
    }

    /**
     * Update user role (with validation)
     */
    public function updateRole($role)
    {
        if (in_array($role, self::$roles)) {
            $this->update(['role' => $role]);
            return true;
        }
        return false;
    }
    
}
