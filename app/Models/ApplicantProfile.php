<?php
// app/Models/ApplicantProfile.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ApplicantProfile extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'birth_date',
        'email',
        'phone',
        'photo_path',
        'cv_path',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected function casts(): array
    {
        return [
            'birth_date' => 'date',
            'deleted_at' => 'datetime',
        ];
    }

    /**
     * Get the user associated with this profile
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the full name of the applicant
     */
    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }

    /**
     * Get the applications submitted by this applicant
     */
    public function applications()
    {
        return $this->hasMany(Application::class, 'user_id', 'user_id');
    }

    /**
     * Scope a query to only include active profiles
     */
    public function scopeActive($query)
    {
        return $query->whereNull('deleted_at');
    }

    /**
     * Check if profile has CV uploaded
     */
    public function hasCV(): bool
    {
        return !empty($this->cv_path);
    }

    /**
     * Check if profile has photo uploaded
     */
    public function hasPhoto(): bool
    {
        return !empty($this->photo_path);
    }

    /**
     * Get CV URL
     */
    public function getCvUrlAttribute(): ?string
    {
        if ($this->cv_path) {
            return asset('storage/' . $this->cv_path);
        }
        return null;
    }

    /**
     * Get photo URL
     */
    public function getPhotoUrlAttribute(): ?string
    {
        if ($this->photo_path) {
            return asset('storage/' . $this->photo_path);
        }
        return null;
    }

    /**
     * Get age of applicant
     */
    public function getAgeAttribute(): ?int
    {
        if ($this->birth_date) {
            return $this->birth_date->age;
        }
        return null;
    }

    /**
     * Boot the model
     */
    protected static function boot()
    {
        parent::boot();

        // Auto sync email with user model when creating
        static::creating(function ($profile) {
            if (empty($profile->email) && $profile->user) {
                $profile->email = $profile->user->email;
            }
        });

        // Auto sync email with user model when updating
        static::updating(function ($profile) {
            if ($profile->isDirty('email') && $profile->user) {
                $profile->user->update(['email' => $profile->email]);
            }
        });
    }
}
