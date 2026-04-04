<?php
// app/Models/JobCategory.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class JobCategory extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * Fillable fields
     */
    protected $fillable = [
        'name',
        'slug',
        'is_active',
    ];

    /**
     * Cast fields
     */
    protected $casts = [
        'is_active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /* ========== RELATIONSHIPS ========== */

    /**
     * Job listings in this category
     */
    public function jobListings()
    {
        return $this->hasMany(JobListing::class, 'category_id');
    }

    /**
     * Active job listings only
     */
    public function activeJobListings()
    {
        return $this->jobListings()->active();
    }

    /* ========== SCOPES ========== */

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /* ========== HELPER METHODS ========== */

    /**
     * Get job count in this category
     */
    public function getJobCountAttribute()
    {
        return $this->jobListings()->active()->count();
    }
}
