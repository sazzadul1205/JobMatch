<?php
// app/Models/StatusTimeline.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class StatusTimeline extends Model
{
    use HasFactory;

    /**
     * Fillable fields
     */
    protected $fillable = [
        'application_id',
        'status',
        'notes',
    ];

    /**
     * Cast fields
     */
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /* ========== RELATIONSHIPS ========== */

    public function application()
    {
        return $this->belongsTo(Application::class);
    }
}
