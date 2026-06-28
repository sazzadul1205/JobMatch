<?php
// app/Http/Controllers/Cms/SectionController.php

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Models\pages\Page;
use App\Models\pages\SectionConfig;
use App\Models\pages\CustomSectionData;
use App\Models\pages\SharedData;
use App\Models\pages\Blog;
use App\Models\pages\Program;
use App\Models\pages\AboutContent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Illuminate\Support\Str;

class SectionController extends Controller
{
  /**
   * Extract clean data from CustomSectionData model
   */
  protected function extractCustomSectionData(?CustomSectionData $customData): mixed
  {
    if (!$customData) {
      return null;
    }

    $rawData = $customData->data;

    if (is_string($rawData)) {
      $decodedData = json_decode($rawData, true);
      if ($decodedData !== null) {
        // Extract nested 'data' if exists, otherwise use the decoded data
        return $decodedData['data'] ?? $decodedData;
      }
      return $rawData;
    }

    return $rawData;
  }

  /**
   * Extract clean data from SharedData model
   */
  protected function extractSharedData(?SharedData $shared): mixed
  {
    if (!$shared) {
      return null;
    }

    $rawData = $shared->data ?? $shared;

    if (is_string($rawData)) {
      $decodedData = json_decode($rawData, true);
      if ($decodedData !== null) {
        return $decodedData['data'] ?? $decodedData;
      }
      return $rawData;
    }

    return $rawData;
  }

  /**
   * Display a listing of sections for a specific page.
   */
  public function index(int $pageId)
  {
    $page = Page::withTrashed()->findOrFail($pageId);

    $sectionConfigs = SectionConfig::where('page_slug', $page->slug)
      ->orderBy('display_order')
      ->get();

    $customSectionData = CustomSectionData::where('page_slug', $page->slug)
      ->get()
      ->keyBy('section_key');

    $sharedData = SharedData::whereIn('type', $sectionConfigs->pluck('section_key'))
      ->get()
      ->keyBy('type');

    $sections = [];

    foreach ($sectionConfigs as $config) {
      $section = $config->toArray();

      switch ($config->data_table) {
        case 'custom_section_data':
          $section['data'] = $this->extractCustomSectionData(
            $customSectionData->get($config->section_key)
          );
          break;

        case 'shared_data':
          $section['data'] = $this->extractSharedData(
            $sharedData->get($config->section_key)
          );
          break;

        case 'blogs':
          $section['data'] = Blog::active()->latest()->get();
          break;

        case 'programs':
          $section['data'] = Program::active()->ordered()->get();
          break;

        case 'about_content':
          $aboutContent = AboutContent::where('slug', $config->section_key)
            ->active()
            ->first();
          $section['data'] = $aboutContent ? $aboutContent->data : null;
          break;

        default:
          $section['data'] = null;
          break;
      }

      $sections[] = $section;
    }

    // Remove the dd() and return the data
    return Inertia::render('Backend/CMS/Section/Index', [
      'page' => $page,
      'sections' => $sections,
    ]);
  }

  /**
   * Update display order for multiple sections (drag & drop)
   */
  public function updateOrder(Request $request, int $pageId)
  {
    $page = Page::findOrFail($pageId);

    $validator = Validator::make($request->all(), [
      'orders' => 'required|array',
      'orders.*.id' => 'required|integer|exists:section_configs,id',
      'orders.*.display_order' => 'required|integer|min:0',
    ]);

    if ($validator->fails()) {
      // Return back with errors for Inertia
      return back()->withErrors($validator)->withInput();
    }

    try {
      DB::beginTransaction();

      foreach ($request->orders as $orderData) {
        $section = SectionConfig::where('id', $orderData['id'])
          ->where('page_slug', $page->slug)
          ->first();

        // Only update if section exists and is not fixed
        if ($section && !$section->is_fixed_section) {
          $section->update([
            'display_order' => $orderData['display_order']
          ]);
        }
      }

      DB::commit();

      // Return back with success message for Inertia
      return back()->with('success', 'Section order updated successfully.');
    } catch (\Exception $e) {
      DB::rollBack();

      // Return back with error message for Inertia
      return back()->with('error', 'Failed to update section order: ' . $e->getMessage());
    }
  }

  /**
   * Show the form for creating a new section.
   */
  public function create()
  {
    // Not implemented
  }

  /**
   * Store a newly created section in storage.
   */
  public function store(Request $request)
  {
    // Not implemented
  }

  /**
   * Display the specified section.
   */
  public function show($id)
  {
    // Not implemented
  }

  /**
   * Update the specified section in storage.
   */
  public function update(Request $request, int $id)
  {
    // Find the section config
    $sectionConfig = SectionConfig::withTrashed()->findOrFail($id);

    // Validate request
    $validator = Validator::make($request->all(), [
      'section_key' => 'required|string|max:255',
      'component' => 'sometimes|string|max:255',
      'data_table' => 'sometimes|string|max:255',
      'data_key' => 'sometimes|string|max:255',
      'is_enabled' => 'boolean',
      'custom_props' => 'nullable|array',
      'data' => 'nullable|array',  // The full section data (e.g., banner content)
    ]);

    if ($validator->fails()) {
      return back()->withErrors($validator)->withInput();
    }

    // Prepare data for update
    $updateData = [];

    // Only allow updating section_key, is_enabled, custom_props (component, data_table, data_key are locked)
    if ($request->has('section_key')) {
      $updateData['section_key'] = $request->input('section_key');
    }
    if ($request->has('is_enabled')) {
      $updateData['is_enabled'] = $request->boolean('is_enabled');
    }
    if ($request->has('custom_props')) {
      $updateData['custom_props'] = $request->input('custom_props');
    }

    // Update the section config
    $sectionConfig->update($updateData);

    // Handle data update if provided
    if ($request->has('data') && is_array($request->input('data'))) {
      $data = $request->input('data');

      // Determine which data table to update
      switch ($sectionConfig->data_table) {
        case 'custom_section_data':
          $this->updateCustomSectionData($sectionConfig, $data);
          break;

        // For other data tables, we may not allow editing here
        // Optionally, you could add handling for other tables, but typically they are managed separately
        default:
          // Log or ignore
          break;
      }
    }

    // Return success response
    return back()->with('success', 'Section updated successfully.');
  }

  /**
   * Update custom section data with image processing.
   */
  protected function updateCustomSectionData(SectionConfig $sectionConfig, array $newData)
  {
    // Find existing custom section data record
    $customData = CustomSectionData::where('page_slug', $sectionConfig->page_slug)
      ->where('section_key', $sectionConfig->section_key)
      ->first();

    // If no record exists, create one
    if (!$customData) {
      $customData = new CustomSectionData();
      $customData->page_slug = $sectionConfig->page_slug;
      $customData->section_key = $sectionConfig->section_key;
    }

    // Get old data for comparison (to delete removed images)
    $oldData = $customData->data ?? [];

    // Process images in the new data
    $processedData = $this->processDataImages($newData, $oldData, $sectionConfig->section_key);

    // Update the data
    $customData->data = $processedData;
    $customData->is_active = true; // Or keep existing status
    $customData->save();
  }

  /**
   * Recursively process data to handle image uploads and deletions.
   */
  protected function processDataImages(
    array $newData,
    array $oldData,
    string $sectionKey
  ): array {
    // Recursively walk through the data structure
    $processed = $this->processArray($newData, $oldData, $sectionKey);

    return $processed;
  }

  protected function processArray(array $newArray, ?array $oldArray, string $sectionKey): array
  {
    if (!is_array($newArray)) {
      return $newArray;
    }

    $result = [];

    foreach ($newArray as $key => $value) {
      // If the value is an array, process recursively
      if (is_array($value)) {
        $oldValue = is_array($oldArray) && isset($oldArray[$key]) ? $oldArray[$key] : null;
        $result[$key] = $this->processArray($value, $oldValue, $sectionKey);
        continue;
      }

      // Check if it's a string that looks like a base64 image
      if (is_string($value) && $this->isBase64Image($value)) {
        // Upload the image and get new path
        $newPath = $this->uploadImage($value, $sectionKey);
        $result[$key] = $newPath;

        // Check if the old value (from old data) exists and is not the same path
        if (is_array($oldArray) && isset($oldArray[$key]) && is_string($oldArray[$key])) {
          $oldPath = $oldArray[$key];
          // If old path is not a base64 and not the same as new path, delete it
          if (!$this->isBase64Image($oldPath) && $oldPath !== $newPath) {
            $this->deleteImage($oldPath);
          }
        }
      } else {
        // For non-image fields, just copy value
        $result[$key] = $value;

        // Also check if this field was an image in old data but now it's removed or changed
        if (is_array($oldArray) && isset($oldArray[$key]) && is_string($oldArray[$key])) {
          $oldPath = $oldArray[$key];
          if (!$this->isBase64Image($oldPath) && $oldPath !== $value) {
            // Old image was replaced with a non-image (or different string), delete it
            $this->deleteImage($oldPath);
          }
        }
      }
    }

    // Also check for keys that exist in old but not in new (removed fields that might be images)
    if (is_array($oldArray)) {
      foreach ($oldArray as $key => $oldValue) {
        if (!array_key_exists($key, $newArray) && is_string($oldValue) && !$this->isBase64Image($oldValue)) {
          // This field was removed from new data, and it was an image path
          $this->deleteImage($oldValue);
        }
      }
    }

    return $result;
  }

  /**
   * Check if a string is a base64 image.
   */
  protected function isBase64Image(string $string): bool
  {
    return str_starts_with($string, 'data:image/');
  }

  /**
   * Upload a base64 image and return the storage path.
   */
  protected function uploadImage(string $base64String, string $subPath = 'sections'): string
  {
    try {
      // Extract image data
      $imageData = explode(',', $base64String);
      if (count($imageData) < 2) {
        return '';
      }
      $imageContent = base64_decode($imageData[1]);
      $extension = $this->getImageExtension($base64String);

      // Generate filename
      $filename = Str::uuid() . '.' . $extension;
      $path = $subPath . '/' . date('Y/m/d') . '/' . $filename;

      // Store the image
      Storage::disk('public')->put($path, $imageContent);

      return '/storage/' . $path;
    } catch (\Exception $e) {
      // Log error and return empty string
      Log::error('Image upload failed: ' . $e->getMessage());
      return '';
    }
  }

  /**
   * Get image extension from base64 string.
   */
  protected function getImageExtension(string $base64String): string
  {
    $mimeMap = [
      'image/jpeg' => 'jpg',
      'image/jpg' => 'jpg',
      'image/png' => 'png',
      'image/gif' => 'gif',
      'image/webp' => 'webp',
      'image/svg+xml' => 'svg',
      'image/svg' => 'svg',
      'image/bmp' => 'bmp',
      'image/tiff' => 'tiff',
      'image/x-icon' => 'ico',
      'image/vnd.microsoft.icon' => 'ico',
    ];

    if (preg_match('/^data:([^;]+);base64,/', $base64String, $matches)) {
      $mimeType = $matches[1];
      return $mimeMap[$mimeType] ?? 'png';
    }

    return 'png';
  }

  /**
   * Delete an image from storage if it exists.
   */
  protected function deleteImage(string $path): void
  {
    // Remove /storage/ prefix to get relative path
    $relativePath = str_replace('/storage/', '', $path);
    if (Storage::disk('public')->exists($relativePath)) {
      Storage::disk('public')->delete($relativePath);
    }
  }

  /**
   * Get About Content options for dropdown
   */
  public function getAboutContentOptions()
  {
    try {
      $items = AboutContent::where('is_active', true)
        ->orderBy('title')
        ->get()
        ->map(function ($item) {
          return [
            'id' => $item->id,
            'slug' => $item->slug,
            'title' => $item->title,
            'type' => $item->type,
            'content' => $item->content,
            'full_content' => $item->full_content,
            'image' => $item->image,
            'icon' => $item->icon,
            'bg_color' => $item->bg_color,
            'btn_text' => $item->btn_text,
            'btn_link' => $item->btn_link,
            'display_order' => $item->display_order,
            'is_featured' => $item->is_featured,
            'tags' => $item->tags,
          ];
        });

      return response()->json($items);
    } catch (\Exception $e) {
      Log::error('Error fetching about content options: ' . $e->getMessage());
      return response()->json([
        'error' => 'Failed to fetch about content options',
        'message' => $e->getMessage()
      ], 500);
    }
  }


  /**
   * Remove the specified section from storage.
   */
  public function destroy($id)
  {
    // Not implemented
  }
}
