<?php
// app/Models/Achievement.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Achievement extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * Fillable fields
     */
    protected $fillable = [
        'applicant_profile_id',
        'achievement_name',
        'achievement_details',
    ];

    /**
     * Cast fields
     */
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /* ========== RELATIONSHIPS ========== */

    public function applicantProfile()
    {
        return $this->belongsTo(ApplicantProfile::class);
    }
}
