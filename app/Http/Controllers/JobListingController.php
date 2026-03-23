<?php

namespace App\Http\Controllers;

use App\Models\JobListing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class JobListingController extends Controller
{
    /**
     * Display a listing of job listings.
     */
    public function index(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Add authentication check
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated.'
            ], 401);
        }

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

        // For employers, show their own jobs
        if ($user->isEmployer()) {
            $query->where('user_id', Auth::id());
        }
        // For job seekers, show only active jobs
        elseif ($user->isJobSeeker()) {
            $query->active();
        }
        // Admin sees all jobs (no additional filters needed)

        $jobListings = $query->latest()->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $jobListings
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
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Only employers can create job listings.'
            ], 403);
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
            $validated['keywords'] = json_encode($validated['keywords']);
        }

        $jobListing = JobListing::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Job listing created successfully.',
            'data' => $jobListing
        ], 201);
    }

    /**
     * Display the specified job listing.
     */
    public function show(JobListing $jobListing)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // If user is a job seeker
        if ($user->isJobSeeker()) {
            // Check if job is accepting applications
            if (!$jobListing->isAcceptingApplications()) {
                return response()->json([
                    'success' => false,
                    'message' => 'This job is no longer accepting applications.'
                ], 403);
            }
            return response()->json([
                'success' => true,
                'data' => $jobListing->load('employer')
            ]);
        }

        // If user is an employer
        if ($user->isEmployer()) {
            // Check if employer owns this job
            if ($jobListing->user_id !== Auth::id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized to view this job listing.'
                ], 403);
            }
            return response()->json([
                'success' => true,
                'data' => $jobListing->load('employer')
            ]);
        }

        // If user is admin
        if ($user->isAdmin()) {
            return response()->json([
                'success' => true,
                'data' => $jobListing->load('employer')
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Unauthorized to view this job listing.'
        ], 403);
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
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized to update this job listing.'
            ], 403);
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
            $validated['keywords'] = json_encode($validated['keywords']);
        }

        $jobListing->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Job listing updated successfully.',
            'data' => $jobListing
        ]);
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
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized to delete this job listing.'
            ], 403);
        }

        $jobListing->delete();

        return response()->json([
            'success' => true,
            'message' => 'Job listing deleted successfully.'
        ]);
    }

    /**
     * Get applications for a specific job listing.
     */
    public function applications(JobListing $jobListing)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        // Only employer who owns the job or admin can view applications
        if (!$user->isAdmin() && $jobListing->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized to view applications for this job.'
            ], 403);
        }

        $applications = $jobListing->applications()
            ->with('applicant')
            ->latest()
            ->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $applications
        ]);
    }
}
