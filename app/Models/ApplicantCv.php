<?php
// app/Models/ApplicantCv.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ApplicantCv extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * Fillable fields
     */
    protected $fillable = [
        'applicant_profile_id',
        'cv_path',
        'original_name',
        'order_position',
        'is_primary',
    ];

    /**
     * Cast fields
     */
    protected $casts = [
        'is_primary' => 'boolean',
        'order_position' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * Boot method - handle primary CV logic
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($cv) {
            if ($cv->is_primary) {
                static::where('applicant_profile_id', $cv->applicant_profile_id)
                    ->update(['is_primary' => false]);
            }
        });

        static::updating(function ($cv) {
            if ($cv->is_primary && $cv->getOriginal('is_primary') !== true) {
                static::where('applicant_profile_id', $cv->applicant_profile_id)
                    ->where('id', '!=', $cv->id)
                    ->update(['is_primary' => false]);
            }
        });
    }

    /* ========== RELATIONSHIPS ========== */

    public function applicantProfile()
    {
        return $this->belongsTo(ApplicantProfile::class);
    }

    /* ========== HELPER METHODS ========== */

    /**
     * Get full URL for CV
     */
    public function getUrlAttribute()
    {
        return asset('storage/' . $this->cv_path);
    }
}
