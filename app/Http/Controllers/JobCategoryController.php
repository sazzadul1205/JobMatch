<?php

namespace App\Http\Controllers;

use App\Models\JobCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class JobCategoryController extends Controller
{
    /**
     * Display a listing (including soft deleted)
     */
    public function index()
    {
        $categories = JobCategory::withTrashed()
            ->orderBy('name', 'asc')
            ->get();

        return Inertia::render('Backend/JobCategories/Index', [
            'categories' => $categories
        ]);
    }

    /**
     * Store a new category
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:job_categories,name',
            'is_active' => 'boolean',
        ]);

        // Generate slug from name
        $validated['slug'] = Str::slug($validated['name']);

        // Check if slug is unique, if not make it unique
        $originalSlug = $validated['slug'];
        $counter = 1;
        while (JobCategory::where('slug', $validated['slug'])->exists()) {
            $validated['slug'] = $originalSlug . '-' . $counter;
            $counter++;
        }

        JobCategory::create($validated);

        return back()->with('success', 'Category created successfully');
    }

    /**
     * Update category
     */
    public function update(Request $request, $category)
    {
        $jobCategory = JobCategory::findOrFail($category);

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:job_categories,name,' . $jobCategory->id,
            'is_active' => 'boolean',
        ]);

        // If name changed, update slug
        if ($jobCategory->name !== $validated['name']) {
            $validated['slug'] = Str::slug($validated['name']);

            // Check if slug is unique
            $originalSlug = $validated['slug'];
            $counter = 1;
            while (JobCategory::where('slug', $validated['slug'])
                ->where('id', '!=', $jobCategory->id)
                ->exists()
            ) {
                $validated['slug'] = $originalSlug . '-' . $counter;
                $counter++;
            }
        }

        $jobCategory->update($validated);

        return back()->with('success', 'Category updated successfully');
    }

    /**
     * Soft delete
     */
    public function destroy($category)
    {
        $jobCategory = JobCategory::findOrFail($category);

        // Check if category has related job listings
        if ($jobCategory->jobListings()->count() > 0) {
            return back()->with('error', 'Cannot delete category with associated job listings.');
        }

        $jobCategory->delete();

        return back()->with('success', 'Category moved to trash successfully');
    }

    /**
     * Toggle active/inactive
     */
    public function toggleActive($category)
    {
        // Find the category manually
        $jobCategory = JobCategory::findOrFail($category);

        // Log that the method was called
        Log::info('Toggle method called', [
            'category_id' => $jobCategory->id,
            'current_status' => $jobCategory->is_active,
            'category_name' => $jobCategory->name
        ]);

        $newStatus = !$jobCategory->is_active;

        $result = $jobCategory->update([
            'is_active' => $newStatus
        ]);

        // Log the result
        Log::info('Toggle result', [
            'category_id' => $jobCategory->id,
            'new_status' => $newStatus,
            'update_result' => $result,
            'after_update' => $jobCategory->fresh()->is_active
        ]);

        $status = $jobCategory->fresh()->is_active ? 'activated' : 'deactivated';

        return back()->with('success', "Category {$status} successfully");
    }

    /**
     * Restore soft deleted
     */
    public function restore($id)
    {
        $category = JobCategory::withTrashed()->findOrFail($id);

        // Check if restoring would cause duplicate name/slug
        $existingCategory = JobCategory::where('name', $category->name)
            ->where('id', '!=', $category->id)
            ->first();

        if ($existingCategory) {
            return back()->with('error', 'Cannot restore: A category with the same name already exists.');
        }

        $category->restore();

        return back()->with('success', 'Category restored successfully');
    }

    /**
     * Permanently delete (force delete)
     */
    public function forceDelete($id)
    {
        $category = JobCategory::withTrashed()->findOrFail($id);

        // Check if category has related job listings
        if ($category->jobListings()->count() > 0) {
            return back()->with('error', 'Cannot permanently delete category with associated job listings.');
        }

        $category->forceDelete();

        return back()->with('success', 'Category permanently deleted');
    }

    /**
     * Get active categories (for dropdowns, etc.)
     */
    public function getActiveCategories()
    {
        $categories = JobCategory::active()
            ->orderBy('name')
            ->get(['id', 'name', 'slug']);

        return response()->json($categories);
    }
}
