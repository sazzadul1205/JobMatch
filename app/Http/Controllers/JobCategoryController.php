<?php
// app/Http/Controllers/JobCategoryController.php

namespace App\Http\Controllers;

use App\Models\JobCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JobCategoryController extends Controller
{
    public function index()
    {
        $categories = JobCategory::active()->get();
        return Inertia::render('Categories/Index', [
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'is_active' => 'boolean'
        ]);

        JobCategory::create($validated);

        return redirect()->back();
    }

    public function update(Request $request, JobCategory $category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'is_active' => 'boolean'
        ]);

        $category->update($validated);

        return redirect()->back();
    }

    public function destroy(JobCategory $category)
    {
        $category->delete();

        return redirect()->back();
    }

    public function toggleActive(JobCategory $category)
    {
        $category->update(['is_active' => !$category->is_active]);

        return redirect()->back();
    }
}
