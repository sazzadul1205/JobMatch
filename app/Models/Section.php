<?php
// app/Models/Section.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Section extends Model
{
  protected $table = 'sections';

  protected $fillable = [
    'name',
    'component',
    'description',
    'preview_image',
    'default_props',
    'is_active',
  ];

  protected $casts = [
    'default_props' => 'array',
    'is_active' => 'boolean',
  ];

  /**
   * Get the page sections that use this section
   */
  public function pageSections(): HasMany
  {
    return $this->hasMany(PageSection::class);
  }

  /**
   * Scope a query to only include active sections
   */
  public function scopeActive(Builder $query)
  {
    return $query->where('is_active', true);
  }

  /**
   * Scope a query to only include sections by component
   */
  public function scopeByComponent(Builder $query, string $component)
  {
    return $query->where('component', $component);
  }
}
