<?php
// app/Models/PageSection.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PageSection extends Model
{
  protected $table = 'page_sections';

  protected $fillable = [
    'page_id',
    'section_id',
    'section_key',
    'order',
    'is_enabled',
    'is_special_component',
    'prop_name',
    'data',
    'custom_props',
  ];

  protected $casts = [
    'data' => 'array',
    'custom_props' => 'array',
    'is_enabled' => 'boolean',
    'is_special_component' => 'boolean',
  ];

  /**
   * Get the page that owns this section
   */
  public function page(): BelongsTo
  {
    return $this->belongsTo(Page::class);
  }

  /**
   * Get the section definition
   */
  public function section(): BelongsTo
  {
    return $this->belongsTo(Section::class);
  }

  /**
   * Scope a query to only include enabled sections
   */
  public function scopeEnabled(Builder $query)
  {
    return $query->where('is_enabled', true);
  }

  /**
   * Scope a query to order by the order field
   */
  public function scopeOrdered(Builder $query)
  {
    return $query->orderBy('order', 'asc');
  }

  /**
   * Scope a query to only include regular sections (not special components)
   */
  public function scopeRegular(Builder $query)
  {
    return $query->where('is_special_component', false);
  }

  /**
   * Scope a query to only include special components
   */
  public function scopeSpecial(Builder $query)
  {
    return $query->where('is_special_component', true);
  }

  /**
   * Scope a query by section key
   */
  public function scopeByKey(Builder $query, string $key)
  {
    return $query->where('section_key', $key);
  }

  /**
   * Check if this section has a prop name (single prop component)
   */
  public function hasPropName(): bool
  {
    return !is_null($this->prop_name);
  }

  /**
   * Check if this is a multi-prop component (no prop_name)
   */
  public function isMultiProp(): bool
  {
    return is_null($this->prop_name) && !$this->is_special_component;
  }

  /**
   * Get the data as an array (with asset path conversion handled by controller)
   */
  public function getDataArray(): array
  {
    return is_string($this->data) ? json_decode($this->data, true) : $this->data;
  }

  /**
   * Get custom props as array
   */
  public function getCustomPropsArray(): array
  {
    return is_string($this->custom_props) ? json_decode($this->custom_props, true) : $this->custom_props;
  }

  /**
   * Set data from array
   */
  public function setDataArray(array $data): self
  {
    $this->data = json_encode($data);
    return $this;
  }

  /**
   * Set custom props from array
   */
  public function setCustomPropsArray(array $props): self
  {
    $this->custom_props = json_encode($props);
    return $this;
  }
}
