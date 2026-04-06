<?php
// app/Http/Controllers/JobListing/PublicJobListingController.php

namespace App\Http\Controllers\JobListing;

// Inertia
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;

// Models
use App\Models\JobView;
use App\Models\Location;
use App\Models\JobListing;
use App\Models\JobCategory;


class PublicJobListingController extends Controller
{
    /**
     * Display public job listings for applicants
     * Only shows active, non-deleted jobs with valid deadlines
     * Fully queryable with filters and sorting
     */
    public function index(Request $request)
    {
        // Base query - only active, non-deleted jobs with upcoming deadlines
        $query = JobListing::where('is_active', true)
            ->whereNull('deleted_at')
            ->where('application_deadline', '>=', now())
            ->with(['category', 'locations', 'employer']);

        // Search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhereHas('category', function ($cat) use ($search) {
                        $cat->where('name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('locations', function ($loc) use ($search) {
                        $loc->where('name', 'like', "%{$search}%");
                    });
            });
        }

        // Category filter (by slug)
        if ($request->filled('category')) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        // Location filter (by slug)
        if ($request->filled('location')) {
            $query->whereHas('locations', function ($q) use ($request) {
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

        // Salary range filters
        if ($request->filled('salary_min')) {
            $query->where('salary_min', '>=', $request->salary_min);
        }
        if ($request->filled('salary_max')) {
            $query->where('salary_max', '<=', $request->salary_max);
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
            case 'salary_high':
                $query->orderBy('salary_max', 'desc');
                break;
            case 'salary_low':
                $query->orderBy('salary_min', 'asc');
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

        // Get unique job types for filter (using the static property from model)
        $jobTypes = JobListing::$jobTypes;

        // Get unique experience levels for filter (using the static property from model)
        $experienceLevels = JobListing::$experienceLevels;

        // Get salary range for filtering
        $salaryStats = JobListing::where('is_active', true)
            ->whereNull('deleted_at')
            ->where('application_deadline', '>=', now())
            ->selectRaw('MIN(salary_min) as min_salary, MAX(salary_max) as max_salary')
            ->first();

        return Inertia::render('Backend/PublicJobListing/Index', [
            'jobListings' => $jobListings,
            'categories' => $categories,
            'locations' => $locations,
            'jobTypes' => $jobTypes,
            'experienceLevels' => $experienceLevels,
            'salaryRange' => [
                'min' => $salaryStats->min_salary ?? 0,
                'max' => $salaryStats->max_salary ?? 1000000,
            ],
            'filters' => $request->only([
                'search',
                'category',
                'location',
                'job_type',
                'experience_level',
                'salary_min',
                'salary_max',
                'sort'
            ])
        ]);
    }

    /**
     * Display a single job listing and register a view
     */
    public function show($slug)
    {
        $jobListing = JobListing::where('slug', $slug)
            ->where('is_active', true)
            ->whereNull('deleted_at')
            ->where('application_deadline', '>=', now())
            ->with(['category', 'locations', 'employer'])
            ->firstOrFail();

        $ipAddress = request()->ip();
        $alreadyViewed = JobView::where('job_listing_id', $jobListing->id)
            ->where('ip_address', $ipAddress)
            ->exists();

        if (!$alreadyViewed) {
            JobView::recordView($jobListing->id, Auth::id(), $ipAddress);
            $jobListing->incrementViews();
        }

        // Check if current user has already applied
        $hasApplied = false;
        $existingApplication = null;

        if (Auth::check()) {
            $existingApplication = $jobListing->applications()
                ->where('user_id', Auth::id())
                ->first();
            $hasApplied = !is_null($existingApplication);
        }

        // Get related jobs (same category)
        $relatedJobs = JobListing::where('category_id', $jobListing->category_id)
            ->where('id', '!=', $jobListing->id)
            ->where('is_active', true)
            ->whereNull('deleted_at')
            ->where('application_deadline', '>=', now())
            ->with(['category', 'locations'])
            ->limit(3)
            ->get();

        return Inertia::render('Public/JobListings/Show', [
            'jobListing' => $jobListing,
            'userData' => Auth::user(),
            'hasApplied' => $hasApplied,
            'existingApplication' => $existingApplication,
            'relatedJobs' => $relatedJobs,
        ]);
    }
}
