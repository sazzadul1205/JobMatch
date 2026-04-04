<?php
// app/Models/EducationHistory.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class EducationHistory extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * Fillable fields
     */
    protected $fillable = [
        'applicant_profile_id',
        'institution_name',
        'degree',
        'passing_year',
    ];

    /**
     * Cast fields
     */
    protected $casts = [
        'passing_year' => 'integer',
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
