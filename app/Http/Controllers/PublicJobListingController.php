<?php
// app/Http/Controllers/PublicJobListingController.php

namespace App\Http\Controllers;

use App\Models\JobListing;
use App\Models\JobCategory;
use App\Models\Location;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicJobListingController extends Controller
{
    /**
     * Display public job listings for applicants
     * Only shows active, non-deleted jobs with valid deadlines
     */
    public function index(Request $request)
    {
        // Base query - only active, non-deleted jobs with upcoming deadlines
        $query = JobListing::where('is_active', true)
            ->whereNull('deleted_at')
            ->where('application_deadline', '>=', now())
            ->with(['category', 'location']);

        // Search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhereHas('category', function ($cat) use ($search) {
                        $cat->where('name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('location', function ($loc) use ($search) {
                        $loc->where('name', 'like', "%{$search}%");
                    });
            });
        }

        // Category filter
        if ($request->filled('category')) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        // Location filter
        if ($request->filled('location')) {
            $query->whereHas('location', function ($q) use ($request) {
                $q->where('slug', $request->location);
            });
        }

        // Job type filter
        if ($request->filled('job_type')) {
            $query->where('job_type', $request->job_type);
        }

        // Experience level filter
        if ($request->filled('experience_level')) {
            $query->where('experience_level', $request->experience_level);
        }

        // Salary filter
        if ($request->filled('salary_min')) {
            $query->where('salary', '>=', $request->salary_min);
        }

        // Sorting
        $sort = $request->get('sort', 'latest');
        switch ($sort) {
            case 'latest':
                $query->orderBy('created_at', 'desc');
                break;
            case 'oldest':
                $query->orderBy('created_at', 'asc');
                break;
            case 'deadline_soon':
                $query->orderBy('application_deadline', 'asc');
                break;
            case 'deadline_later':
                $query->orderBy('application_deadline', 'desc');
                break;
            default:
                $query->orderBy('created_at', 'desc');
        }

        $jobListings = $query->paginate(12)->withQueryString();

        // Get categories with counts for filter sidebar
        $categories = JobCategory::withCount(['jobListings' => function ($query) {
            $query->where('is_active', true)
                ->whereNull('deleted_at')
                ->where('application_deadline', '>=', now());
        }])->active()->orderBy('name')->get();

        // Get locations with counts for filter sidebar
        $locations = Location::withCount(['jobListings' => function ($query) {
            $query->where('is_active', true)
                ->whereNull('deleted_at')
                ->where('application_deadline', '>=', now());
        }])->active()->orderBy('name')->get();

        // Get unique job types for filter
        $jobTypes = JobListing::where('is_active', true)
            ->whereNull('deleted_at')
            ->where('application_deadline', '>=', now())
            ->distinct()
            ->pluck('job_type');

        // Get unique experience levels for filter
        $experienceLevels = JobListing::where('is_active', true)
            ->whereNull('deleted_at')
            ->where('application_deadline', '>=', now())
            ->distinct()
            ->pluck('experience_level');

        return Inertia::render('Backend/PublicJobListing/Index', [
            'jobListings' => $jobListings,
            'categories' => $categories,
            'locations' => $locations,
            'jobTypes' => $jobTypes,
            'experienceLevels' => $experienceLevels,
            'filters' => $request->only(['search', 'category', 'location', 'job_type', 'experience_level', 'sort'])
        ]);
    }

    /**
     * Display a single job listing
     */
    public function show($slug)
    {
        $jobListing = JobListing::where('slug', $slug)
            ->where('is_active', true)
            ->whereNull('deleted_at')
            ->where('application_deadline', '>=', now())
            ->with(['category', 'location', 'user'])
            ->firstOrFail();

        return Inertia::render('Backend/PublicJobListing/Show', [
            'jobListing' => $jobListing
        ]);
    }
}
