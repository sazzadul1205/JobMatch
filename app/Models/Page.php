<?php
// app/Models/Page.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Page extends Model
{
  protected $table = 'pages';

  protected $fillable = [
    'parent_id',
    'slug',
    'name',
    'title',
    'description',
    'keywords',
    'og_image',
    'template',
    'page_type',
    'is_published',
    'published_at',
    'created_by',
  ];

  protected $casts = [
    'is_published' => 'boolean',
    'published_at' => 'datetime',
  ];

  /**
   * Get the parent page (for sub-pages)
   */
  public function parent(): BelongsTo
  {
    return $this->belongsTo(Page::class, 'parent_id');
  }

  /**
   * Get the child pages (sub-pages)
   */
  public function children(): HasMany
  {
    return $this->hasMany(Page::class, 'parent_id')->orderBy('order', 'asc');
  }

  /**
   * Get the page sections for this page
   */
  public function pageSections(): HasMany
  {
    return $this->hasMany(PageSection::class)->orderBy('order');
  }

  /**
   * Get the user who created this page
   */
  public function creator()
  {
    return $this->belongsTo(User::class, 'created_by');
  }

  /**
   * Scope a query to only include published pages
   */
  public function scopePublished(Builder $query)
  {
    return $query->where('is_published', true);
  }

  /**
   * Scope a query to only include top-level pages (no parent)
   */
  public function scopeTopLevel(Builder $query)
  {
    return $query->whereNull('parent_id');
  }

  /**
   * Scope a query by page type
   */
  public function scopeOfType(Builder $query, string $type)
  {
    return $query->where('page_type', $type);
  }

  /**
   * Scope a query by slug
   */
  public function scopeBySlug(Builder $query, string $slug)
  {
    return $query->where('slug', $slug);
  }

  /**
   * Get the full slug path (e.g., "about/vision-mission")
   */
  public function getFullSlugAttribute(): string
  {
    if ($this->parent) {
      return $this->parent->full_slug . '/' . $this->slug;
    }
    return $this->slug;
  }

  /**
   * Check if this is a sub-page
   */
  public function isSubPage(): bool
  {
    return !is_null($this->parent_id);
  }

  /**
   * Get meta value by key
   */
  public function getMeta(string $key): ?string
  {
    // You can add a page_meta table later
    return null;
  }
}
