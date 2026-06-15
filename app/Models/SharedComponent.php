<?php
// app/Models/SharedComponent.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class SharedComponent extends Model
{
  protected $table = 'shared_components';

  protected $fillable = [
    'component_key',
    'name',
    'description',
    'data',
    'is_active',
  ];

  protected $casts = [
    'data' => 'array',
    'is_active' => 'boolean',
  ];

  public function scopeActive(Builder $query): Builder
  {
    return $query->where('is_active', true);
  }

  public function scopeByKey(Builder $query, string $key): Builder
  {
    return $query->where('component_key', $key);
  }

  public function getDataAttribute(mixed $value): array|null
  {
    return is_string($value)
      ? json_decode($value, true)
      : $value;
  }

  public function setDataAttribute(mixed $value): void
  {
    $this->attributes['data'] = is_string($value)
      ? $value
      : json_encode($value);
  }
}
