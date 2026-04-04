<?php
// app/Models/JobView.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class JobView extends Model
{
    use HasFactory;

    /**
     * Fillable fields
     */
    protected $fillable = [
        'job_listing_id',
        'user_id',
        'ip_address',
    ];

    /**
     * Cast fields
     */
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /* ========== RELATIONSHIPS ========== */

    public function jobListing()
    {
        return $this->belongsTo(JobListing::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /* ========== HELPER METHODS ========== */

    /**
     * Record a new view
     */
    public static function recordView($jobId, $userId = null, $ipAddress = null)
    {
        return static::create([
            'job_listing_id' => $jobId,
            'user_id' => $userId,
            'ip_address' => $ipAddress,
        ]);
    }
}
