<?php
// app/Http/Controllers/ApplicationController.php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\JobListing;
use App\Services\ATSService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ApplicationController extends Controller
{
    protected $atsService;

    public function __construct(ATSService $atsService)
    {
        $this->atsService = $atsService;
    }

    /**
     * Display a listing of applications.
     */
    public function index(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $query = Application::query();

        // Job seekers see their own applications
        if ($user->isJobSeeker()) {
            $query->where('user_id', Auth::id());
        }
        // Employers see applications for their jobs
        elseif ($user->isEmployer()) {
            $query->whereHas('jobListing', function ($q) {
                $q->where('user_id', Auth::id());
            });
        }

        // Apply filters
        if ($request->filled('status')) {
            $query->withStatus($request->status);
        }

        if ($request->filled('job_listing_id') && $user->isEmployer()) {
            $query->forJob($request->job_listing_id);
        }

        // Filter by ATS score
        if ($request->filled('min_score')) {
            $query->whereRaw('JSON_EXTRACT(ats_score, "$.total") >= ?', [$request->min_score]);
        }

        $applications = $query->with(['jobListing', 'applicant'])
            ->latest()
            ->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $applications
        ]);
    }

    /**
     * Store a newly created application.
     */
    public function store(Request $request, JobListing $jobListing)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Check if job is accepting applications
        if (!$jobListing->isAcceptingApplications()) {
            return response()->json([
                'success' => false,
                'message' => 'This job is no longer accepting applications.'
            ], 400);
        }

        // Only job seekers can apply
        if (!$user->isJobSeeker()) {
            return response()->json([
                'success' => false,
                'message' => 'Only job seekers can apply for jobs.'
            ], 403);
        }

        // Check if already applied
        $existingApplication = Application::where('job_listing_id', $jobListing->id)
            ->where('user_id', Auth::id())
            ->first();

        if ($existingApplication) {
            return response()->json([
                'success' => false,
                'message' => 'You have already applied for this job.'
            ], 400);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'resume' => 'required|file|mimes:pdf,doc,docx|max:5120', // 5MB max
        ]);

        // Upload resume
        $resumePath = $request->file('resume')->store('resumes', 'public');

        $application = Application::create([
            'job_listing_id' => $jobListing->id,
            'user_id' => Auth::id(),
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'resume_path' => $resumePath,
            'status' => 'pending'
        ]);

        // Calculate ATS score
        try {
            $application->calculateATSScore();
        } catch (\Exception $e) {
            Log::error('ATS calculation failed: ' . $e->getMessage());
        }

        return response()->json([
            'success' => true,
            'message' => 'Application submitted successfully.',
            'data' => $application->load('jobListing')
        ], 201);
    }

    /**
     * Display the specified application.
     */
    public function show(Application $application)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Check authorization
        if ($user->isJobSeeker() && $application->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized to view this application.'
            ], 403);
        }

        if ($user->isEmployer() && $application->jobListing->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized to view this application.'
            ], 403);
        }

        return response()->json([
            'success' => true,
            'data' => $application->load(['jobListing', 'applicant'])
        ]);
    }

    /**
     * Update the specified application status.
     */
    public function updateStatus(Request $request, Application $application)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Only employer who owns the job or admin can update status
        if (!$user->isAdmin() && $application->jobListing->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized to update this application.'
            ], 403);
        }

        $validated = $request->validate([
            'status' => 'required|in:pending,reviewed,shortlisted,rejected,hired',
            'employer_notes' => 'nullable|string'
        ]);

        $application->update([
            'status' => $validated['status'],
            'employer_notes' => $validated['employer_notes'] ?? $application->employer_notes
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Application status updated successfully.',
            'data' => $application
        ]);
    }

    /**
     * Download resume for an application.
     */
    public function downloadResume(Application $application)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Check authorization
        if ($user->isJobSeeker() && $application->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized to download this resume.'
            ], 403);
        }

        if ($user->isEmployer() && $application->jobListing->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized to download this resume.'
            ], 403);
        }

        if (!Storage::disk('public')->exists($application->resume_path)) {
            return response()->json([
                'success' => false,
                'message' => 'Resume file not found.'
            ], 404);
        }

        $resumeAbsolutePath = Storage::disk('public')->path($application->resume_path);

        return response()->download($resumeAbsolutePath);
    }

    /**
     * Remove the specified application.
     */
    public function destroy(Application $application)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Only job seeker can delete their own application
        if (!$user->isAdmin() && $application->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized to delete this application.'
            ], 403);
        }

        // Delete resume file
        Storage::disk('public')->delete($application->resume_path);

        $application->delete();

        return response()->json([
            'success' => true,
            'message' => 'Application withdrawn successfully.'
        ]);
    }

    /**
     * Recalculate ATS score for an application (for debugging/admin)
     */
    public function recalculateScore(Application $application)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Only admin can recalculate
        if (!$user->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized.'
            ], 403);
        }

        try {
            $application->calculateATSScore();

            return response()->json([
                'success' => true,
                'message' => 'ATS score recalculated successfully.',
                'data' => $application->ats_score
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to recalculate score: ' . $e->getMessage()
            ], 500);
        }
    }
}
