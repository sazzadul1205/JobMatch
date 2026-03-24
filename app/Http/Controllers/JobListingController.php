<?php
// app/Http/Controllers/JobListingController.php

namespace App\Http\Controllers;

use App\Models\JobListing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class JobListingController extends Controller
{
    /**
     * Display a listing of job listings.
     */
    public function index(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $query = JobListing::query();

        // Apply filters
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'LIKE', "%{$request->search}%")
                    ->orWhere('description', 'LIKE', "%{$request->search}%")
                    ->orWhere('location', 'LIKE', "%{$request->search}%");
            });
        }

        if ($request->filled('job_type')) {
            $query->ofType($request->job_type);
        }

        if ($request->filled('category')) {
            $query->inCategory($request->category);
        }

        if ($request->filled('experience_level')) {
            $query->withExperience($request->experience_level);
        }

        if ($request->filled('location')) {
            $query->inLocation($request->location);
        }

        if ($request->filled('status')) {
            if ($request->status === 'active') {
                $query->active();
            } elseif ($request->status === 'inactive') {
                $query->where('is_active', false);
            }
        }

        // Role-based filtering
        if ($user->isEmployer()) {
            $query->where('user_id', Auth::id());
        } elseif ($user->isJobSeeker()) {
            $query->active();
        }
        // Admin sees all jobs

        $jobListings = $query->with('employer')
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('jobs/index', [
            'jobs' => $jobListings,
            'filters' => $request->only(['search', 'job_type', 'category', 'experience_level', 'location', 'status']),
            'userRole' => $user->role,
        ]);
    }

    /**
     * Show the form for creating a new job listing.
     */
    public function create()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Only employers and admins can create jobs
        if (!$user->isEmployer() && !$user->isAdmin()) {
            return redirect()->route('backend.listing.index')
                ->with('error', 'Unauthorized to create job listings.');
        }

        return Inertia::render('jobs/create', [
            'jobTypes' => $this->getJobTypes(),
            'categories' => $this->getCategories(),
            'experienceLevels' => $this->getExperienceLevels(),
            'storeUrl' => route('backend.listing.store'), 
        ]);
    }

    /**
     * Store a newly created job listing.
     */
    public function store(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Only employers and admins can create jobs
        if (!$user->isEmployer() && !$user->isAdmin()) {
            return redirect()->route('backend.listing.index')
                ->with('error', 'Unauthorized to create job listings.');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'requirements' => 'required|string',
            'location' => 'required|string|max:255',
            'salary_range' => 'nullable|string|max:100',
            'job_type' => 'required|string|in:full-time,part-time,contract,internship,remote',
            'category' => 'required|string|max:100',
            'experience_level' => 'required|string|in:entry,mid-level,senior,executive',
            'keywords' => 'nullable|array',
            'application_deadline' => 'required|date|after:today',
            'is_active' => 'boolean'
        ]);

        $validated['user_id'] = Auth::id();

        if (isset($validated['keywords'])) {
            $validated['keywords'] = $validated['keywords'];
        }

        $jobListing = JobListing::create($validated);

        return redirect()->route('backend.listing.show', $jobListing)
            ->with('success', 'Job listing created successfully.');
    }

    /**
     * Display the specified job listing.
     */
    public function show(JobListing $jobListing)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Load relationships
        $jobListing->load(['employer', 'applications' => function ($query) use ($user) {
            if ($user->isEmployer()) {
                $query->with('applicant')->latest();
            } elseif ($user->isJobSeeker()) {
                $query->where('user_id', $user->id);
            }
        }]);

        // Authorization checks for view
        if ($user->isJobSeeker()) {
            if (!$jobListing->isAcceptingApplications()) {
                return redirect()->route('backend.listing.index')
                    ->with('error', 'This job is no longer accepting applications.');
            }
        }

        if ($user->isEmployer() && $jobListing->user_id !== $user->id && !$user->isAdmin()) {
            return redirect()->route('backend.listing.index')
                ->with('error', 'Unauthorized to view this job listing.');
        }

        // Check if user has already applied
        $hasApplied = false;
        if ($user->isJobSeeker()) {
            $hasApplied = $jobListing->applications()
                ->where('user_id', $user->id)
                ->exists();
        }

        return Inertia::render('jobs/show', [
            'job' => $jobListing,
            'hasApplied' => $hasApplied,
            'userRole' => $user->role,
            'canApply' => $jobListing->isAcceptingApplications() && !$hasApplied,
            'applications' => $user->isEmployer() ? $jobListing->applications : null,
        ]);
    }

    /**
     * Show the form for editing the specified job listing.
     */
    public function edit(JobListing $jobListing)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Check authorization
        if (!$user->isAdmin() && $jobListing->user_id !== Auth::id()) {
            return redirect()->route('backend.listing.index')
                ->with('error', 'Unauthorized to edit this job listing.');
        }

        return Inertia::render('jobs/edit', [
            'job' => $jobListing,
            'jobTypes' => $this->getJobTypes(),
            'categories' => $this->getCategories(),
            'experienceLevels' => $this->getExperienceLevels(),
        ]);
    }

    /**
     * Update the specified job listing.
     */
    public function update(Request $request, JobListing $jobListing)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Check authorization
        if (!$user->isAdmin() && $jobListing->user_id !== Auth::id()) {
            return redirect()->route('backend.listing.index')
                ->with('error', 'Unauthorized to update this job listing.');
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'requirements' => 'sometimes|string',
            'location' => 'sometimes|string|max:255',
            'salary_range' => 'nullable|string|max:100',
            'job_type' => 'sometimes|string|in:full-time,part-time,contract,internship,remote',
            'category' => 'sometimes|string|max:100',
            'experience_level' => 'sometimes|string|in:entry,mid-level,senior,executive',
            'keywords' => 'nullable|array',
            'application_deadline' => 'sometimes|date|after:today',
            'is_active' => 'sometimes|boolean'
        ]);

        if (isset($validated['keywords'])) {
            $validated['keywords'] = $validated['keywords'];
        }

        $jobListing->update($validated);

        return redirect()->route('backend.listing.show', $jobListing)
            ->with('success', 'Job listing updated successfully.');
    }

    /**
     * Remove the specified job listing.
     */
    public function destroy(JobListing $jobListing)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Check authorization
        if (!$user->isAdmin() && $jobListing->user_id !== Auth::id()) {
            return redirect()->route('backend.listing.index')
                ->with('error', 'Unauthorized to delete this job listing.');
        }

        // Check if there are applications before deleting
        $applicationsCount = $jobListing->applications()->count();

        if ($applicationsCount > 0 && !$user->isAdmin()) {
            return redirect()->route('backend.listing.show', $jobListing)
                ->with('error', 'Cannot delete job with existing applications. Consider deactivating it instead.');
        }

        $jobListing->delete();

        return redirect()->route('backend.listing.index')
            ->with('success', 'Job listing deleted successfully.');
    }

    /**
     * Get applications for a specific job listing.
     */
    public function applications(JobListing $jobListing, Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Only employer who owns the job or admin can view applications
        if (!$user->isAdmin() && $jobListing->user_id !== Auth::id()) {
            return redirect()->route('backend.listing.index')
                ->with('error', 'Unauthorized to view applications for this job.');
        }

        $query = $jobListing->applications()->with(['applicant', 'jobListing']);

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by ATS score
        if ($request->filled('min_score')) {
            $query->whereRaw('JSON_EXTRACT(ats_score, "$.total") >= ?', [$request->min_score]);
        }

        $applications = $query->latest()->paginate(15)->withQueryString();

        // Get statistics
        $stats = [
            'total' => $jobListing->applications()->count(),
            'pending' => $jobListing->applications()->where('status', 'pending')->count(),
            'reviewed' => $jobListing->applications()->where('status', 'reviewed')->count(),
            'shortlisted' => $jobListing->applications()->where('status', 'shortlisted')->count(),
            'rejected' => $jobListing->applications()->where('status', 'rejected')->count(),
            'hired' => $jobListing->applications()->where('status', 'hired')->count(),
            'average_score' => $jobListing->applications()
                ->whereNotNull('ats_score')
                ->get()
                ->avg(function ($app) {
                    return $app->getAtsScorePercentage() ?? 0;
                }),
        ];

        return Inertia::render('jobs/applications', [
            'job' => $jobListing,
            'applications' => $applications,
            'stats' => $stats,
            'filters' => $request->only(['status', 'min_score']),
        ]);
    }

    /**
     * Toggle job listing active status.
     */
    public function toggleActive(JobListing $jobListing)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Check authorization
        if (!$user->isAdmin() && $jobListing->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized.'
            ], 403);
        }

        $jobListing->update([
            'is_active' => !$jobListing->is_active
        ]);

        if (request()->expectsJson()) {
            return response()->json([
                'success' => true,
                'is_active' => $jobListing->is_active
            ]);
        }

        return redirect()->back()->with(
            'success',
            $jobListing->is_active ? 'Job listing activated.' : 'Job listing deactivated.'
        );
    }

    /**
     * Get job types for dropdown.
     */
    private function getJobTypes(): array
    {
        return [
            'full-time' => 'Full Time',
            'part-time' => 'Part Time',
            'contract' => 'Contract',
            'internship' => 'Internship',
            'remote' => 'Remote',
        ];
    }

    /**
     * Get categories for dropdown.
     */
    private function getCategories(): array
    {
        return [
            'technology' => 'Technology',
            'healthcare' => 'Healthcare',
            'finance' => 'Finance',
            'education' => 'Education',
            'marketing' => 'Marketing',
            'sales' => 'Sales',
            'engineering' => 'Engineering',
            'design' => 'Design',
            'human_resources' => 'Human Resources',
            'customer_service' => 'Customer Service',
        ];
    }

    /**
     * Get experience levels for dropdown.
     */
    private function getExperienceLevels(): array
    {
        return [
            'entry' => 'Entry Level (0-2 years)',
            'mid-level' => 'Mid Level (3-5 years)',
            'senior' => 'Senior Level (6-9 years)',
            'executive' => 'Executive (10+ years)',
        ];
    }
}
