<?php
// app/Http/Controllers/JobListing/JobListingController.php

namespace App\Http\Controllers\JobListing;

// Inertia
use Carbon\Carbon;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;

// Models
use App\Models\User;
use App\Models\Location;
use App\Models\JobListing;
use App\Models\JobCategory;
use App\Models\JobView;

class JobListingController extends Controller
{
    /**
     * Display a listing of job listings with filtering and pagination
     */
    public function index(Request $request)
    {
        // Start query with relationships
        $query = JobListing::withTrashed()
            ->with(['category', 'locations', 'employer'])
            ->withCount([
                'applications',
                'views' // Add views count
            ]);

        // Search by title or description
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%");
            });
        }

        // Filter by status (active/inactive)
        if ($request->filled('status')) {
            if ($request->status === 'active') {
                $query->where('is_active', true);
            } elseif ($request->status === 'inactive') {
                $query->where('is_active', false);
            } elseif ($request->status === 'trashed') {
                $query->onlyTrashed();
            }
        }

        // Filter by category
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Filter by job type
        if ($request->filled('job_type')) {
            $query->where('job_type', $request->job_type);
        }

        // Filter by experience level
        if ($request->filled('experience_level')) {
            $query->where('experience_level', $request->experience_level);
        }

        // Filter by location (many-to-many relationship)
        if ($request->filled('location_id')) {
            $query->whereHas('locations', function ($q) use ($request) {
                $q->where('locations.id', $request->location_id);
            });
        }

        // Filter by employer
        if ($request->filled('employer_id')) {
            $query->where('user_id', $request->employer_id);
        }

        // Filter by date range (created_at)
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Filter by deadline range
        if ($request->filled('deadline_from')) {
            $query->whereDate('application_deadline', '>=', $request->deadline_from);
        }
        if ($request->filled('deadline_to')) {
            $query->whereDate('application_deadline', '<=', $request->deadline_to);
        }

        // Filter by publish date range
        if ($request->filled('publish_from')) {
            $query->whereDate('publish_at', '>=', $request->publish_from);
        }
        if ($request->filled('publish_to')) {
            $query->whereDate('publish_at', '<=', $request->publish_to);
        }

        // Filter by salary range
        if ($request->filled('salary_min_filter')) {
            $query->where(function ($q) use ($request) {
                $q->where('salary_min', '>=', $request->salary_min_filter)
                    ->orWhere('salary_max', '>=', $request->salary_min_filter);
            });
        }
        if ($request->filled('salary_max_filter')) {
            $query->where('salary_max', '<=', $request->salary_max_filter);
        }

        // Filter jobs with/without applications
        if ($request->filled('has_applications')) {
            if ($request->has_applications === 'yes') {
                $query->has('applications');
            } elseif ($request->has_applications === 'no') {
                $query->doesntHave('applications');
            }
        }

        // Filter by minimum application count
        if ($request->filled('min_applications')) {
            $query->has('applications', '>=', $request->min_applications);
        }

        // Filter expired jobs
        if ($request->filled('expired')) {
            if ($request->expired === 'yes') {
                $query->where('application_deadline', '<', now());
            } elseif ($request->expired === 'no') {
                $query->where(function ($q) {
                    $q->whereNull('application_deadline')
                        ->orWhere('application_deadline', '>=', now());
                });
            }
        }

        // Filter published status
        if ($request->filled('published')) {
            if ($request->published === 'yes') {
                $query->where(function ($q) {
                    $q->whereNull('publish_at')
                        ->orWhere('publish_at', '<=', now());
                });
            } elseif ($request->published === 'no') {
                $query->whereNotNull('publish_at')
                    ->where('publish_at', '>', now());
            }
        }

        // Sorting
        $sortField = $request->input('sort_field', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');

        // Allowed sort fields to prevent SQL injection
        $allowedSortFields = ['id', 'title', 'created_at', 'updated_at', 'application_deadline', 'publish_at', 'is_active', 'views_count'];

        if (in_array($sortField, $allowedSortFields)) {
            $query->orderBy($sortField, $sortDirection === 'asc' ? 'asc' : 'desc');
        } else {
            $query->orderBy('created_at', 'desc');
        }

        // Pagination
        $perPage = $request->input('per_page', 15);
        $jobListings = $query->paginate($perPage)->through(function ($jobListing) {
            return [
                'id' => $jobListing->id,
                'title' => $jobListing->title,
                'slug' => $jobListing->slug,
                'job_type' => $jobListing->job_type,
                'experience_level' => $jobListing->experience_level,
                'salary_min' => $jobListing->salary_min,
                'salary_max' => $jobListing->salary_max,
                'is_salary_negotiable' => $jobListing->is_salary_negotiable,
                'as_per_companies_policy' => $jobListing->as_per_companies_policy,
                'description' => $jobListing->description,
                'requirements' => $jobListing->requirements,
                'application_deadline' => $jobListing->application_deadline,
                'publish_at' => $jobListing->publish_at,
                'is_active' => $jobListing->is_active,
                'created_at' => $jobListing->created_at,
                'updated_at' => $jobListing->updated_at,
                'deleted_at' => $jobListing->deleted_at,
                'views_count' => $jobListing->views_count ?? 0,
                'applications_count' => $jobListing->applications_count ?? 0,
                'views_count_total' => $jobListing->views()->count(),
                'category' => $jobListing->category,
                'locations' => $jobListing->locations,
                'employer' => $jobListing->employer,
            ];
        })->withQueryString();

        // Get filter options data for the frontend
        $filterOptions = [
            'categories' => JobCategory::active()->orderBy('name')->get(['id', 'name']),
            'job_types' => JobListing::$jobTypes,
            'experience_levels' => JobListing::$experienceLevels,
            'locations' => Location::active()->orderBy('name')->get(['id', 'name']),
            'employers' => User::where('role', 'employer')->get(['id', 'name']),
        ];

        return Inertia::render('Backend/JobListings/Index', [
            'jobListings' => $jobListings,
            'filters' => $request->all([
                'search',
                'status',
                'category_id',
                'job_type',
                'experience_level',
                'location_id',
                'employer_id',
                'date_from',
                'date_to',
                'deadline_from',
                'deadline_to',
                'publish_from',
                'publish_to',
                'sort_field',
                'sort_direction',
                'per_page',
                'has_applications',
                'min_applications',
                'expired',
                'published',
                'salary_min_filter',
                'salary_max_filter'
            ]),
            'filterOptions' => $filterOptions,
        ]);
    }

    /**
     * Show the form for creating a new job listing
     */
    public function create()
    {
        $categories = JobCategory::active()->orderBy('name')->get();
        $locations = Location::active()->orderBy('name')->get();

        return Inertia::render('Backend/JobListings/Create', [
            'categories' => $categories,
            'locations' => $locations
        ]);
    }

    /**
     * Store a newly created job listing
     */
    public function store(Request $request)
    {
        // Validate the request
        $validated = $request->validate([
            'title' => 'required|string|min:5|max:255',
            'category_id' => 'required|exists:job_categories,id',
            'location_ids' => 'required|array|min:1',
            'location_ids.*' => 'exists:locations,id',
            'job_type' => 'required|string|in:' . implode(',', JobListing::$jobTypes),
            'experience_level' => 'required|string|in:' . implode(',', JobListing::$experienceLevels),
            'salary_min' => 'nullable|numeric|min:0',
            'salary_max' => 'nullable|numeric|min:0|gte:salary_min',
            'is_salary_negotiable' => 'boolean',
            'as_per_companies_policy' => 'boolean',
            'education_requirement' => 'nullable|string|max:255',
            'education_details' => 'nullable|string|max:255',
            'application_deadline' => 'required|date|after_or_equal:today',
            'publish_at' => 'nullable|date|after_or_equal:today',
            'description' => 'required|string|min:50',
            'requirements' => 'required|string|min:50',
            'benefits' => 'nullable|array',
            'skills' => 'required|array|min:1',
            'responsibilities' => 'required|array|min:1',
            'keywords' => 'nullable|array',
            'is_active' => 'boolean',
            'is_external_apply' => 'boolean',
            'external_apply_links' => 'nullable|array',
            'required_linkedin_link' => 'boolean',
            'required_facebook_link' => 'boolean',
        ]);

        // Prepare data for creation
        $data = [
            'title' => $validated['title'],
            'category_id' => $validated['category_id'],
            'job_type' => $validated['job_type'],
            'experience_level' => $validated['experience_level'],
            'salary_min' => $validated['salary_min'] ?? null,
            'salary_max' => $validated['salary_max'] ?? null,
            'is_salary_negotiable' => $validated['is_salary_negotiable'] ?? false,
            'as_per_companies_policy' => $validated['as_per_companies_policy'] ?? false,
            'education_requirement' => $validated['education_requirement'] ?? null,
            'education_details' => $validated['education_details'] ?? null,
            'application_deadline' => $validated['application_deadline'],
            'publish_at' => $validated['publish_at'] ?? null,
            'description' => $validated['description'],
            'requirements' => $validated['requirements'],
            'benefits' => $validated['benefits'] ?? [],
            'skills' => $validated['skills'],
            'responsibilities' => $validated['responsibilities'],
            'keywords' => $validated['keywords'] ?? [],
            'is_external_apply' => $validated['is_external_apply'] ?? false,
            'external_apply_links' => $validated['external_apply_links'] ?? [],
            'required_linkedin_link' => $validated['required_linkedin_link'] ?? false,
            'required_facebook_link' => $validated['required_facebook_link'] ?? false,
            'user_id' => Auth::id(),
            'views_count' => 0,
        ];

        // Generate unique slug (model will auto-generate, but we can override)
        $data['slug'] = $this->generateUniqueSlug($data['title']);

        // Determine initial status
        $data['is_active'] = $this->determineInitialStatus($data);

        // Create the job listing
        $jobListing = JobListing::create($data);

        // Handle locations relationship (many-to-many)
        if (isset($validated['location_ids']) && is_array($validated['location_ids'])) {
            $jobListing->locations()->sync($validated['location_ids']);
        }

        Log::info('Job listing created', [
            'job_id' => $jobListing->id,
            'title' => $jobListing->title,
            'user_id' => Auth::id()
        ]);

        return redirect()->route('backend.listing.index')
            ->with('success', 'Job listing created successfully');
    }

    /**
     * Display the specified job listing
     */
    public function show(JobListing $jobListing)
    {
        $ipAddress = request()->ip();
        $alreadyViewed = JobView::where('job_listing_id', $jobListing->id)
            ->where('ip_address', $ipAddress)
            ->exists();

        if (!$alreadyViewed) {
            $jobListing->incrementViews();
            JobView::recordView(
                $jobListing->id,
                Auth::id(),
                $ipAddress
            );
        }

        // Load relationships
        $jobListing->load(['category', 'locations', 'employer']);

        // Get application stats with ATS scores
        $applications = $jobListing->applications()
            ->with(['user', 'applicantProfile'])
            ->latest()
            ->get();

        $applicationStats = [
            'total' => $applications->count(),
            'pending' => $applications->where('status', 'pending')->count(),
            'shortlisted' => $applications->where('status', 'shortlisted')->count(),
            'rejected' => $applications->where('status', 'rejected')->count(),
            'hired' => $applications->where('status', 'hired')->count(),
        ];

        // Calculate average ATS score (only for completed ATS calculations)
        $completedATS = $applications->filter(function ($app) {
            return $app->isAtsCompleted() && $app->ats_score && isset($app->ats_score['percentage']);
        });

        $averageAtsScore = null;
        if ($completedATS->count() > 0) {
            $totalScore = $completedATS->sum(function ($app) {
                return $app->ats_score['percentage'] ?? 0;
            });
            $averageAtsScore = round($totalScore / $completedATS->count(), 2);
        }

        // Get recent applications with ATS scores (limit 10 for show page)
        $recentApplications = $jobListing->applications()
            ->with(['user', 'applicantProfile'])
            ->latest()
            ->limit(10)
            ->get()
            ->map(function ($application) {
                return [
                    'id' => $application->id,
                    'name' => $application->name ?? $application->user?->name ?? 'N/A',
                    'email' => $application->email ?? $application->user?->email ?? 'N/A',
                    'status' => $application->status,
                    'ats_score' => $application->isAtsCompleted() && $application->ats_score
                        ? ($application->ats_score['percentage'] ?? null)
                        : null,
                    'created_at' => $application->created_at,
                ];
            });

        // Get total views count
        $totalViews = $jobListing->views()->count();

        return Inertia::render('Backend/JobListings/Show', [
            'jobListing' => [
                'id' => $jobListing->id,
                'title' => $jobListing->title,
                'slug' => $jobListing->slug,
                'description' => $jobListing->description,
                'requirements' => $jobListing->requirements,
                'job_type' => $jobListing->job_type,
                'experience_level' => $jobListing->experience_level,
                'salary_min' => $jobListing->salary_min,
                'salary_max' => $jobListing->salary_max,
                'is_salary_negotiable' => $jobListing->is_salary_negotiable,
                'as_per_companies_policy' => $jobListing->as_per_companies_policy,
                'education_requirement' => $jobListing->education_requirement,
                'education_details' => $jobListing->education_details,
                'benefits' => $jobListing->benefits,
                'skills' => $jobListing->skills,
                'responsibilities' => $jobListing->responsibilities,
                'keywords' => $jobListing->keywords,
                'application_deadline' => $jobListing->application_deadline,
                'publish_at' => $jobListing->publish_at,
                'is_active' => $jobListing->is_active,
                'is_external_apply' => $jobListing->is_external_apply,
                'external_apply_links' => $jobListing->external_apply_links,
                'required_linkedin_link' => $jobListing->required_linkedin_link,
                'required_facebook_link' => $jobListing->required_facebook_link,
                'views_count' => $totalViews,
                'created_at' => $jobListing->created_at,
                'updated_at' => $jobListing->updated_at,
                'deleted_at' => $jobListing->deleted_at,
                'category' => $jobListing->category,
                'locations' => $jobListing->locations,
                'employer' => $jobListing->employer,
            ],
            'applicationStats' => $applicationStats,
            'averageAtsScore' => $averageAtsScore,
            'recentApplications' => $recentApplications,
            'totalViews' => $totalViews,
        ]);
    }

    /**
     * Show the form for editing the specified job listing
     */
    public function edit(JobListing $jobListing)
    {
        $categories = JobCategory::active()->orderBy('name')->get();
        $locations = Location::active()->orderBy('name')->get();

        // Get current location IDs for the job listing
        $jobListing->load('locations');
        $locationIds = $jobListing->locations->pluck('id')->toArray();

        // Prepare form data with all fields
        $formData = [
            'id' => $jobListing->id,
            'title' => $jobListing->title,
            'category_id' => $jobListing->category_id,
            'location_ids' => $locationIds,
            'job_type' => $jobListing->job_type,
            'experience_level' => $jobListing->experience_level,
            'salary_min' => $jobListing->salary_min,
            'salary_max' => $jobListing->salary_max,
            'is_salary_negotiable' => $jobListing->is_salary_negotiable,
            'as_per_companies_policy' => $jobListing->as_per_companies_policy,
            'education_requirement' => $jobListing->education_requirement,
            'education_details' => $jobListing->education_details,
            'application_deadline' => $jobListing->application_deadline ? $jobListing->application_deadline->format('Y-m-d') : null,
            'publish_at' => $jobListing->publish_at ? $jobListing->publish_at->format('Y-m-d') : null,
            'description' => $jobListing->description,
            'requirements' => $jobListing->requirements,
            'benefits' => $jobListing->benefits ?? [],
            'skills' => $jobListing->skills ?? [],
            'responsibilities' => $jobListing->responsibilities ?? [],
            'keywords' => $jobListing->keywords ?? [],
            'is_active' => $jobListing->is_active,
            'is_external_apply' => $jobListing->is_external_apply,
            'external_apply_links' => $jobListing->external_apply_links ?? [],
            'required_linkedin_link' => $jobListing->required_linkedin_link,
            'required_facebook_link' => $jobListing->required_facebook_link,
        ];

        return Inertia::render('Backend/JobListings/Edit', [
            'jobListing' => $formData,
            'categories' => $categories,
            'locations' => $locations,
        ]);
    }

    /**
     * Update the specified job listing
     */
    public function update(Request $request, JobListing $jobListing)
    {
        // Validate the request
        $validated = $request->validate([
            'title' => 'required|string|min:5|max:255',
            'category_id' => 'required|exists:job_categories,id',
            'location_ids' => 'required|array|min:1',
            'location_ids.*' => 'exists:locations,id',
            'job_type' => 'required|string|in:' . implode(',', JobListing::$jobTypes),
            'experience_level' => 'required|string|in:' . implode(',', JobListing::$experienceLevels),
            'salary_min' => 'nullable|numeric|min:0',
            'salary_max' => 'nullable|numeric|min:0|gte:salary_min',
            'is_salary_negotiable' => 'boolean',
            'as_per_companies_policy' => 'boolean',
            'education_requirement' => 'nullable|string|max:255',
            'education_details' => 'nullable|string|max:255',
            'application_deadline' => 'required|date',
            'publish_at' => 'nullable|date',
            'description' => 'required|string|min:50',
            'requirements' => 'required|string|min:50',
            'benefits' => 'nullable|array',
            'skills' => 'required|array|min:1',
            'responsibilities' => 'required|array|min:1',
            'keywords' => 'nullable|array',
            'is_active' => 'boolean',
            'is_external_apply' => 'boolean',
            'external_apply_links' => 'nullable|array',
            'required_linkedin_link' => 'boolean',
            'required_facebook_link' => 'boolean',
        ]);

        // Prepare data for update
        $data = [
            'title' => $validated['title'],
            'category_id' => $validated['category_id'],
            'job_type' => $validated['job_type'],
            'experience_level' => $validated['experience_level'],
            'salary_min' => $validated['salary_min'] ?? null,
            'salary_max' => $validated['salary_max'] ?? null,
            'is_salary_negotiable' => $validated['is_salary_negotiable'] ?? false,
            'as_per_companies_policy' => $validated['as_per_companies_policy'] ?? false,
            'education_requirement' => $validated['education_requirement'] ?? null,
            'education_details' => $validated['education_details'] ?? null,
            'application_deadline' => $validated['application_deadline'],
            'publish_at' => $validated['publish_at'] ?? null,
            'description' => $validated['description'],
            'requirements' => $validated['requirements'],
            'benefits' => $validated['benefits'] ?? [],
            'skills' => $validated['skills'],
            'responsibilities' => $validated['responsibilities'],
            'keywords' => $validated['keywords'] ?? [],
            'is_external_apply' => $validated['is_external_apply'] ?? false,
            'external_apply_links' => $validated['external_apply_links'] ?? [],
            'required_linkedin_link' => $validated['required_linkedin_link'] ?? false,
            'required_facebook_link' => $validated['required_facebook_link'] ?? false,
        ];

        // Update slug if title changed
        if ($jobListing->title !== $data['title']) {
            $data['slug'] = $this->generateUniqueSlug($data['title'], $jobListing->id);
        }

        // Apply automatic status update based on dates if is_active is not explicitly set
        if (!isset($validated['is_active'])) {
            $data['is_active'] = $this->determineStatusFromDates($data, $jobListing);
        } else {
            $data['is_active'] = $validated['is_active'];
        }

        $jobListing->update($data);

        // Handle locations relationship (many-to-many)
        if (isset($validated['location_ids']) && is_array($validated['location_ids'])) {
            $jobListing->locations()->sync($validated['location_ids']);
        }

        Log::info('Job listing updated', [
            'job_id' => $jobListing->id,
            'title' => $jobListing->title,
            'user_id' => Auth::id()
        ]);

        return redirect()->route('backend.listing.index')
            ->with('success', 'Job listing updated successfully');
    }

    /**
     * Remove the specified job listing (soft delete)
     */
    public function destroy(JobListing $jobListing)
    {
        // Check if there are applications before deleting
        $applicationsCount = $jobListing->applications()->count();

        if ($applicationsCount > 0) {
            return redirect()->route('backend.listing.index')
                ->with('error', "Cannot delete job listing with {$applicationsCount} existing application(s). Consider deactivating it instead.");
        }

        $jobListing->delete();

        Log::info('Job listing deleted', [
            'job_id' => $jobListing->id,
            'title' => $jobListing->title,
            'user_id' => Auth::id()
        ]);

        return redirect()->route('backend.listing.index')
            ->with('success', 'Job listing moved to trash');
    }

    /**
     * Toggle active status
     */
    public function toggleActive(JobListing $jobListing)
    {
        $newStatus = !$jobListing->is_active;

        $jobListing->update(['is_active' => $newStatus]);
        $status = $newStatus ? 'activated' : 'deactivated';

        Log::info('Job listing status toggled', [
            'job_id' => $jobListing->id,
            'new_status' => $newStatus,
            'user_id' => Auth::id()
        ]);

        return back()->with('success', "Job listing {$status} successfully");
    }

    /**
     * Display applications for a job listing
     */
    public function applications(JobListing $jobListing)
    {
        $applications = $jobListing->applications()
            ->with(['user', 'applicantProfile'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        $stats = [
            'total' => $jobListing->applications()->count(),
            'pending' => $jobListing->applications()->where('status', 'pending')->count(),
            'shortlisted' => $jobListing->applications()->where('status', 'shortlisted')->count(),
            'rejected' => $jobListing->applications()->where('status', 'rejected')->count(),
            'hired' => $jobListing->applications()->where('status', 'hired')->count(),
        ];

        return Inertia::render('Backend/JobListings/Applications', [
            'jobListing' => $jobListing,
            'applications' => $applications,
            'stats' => $stats,
        ]);
    }

    /**
     * Update all job listing statuses based on dates
     * This can be called via a scheduled task or manually
     */
    public function updateJobStatuses()
    {
        $now = Carbon::now();

        Log::info('Running job status update at ' . $now);

        // Auto-activate jobs that have reached their publish date
        $activated = JobListing::where('is_active', false)
            ->whereNotNull('publish_at')
            ->where('publish_at', '<=', $now)
            ->update(['is_active' => true]);

        // Auto-deactivate jobs that have passed their application deadline
        $deactivated = JobListing::where('is_active', true)
            ->whereNotNull('application_deadline')
            ->where('application_deadline', '<', $now)
            ->update(['is_active' => false]);

        Log::info("Job status update completed: {$activated} activated, {$deactivated} deactivated");

        return ['activated' => $activated, 'deactivated' => $deactivated];
    }

    /**
     * Generate a unique slug for a job listing
     */
    protected function generateUniqueSlug($title, $excludeId = null)
    {
        $slug = Str::slug($title);
        $originalSlug = $slug;
        $counter = 1;

        $query = JobListing::where('slug', $slug);

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        while ($query->exists()) {
            $slug = $originalSlug . '-' . $counter;
            $query = JobListing::where('slug', $slug);
            if ($excludeId) {
                $query->where('id', '!=', $excludeId);
            }
            $counter++;
        }

        return $slug;
    }

    /**
     * Determine initial status when creating a new job
     */
    protected function determineInitialStatus(array $data)
    {
        $now = Carbon::now();

        // If is_active is explicitly set in the request, use that
        if (isset($data['is_active'])) {
            return filter_var($data['is_active'], FILTER_VALIDATE_BOOLEAN);
        }

        // Check if there's an application deadline that's already passed
        if (isset($data['application_deadline']) && $data['application_deadline']) {
            $deadline = Carbon::parse($data['application_deadline']);
            if ($deadline < $now) {
                return false; // Job is already expired
            }
        }

        // Check publish date
        if (isset($data['publish_at']) && $data['publish_at']) {
            $publishDate = Carbon::parse($data['publish_at']);

            // If publish date is in the future, keep inactive until it arrives
            if ($publishDate > $now) {
                return false;
            }
        }

        // Default to active
        return true;
    }

    /**
     * Determine status from dates when updating a job
     */
    protected function determineStatusFromDates(array $data, JobListing $existingJob)
    {
        $now = Carbon::now();

        // Use new deadline if provided, otherwise use existing
        $deadline = isset($data['application_deadline']) && $data['application_deadline']
            ? Carbon::parse($data['application_deadline'])
            : ($existingJob->application_deadline ? Carbon::parse($existingJob->application_deadline) : null);

        // Use new publish date if provided, otherwise use existing
        $publishDate = isset($data['publish_at']) && $data['publish_at']
            ? Carbon::parse($data['publish_at'])
            : ($existingJob->publish_at ? Carbon::parse($existingJob->publish_at) : null);

        // Check if deadline is passed
        if ($deadline && $deadline < $now) {
            return false;
        }

        // Check if publish date is in the future
        if ($publishDate && $publishDate > $now) {
            return false;
        }

        // Default to active
        return true;
    }

    /**
     * Restore a soft-deleted job listing
     */
    public function restore($id)
    {
        $jobListing = JobListing::withTrashed()->findOrFail($id);

        // Check if it's actually soft-deleted
        if (!$jobListing->trashed()) {
            return redirect()->route('backend.listing.index')
                ->with('error', 'This job listing is not in trash.');
        }

        // Check if restore is valid based on dates
        $now = Carbon::now();
        if ($jobListing->application_deadline && $jobListing->application_deadline < $now) {
            return redirect()->route('backend.listing.index')
                ->with('error', 'Cannot restore job because the application deadline has passed.');
        }

        $jobListing->restore();

        Log::info('Job listing restored', [
            'job_id' => $jobListing->id,
            'title' => $jobListing->title,
            'user_id' => Auth::id()
        ]);

        return redirect()->route('backend.listing.index')
            ->with('success', 'Job listing restored successfully.');
    }

    /**
     * Permanently delete a soft-deleted job listing
     */
    public function forceDelete($id)
    {
        $jobListing = JobListing::withTrashed()->findOrFail($id);

        if (!$jobListing->trashed()) {
            return redirect()->route('backend.listing.index')
                ->with('error', 'Only trashed job listings can be permanently deleted.');
        }

        // Detach locations before force deleting
        $jobListing->locations()->detach();

        $jobListing->forceDelete();

        Log::info('Job listing permanently deleted', [
            'job_id' => $jobListing->id,
            'title' => $jobListing->title,
            'user_id' => Auth::id()
        ]);

        return redirect()->route('backend.listing.index')
            ->with('success', 'Job listing permanently deleted.');
    }

    /**
     * Bulk activate job listings
     */
    public function bulkActivate(Request $request)
    {
        $validated = $request->validate([
            'job_ids' => 'required|array',
            'job_ids.*' => 'exists:job_listings,id'
        ]);

        $count = JobListing::whereIn('id', $validated['job_ids'])
            ->whereNull('deleted_at')
            ->update(['is_active' => true]);

        return redirect()->back()->with('success', "{$count} job listing(s) activated successfully.");
    }

    /**
     * Bulk deactivate job listings
     */
    public function bulkDeactivate(Request $request)
    {
        $validated = $request->validate([
            'job_ids' => 'required|array',
            'job_ids.*' => 'exists:job_listings,id'
        ]);

        $count = JobListing::whereIn('id', $validated['job_ids'])
            ->whereNull('deleted_at')
            ->update(['is_active' => false]);

        return redirect()->back()->with('success', "{$count} job listing(s) deactivated successfully.");
    }

    /**
     * Bulk delete job listings (soft delete)
     */
    public function bulkDelete(Request $request)
    {
        $validated = $request->validate([
            'job_ids' => 'required|array',
            'job_ids.*' => 'exists:job_listings,id'
        ]);

        // Check if any jobs have applications
        $jobsWithApplications = JobListing::whereIn('id', $validated['job_ids'])
            ->whereHas('applications')
            ->count();

        if ($jobsWithApplications > 0) {
            return redirect()->back()
                ->with('error', "{$jobsWithApplications} job listing(s) have applications and cannot be deleted. Please deactivate them instead.");
        }

        $count = JobListing::whereIn('id', $validated['job_ids'])
            ->whereNull('deleted_at')
            ->delete();

        Log::info('Bulk job listing delete', [
            'job_ids' => $validated['job_ids'],
            'count' => $count,
            'user_id' => Auth::id()
        ]);

        return redirect()->back()->with('success', "{$count} job listing(s) moved to trash.");
    }
}
