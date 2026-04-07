<?php
// app/Http/Controllers/ApplicationController.php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\JobListing;
use App\Services\ATSService;
use App\Mail\ShortlistedMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use ZipArchive;

class ApplicationController extends Controller
{
    protected $atsService;

    public function __construct(ATSService $atsService)
    {
        $this->atsService = $atsService;
    }

    /**
     * Display applications for a specific job (employer view)
     */
    public function index(?JobListing $jobListing = null)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // If jobListing is provided, show applications for that specific job
        if ($jobListing) {
            // Authorization: employer must own the job, or admin
            if (!$user->isAdmin() && $jobListing->user_id !== $user->id) {
                abort(403);
            }

            $query = Application::where('job_listing_id', $jobListing->id);

            // Apply filters
            if (request()->filled('status')) {
                $query->where('status', request()->status);
            }

            if (request()->filled('min_score')) {
                $query->whereRaw('JSON_EXTRACT(ats_score, "$.percentage") >= ?', [request()->min_score]);
            }

            if (request()->filled('search')) {
                $search = request()->search;
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%")
                        ->orWhereHas('applicantProfile', function ($p) use ($search) {
                            $p->where('first_name', 'like', "%{$search}%")
                                ->orWhere('last_name', 'like', "%{$search}%");
                        });
                });
            }

            $applications = $query->with(['applicantProfile', 'user'])
                ->latest()
                ->paginate(15)
                ->withQueryString();

            return Inertia::render('Backend/Applications/JobApplications', [
                'applications' => $applications,
                'job' => $jobListing,
                'filters' => request()->only(['status', 'min_score', 'search']),
                'userRole' => $user->role,
            ]);
        }

        // Default: show all applications (admin only)
        if (!$user->isAdmin()) {
            abort(403);
        }

        $applications = Application::with(['jobListing', 'applicantProfile', 'user'])
            ->latest()
            ->paginate(15);

        return Inertia::render('Backend/Applications/All', [
            'applications' => $applications,
            'userRole' => $user->role,
        ]);
    }

    /**
     * Get all applications for the authenticated user (job seeker)
     */
    public function myApplications(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Only job seekers can access their applications
        if (!$user->isJobSeeker()) {
            return redirect()->route('dashboard')
                ->with('error', 'Only job seekers can access this page.');
        }

        $query = Application::where('user_id', $user->id)
            ->with([
                'jobListing' => function ($q) {
                    $q->with(['category', 'location', 'user']);
                },
                'applicantProfile'
            ]);

        // Apply status filter
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Apply date range filter
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Apply search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhereHas('jobListing', function ($job) use ($search) {
                        $job->where('title', 'like', "%{$search}%");
                    });
            });
        }

        // Apply sorting
        $sort = $request->get('sort', 'latest');
        switch ($sort) {
            case 'latest':
                $query->orderBy('created_at', 'desc');
                break;
            case 'oldest':
                $query->orderBy('created_at', 'asc');
                break;
            case 'status':
                $query->orderBy('status', 'asc');
                break;
            case 'job_title':
                $query->orderBy(
                    JobListing::select('title')
                        ->whereColumn('job_listings.id', 'applications.job_listing_id')
                        ->limit(1)
                );
                break;
            default:
                $query->orderBy('created_at', 'desc');
        }

        $applications = $query->paginate(15)->withQueryString();

        // Get statistics for the dashboard
        $statistics = [
            'total' => Application::where('user_id', $user->id)->count(),
            'pending' => Application::where('user_id', $user->id)->where('status', 'pending')->count(),
            'reviewed' => Application::where('user_id', $user->id)->where('status', 'reviewed')->count(),
            'shortlisted' => Application::where('user_id', $user->id)->where('status', 'shortlisted')->count(),
            'rejected' => Application::where('user_id', $user->id)->where('status', 'rejected')->count(),
            'hired' => Application::where('user_id', $user->id)->where('status', 'hired')->count(),
            'average_ats_score' => Application::where('user_id', $user->id)
                ->whereNotNull('ats_score')
                ->avg(DB::raw('JSON_EXTRACT(ats_score, "$.percentage")')) ?? 0,
        ];

        // Get recent applications (last 30 days)
        $recentApplications = Application::where('user_id', $user->id)
            ->where('created_at', '>=', now()->subDays(30))
            ->with('jobListing')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        return Inertia::render('Backend/Applications/MyApplications', [
            'applications' => $applications,
            'statistics' => $statistics,
            'recentApplications' => $recentApplications,
            'filters' => $request->only(['status', 'date_from', 'date_to', 'search', 'sort']),
            'userRole' => $user->role,
        ]);
    }

    /**
     * Show the application form for a job listing.
     */
    public function create(JobListing $jobListing)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Only job seekers can apply
        if (!$user->isJobSeeker()) {
            return redirect()->route('backend.listing.show', $jobListing)
                ->with('error', 'Only job seekers can apply for jobs.');
        }

        // Check if job is accepting applications
        if (!$jobListing->is_active || $jobListing->application_deadline < now()) {
            return redirect()->route('public.jobs.index')
                ->with('error', 'This job is no longer accepting applications.');
        }

        $hasApplied = $jobListing->applications()
            ->where('user_id', $user->id)
            ->exists();

        if ($hasApplied) {
            $application = $jobListing->applications()->where('user_id', $user->id)->first();

            // Redirect job seekers to their applications list, others to show page
            if ($user->isJobSeeker()) {
                return redirect()->route('backend.applications.my-applications')
                    ->with('error', 'You have already applied for this job.');
            } else {
                return redirect()->route('backend.applications.show', $application)
                    ->with('error', 'You have already applied for this job.');
            }
        }

        $profile = $user->applicantProfile;

        return Inertia::render('Backend/Applications/Create', [
            'job' => $jobListing,
            'profile' => $profile,
            'hasProfile' => !is_null($profile),
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
        if (!$jobListing->is_active || $jobListing->application_deadline < now()) {
            return redirect()->back()->with('error', 'This job is no longer accepting applications.');
        }

        // Only job seekers can apply
        if (!$user->isJobSeeker()) {
            return redirect()->back()->with('error', 'Only job seekers can apply for jobs.');
        }

        // Check if already applied (including soft deleted applications)
        $existingApplication = Application::withTrashed()
            ->where('job_listing_id', $jobListing->id)
            ->where('user_id', Auth::id())
            ->first();

        if ($existingApplication) {
            if ($existingApplication->trashed()) {
                // Permanently delete the soft-deleted application and its files
                try {
                    // Delete custom resume file if exists
                    if ($existingApplication->resume_path && Storage::disk('public')->exists($existingApplication->resume_path)) {
                        Storage::disk('public')->delete($existingApplication->resume_path);
                    }

                    // Force delete the application
                    $existingApplication->forceDelete();

                    Log::info('Soft-deleted application permanently removed for reapplication', [
                        'application_id' => $existingApplication->id,
                        'user_id' => $user->id,
                        'job_listing_id' => $jobListing->id
                    ]);
                } catch (\Exception $e) {
                    Log::error('Failed to delete soft-deleted application', [
                        'application_id' => $existingApplication->id,
                        'error' => $e->getMessage()
                    ]);
                    return redirect()->back()->with('error', 'Unable to process your application. Please contact support.');
                }
            } else {
                // Active application exists
                return redirect()->back()->with('error', 'You have already applied for this job. You cannot apply again.');
            }
        }

        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'resume' => 'nullable|file|mimes:pdf,doc,docx|max:5120',
            'expected_salary' => 'nullable|numeric|min:0',
            'use_profile_data' => 'boolean',
        ]);

        $profile = $user->applicantProfile;
        $useProfileData = $validated['use_profile_data'] ?? ($profile ? true : false);

        // Prepare application data
        $applicationData = [
            'job_listing_id' => $jobListing->id,
            'user_id' => Auth::id(),
            'applicant_profile_id' => $profile?->id,
            'expected_salary' => $validated['expected_salary'] ?? null,
            'status' => 'pending',
            'ats_calculation_status' => 'pending',
            'ats_attempt_count' => 0,
        ];

        try {
            if ($useProfileData && $profile) {
                // Use profile data
                $applicationData['name'] = $profile->full_name;
                $applicationData['email'] = $profile->email;
                $applicationData['phone'] = $profile->phone;

                // Handle custom resume upload (overrides profile CV)
                if ($request->hasFile('resume')) {
                    $resumePath = $request->file('resume')->store('application-resumes', 'public');
                    $applicationData['resume_path'] = $resumePath;
                }
            } else {
                // Use custom data - all fields are required
                $customValidation = $request->validate([
                    'name' => 'required|string|max:255',
                    'email' => 'required|email|max:255',
                    'resume' => 'required|file|mimes:pdf,doc,docx|max:5120',
                ]);

                $applicationData['name'] = $customValidation['name'];
                $applicationData['email'] = $customValidation['email'];
                $applicationData['phone'] = $validated['phone'] ?? null;

                $resumePath = $request->file('resume')->store('application-resumes', 'public');
                $applicationData['resume_path'] = $resumePath;
            }

            $application = Application::create($applicationData);
        } catch (\Illuminate\Database\QueryException $e) {
            // Handle duplicate entry constraint violation
            if ($e->getCode() === '23000' && str_contains($e->getMessage(), 'applications_job_listing_id_user_id_unique')) {
                Log::warning('Duplicate application detected during creation', [
                    'user_id' => $user->id,
                    'job_listing_id' => $jobListing->id,
                    'error' => $e->getMessage()
                ]);
                return redirect()->back()->with('error', 'You have already applied for this job. Your application is being processed.');
            }

            // Log other database exceptions
            Log::error('Database error during application creation', [
                'user_id' => $user->id,
                'job_listing_id' => $jobListing->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()->back()->with('error', 'Unable to submit application due to a system error. Please try again later.');
        } catch (\Exception $e) {
            // Handle any other exceptions
            Log::error('Unexpected error during application creation', [
                'user_id' => $user->id,
                'job_listing_id' => $jobListing->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()->back()->with('error', 'Unable to submit application. Please try again later.');
        }

        $atsCalculated = $application->calculateATSScore();

        $message = 'Application submitted successfully!';
        if ($atsCalculated) {
            $message .= ' Your ATS score was calculated.';
        } else {
            $message .= ' ATS score calculation failed. You can retry later.';
        }

        // Redirect job seekers to their applications list
        if ($user->isJobSeeker()) {
            return redirect()->route('backend.applications.my-applications')
                ->with('success', $message);
        } else {
            return redirect()->route('backend.applications.show', $application)
                ->with('success', $message);
        }
    }

    /**
     * Display the specified application.
     */
    public function show(Application $application)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Check authorization
        if ($user->isJobSeeker() && $application->user_id !== $user->id) {
            abort(403, 'You can only view your own applications.');
        }

        if ($user->isEmployer() && $application->jobListing->user_id !== $user->id) {
            abort(403, 'You can only view applications for your own job listings.');
        }

        if (!$user->isAdmin() && !$user->isEmployer() && !$user->isJobSeeker()) {
            abort(403, 'Unauthorized access.');
        }

        $application->load(['jobListing' => function ($q) {
            $q->with(['category', 'location', 'user']);
        }, 'applicantProfile', 'user']);

        return Inertia::render('Backend/Applications/Show', [
            'application' => $application,
            'userRole' => $user->role,
        ]);
    }

    /**
     * Show edit form for application (for job seekers to edit before submission)
     */
    public function edit(Application $application)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Only allow editing if pending and owned by user
        if ($user->id !== $application->user_id || !$application->isPending()) {
            abort(403);
        }

        $profile = $user->applicantProfile;

        // Check if application is using profile data
        $isUsingProfile = false;
        if ($profile) {
            $fullName = $profile->full_name;
            $isUsingProfile = ($application->name === $fullName && $application->email === $profile->email);
        }

        // Load job listing with relationships
        $application->load(['jobListing' => function ($q) {
            $q->with(['category', 'location', 'user']);
        }]);

        return Inertia::render('Backend/Applications/Edit', [
            'application' => $application,
            'job' => $application->jobListing,
            'profile' => $profile,
            'isUsingProfile' => $isUsingProfile,
            'hasProfile' => !is_null($profile),
        ]);
    }

    /**
     * Update the specified application.
     */
    public function update(Request $request, Application $application)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Check if user owns this application
        if ($application->user_id !== $user->id) {
            abort(403, 'You do not have permission to edit this application.');
        }

        // Check if application is still pending
        if (!$application->isPending()) {
            return redirect()->back()->with('error', 'You cannot edit an application that has already been reviewed.');
        }

        $mode = $request->input('mode', 'custom');
        $rules = [];

        if ($mode === 'custom') {
            $rules['name'] = 'required|string|max:255';
            $rules['email'] = 'required|email|max:255';
            $rules['phone'] = 'nullable|string|max:20';
        }

        $rules['expected_salary'] = 'nullable|numeric|min:0';
        $rules['resume'] = 'nullable|file|mimes:pdf,doc,docx|max:5120'; // 5MB
        $rules['photo'] = 'nullable|image|mimes:jpeg,png,jpg|max:2048'; // 2MB

        $validated = $request->validate($rules);

        // Update basic fields
        if ($mode === 'custom') {
            $application->name = $validated['name'];
            $application->email = $validated['email'];
            $application->phone = $validated['phone'] ?? null;
        } else {
            // For profile mode, update from profile
            if ($user->applicantProfile) {
                $profile = $user->applicantProfile;
                $application->name = $profile->full_name;
                $application->email = $profile->email;
                $application->phone = $profile->phone;
            }
        }

        $application->expected_salary = $validated['expected_salary'] ?? null;

        // Handle resume upload
        if ($request->hasFile('resume')) {
            // Delete old resume if exists
            if ($application->resume_path && Storage::disk('public')->exists($application->resume_path)) {
                Storage::disk('public')->delete($application->resume_path);
            }

            $path = $request->file('resume')->store('application-resumes', 'public');
            $application->resume_path = $path;
        } elseif ($request->input('remove_resume') === '1') {
            // Remove resume
            if ($application->resume_path && Storage::disk('public')->exists($application->resume_path)) {
                Storage::disk('public')->delete($application->resume_path);
            }
            $application->resume_path = null;
        }

        // Handle photo upload (if your applications table has photo_path column)
        if ($request->hasFile('photo')) {
            // Delete old photo if exists
            if ($application->photo_path && Storage::disk('public')->exists($application->photo_path)) {
                Storage::disk('public')->delete($application->photo_path);
            }

            $path = $request->file('photo')->store('application-photos', 'public');
            $application->photo_path = $path;
        } elseif ($request->input('remove_photo') === '1') {
            // Remove photo
            if ($application->photo_path && Storage::disk('public')->exists($application->photo_path)) {
                Storage::disk('public')->delete($application->photo_path);
            }
            $application->photo_path = null;
        }

        $application->save();

        // Recalculate ATS score if resume was changed
        if ($request->hasFile('resume') || $request->input('remove_resume') === '1') {
            $application->recalculateAtsScoreInline();
        }

        return redirect()->route('backend.applications.show', $application->id)
            ->with('success', 'Application updated successfully.');
    }
    /**
     * Update single application status.
     */
    public function updateStatus(Request $request, Application $application)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Only employer who owns the job or admin can update status
        if (!$user->isAdmin() && $application->jobListing->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'status' => 'required|in:pending,reviewed,shortlisted,rejected,hired',
            'employer_notes' => 'nullable|string'
        ]);

        $application->update([
            'status' => $validated['status'],
            'employer_notes' => $validated['employer_notes'] ?? $application->employer_notes
        ]);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Status updated successfully',
                'application' => $application
            ]);
        }

        return redirect()->back()->with('success', 'Application status updated successfully.');
    }

    /**
     * Batch update application status.
     */
    public function batchUpdateStatus(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        if (!$user->isAdmin() && !$user->isEmployer()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'application_ids' => 'required|array|min:1',
            'application_ids.*' => 'integer|exists:applications,id',
            'status' => 'required|in:pending,reviewed,shortlisted,rejected,hired',
        ]);

        $query = Application::whereIn('id', $validated['application_ids']);

        if ($user->isEmployer()) {
            $query->whereHas('jobListing', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            });
        }

        $updated = $query->update(['status' => $validated['status']]);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => "Updated {$updated} application(s).",
                'count' => $updated
            ]);
        }

        return redirect()->back()->with('success', "Updated {$updated} application(s).");
    }

    /**
     * Delete single application (soft delete)
     */
    public function destroy(Application $application)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Job seeker can delete their own pending application
        if ($user->isJobSeeker()) {
            if ($application->user_id !== Auth::id()) {
                if (request()->wantsJson()) {
                    return response()->json(['error' => 'Unauthorized'], 403);
                }
                return redirect()->back()->with('error', 'You are not authorized to delete this application.');
            }
            if (!$application->isPending()) {
                if (request()->wantsJson()) {
                    return response()->json(['error' => 'Only pending applications can be withdrawn'], 400);
                }
                return redirect()->back()->with('error', 'Only pending applications can be withdrawn.');
            }

            // Soft delete for job seekers (withdraw)
            $application->delete();

            $message = 'Application withdrawn successfully.';

            if (request()->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => $message
                ]);
            }

            return redirect()->route('backend.applications.my-applications')
                ->with('success', $message);
        }

        // Employer can delete applications for their jobs
        if ($user->isEmployer()) {
            if ($application->jobListing->user_id !== $user->id) {
                if (request()->wantsJson()) {
                    return response()->json(['error' => 'Unauthorized'], 403);
                }
                return redirect()->back()->with('error', 'You can only delete applications for your own job listings.');
            }

            // Delete custom resume file if exists
            if ($application->resume_path && Storage::disk('public')->exists($application->resume_path)) {
                Storage::disk('public')->delete($application->resume_path);
            }

            $application->delete();

            $message = 'Application deleted successfully.';

            if (request()->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => $message
                ]);
            }

            return redirect()->back()->with('success', $message);
        }

        // Admin can delete any
        if ($user->isAdmin()) {
            // Delete custom resume file if exists
            if ($application->resume_path && Storage::disk('public')->exists($application->resume_path)) {
                Storage::disk('public')->delete($application->resume_path);
            }

            $application->delete();

            $message = 'Application deleted successfully.';

            if (request()->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => $message
                ]);
            }

            return redirect()->back()->with('success', $message);
        }

        if (request()->wantsJson()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        return redirect()->back()->with('error', 'You are not authorized to delete this application.');
    }

    /**
     * Batch delete applications (soft delete)
     */
    public function batchDelete(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        if (!$user->isAdmin() && !$user->isEmployer()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'application_ids' => 'required|array|min:1',
            'application_ids.*' => 'integer|exists:applications,id',
        ]);

        $query = Application::whereIn('id', $validated['application_ids']);

        if ($user->isEmployer()) {
            $query->whereHas('jobListing', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            });
        }

        $applications = $query->get();
        $deletedCount = 0;

        foreach ($applications as $application) {
            // Delete custom resume file if exists
            if ($application->resume_path) {
                Storage::disk('public')->delete($application->resume_path);
            }
            $application->delete();
            $deletedCount++;
        }

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => "Deleted {$deletedCount} application(s).",
                'count' => $deletedCount
            ]);
        }

        return redirect()->back()->with('success', "Deleted {$deletedCount} application(s).");
    }

    /**
     * Download single application resume
     */
    public function downloadResume(Application $application)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Check authorization
        if ($user->isJobSeeker() && $application->user_id !== Auth::id()) {
            abort(403);
        }

        if ($user->isEmployer() && $application->jobListing->user_id !== Auth::id()) {
            abort(403);
        }

        $resumeUrl = $application->resume_url;

        if (!$resumeUrl) {
            return redirect()->back()->with('error', 'No resume found.');
        }

        $path = str_replace('/storage/', '', $resumeUrl);
        $fullPath = storage_path('app/public/' . $path);

        if (!file_exists($fullPath)) {
            return redirect()->back()->with('error', 'Resume file not found.');
        }

        return response()->download($fullPath, $application->applicant_name . '_resume.pdf');
    }

    /**
     * Batch download resumes as ZIP
     */
    public function batchDownloadResumes(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        if (!$user->isAdmin() && !$user->isEmployer()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'application_ids' => 'required|array|min:1',
            'application_ids.*' => 'exists:applications,id',
        ]);

        $applications = Application::whereIn('id', $validated['application_ids']);

        if ($user->isEmployer()) {
            $applications->whereHas('jobListing', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            });
        }

        $applications = $applications->get();

        if ($applications->isEmpty()) {
            return redirect()->back()->with('error', 'No valid applications selected.');
        }

        // Create ZIP file
        $zipFileName = 'applications_' . date('Y-m-d_His') . '.zip';
        $zipPath = storage_path('app/temp/' . $zipFileName);

        // Create temp directory if not exists
        if (!file_exists(storage_path('app/temp'))) {
            mkdir(storage_path('app/temp'), 0755, true);
        }

        $zip = new ZipArchive();

        if ($zip->open($zipPath, ZipArchive::CREATE) !== true) {
            return redirect()->back()->with('error', 'Could not create ZIP file.');
        }

        foreach ($applications as $application) {
            $resumeUrl = $application->resume_url;

            if ($resumeUrl) {
                $path = str_replace('/storage/', '', $resumeUrl);
                $fullPath = storage_path('app/public/' . $path);

                if (file_exists($fullPath)) {
                    $filename = $application->applicant_name . '_' . basename($fullPath);
                    $zip->addFile($fullPath, $filename);
                }
            }
        }

        $zip->close();

        return response()->download($zipPath, $zipFileName)->deleteFileAfterSend(true);
    }

    /**
     * Recalculate ATS score for an application (with queue)
     */
    public function recalculateScore(Application $application)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Authorization
        if (!$user->isAdmin() && !($user->isEmployer() && $application->jobListing->user_id === $user->id)) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        try {
            // Check if calculation is stuck and handle it
            Log::info('ATS recalculation requested (inline)', [
                'application_id' => $application->id
            ]);

            $inlineSuccess = $application->recalculateAtsScoreInline();

            if ($inlineSuccess) {
                $message = 'ATS score recalculated successfully!';
            } else {
                $message = 'ATS score recalculation encountered an error. Please try again later.';
            }

            if (request()->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => $message
                ]);
            }

            return redirect()->back()->with('success', $message);
        } catch (\Exception $e) {
            Log::error('Failed to queue ATS recalculation: ' . $e->getMessage());

            if (request()->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'error' => 'Failed to queue recalculation.'
                ], 500);
            }

            return redirect()->back()->with('error', 'Failed to queue recalculation.');
        }
    }


    // Mail Thing
    /**
     * Show email modal content for single application
     */
    public function showEmailModal(Application $application)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Only employer who owns the job or admin can send emails
        if (!$user->isAdmin() && $application->jobListing->user_id !== $user->id) {
            abort(403);
        }

        return response()->json([
            'application' => [
                'id' => $application->id,
                'name' => $application->applicant_name,
                'email' => $application->applicant_email,
                'job_title' => $application->jobListing->title
            ],
            'default_subject' => "Interview Invitation - {$application->jobListing->title} Position",
            'default_message' => "We are pleased to inform you that you have been shortlisted for the position of {$application->jobListing->title}.\n\n" .
                "Next steps:\n" .
                "1. Please expect a call from our HR team within 3-5 business days\n" .
                "2. Prepare for the interview by reviewing the job requirements\n" .
                "3. Have your portfolio/experience ready for discussion\n\n" .
                "We look forward to speaking with you soon."
        ]);
    }

    /**
     * Send email to single application
     */
    public function sendEmail(Request $request, Application $application)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Eager load relationships needed for email template
        $application->load('jobListing.user');

        // Debug: Check if relationships are loaded
        if (!$application->jobListing) {
            Log::error('Application missing jobListing relationship', ['application_id' => $application->id]);
            return response()->json(['error' => 'Application job listing not found'], 404);
        }

        if (!$application->jobListing->user) {
            Log::error('JobListing missing user relationship', [
                'application_id' => $application->id,
                'job_listing_id' => $application->jobListing->id
            ]);
            return response()->json(['error' => 'Job listing owner not found'], 404);
        }

        // Only employer who owns the job or admin can send emails
        if (!$user->isAdmin() && $application->jobListing->user_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        try {
            // Validate that application has required email data
            if (!$application->applicant_email) {
                throw new \Exception('Application does not have a valid email address');
            }

            Log::info('Attempting to send email', [
                'application_id' => $application->id,
                'to_email' => $application->applicant_email,
                'subject' => $validated['subject'],
                'job_listing_id' => $application->jobListing->id,
                'job_title' => $application->jobListing->title,
                'company_name' => $application->jobListing->user->name ?? 'Unknown'
            ]);

            Mail::to($application->applicant_email)->send(
                new ShortlistedMail($application, $validated['subject'], $validated['message'])
            );

            // Also update status to shortlisted if not already
            if ($application->status !== 'shortlisted') {
                $application->update(['status' => 'shortlisted']);
            }

            Log::info('Email sent to shortlisted candidate', [
                'application_id' => $application->id,
                'email' => $application->applicant_email
            ]);

            if ($request->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Email sent successfully to ' . $application->applicant_name
                ]);
            }

            return redirect()->back()->with('success', 'Email sent successfully to ' . $application->applicant_name);
        } catch (\Exception $e) {
            Log::error('Failed to send email: ' . $e->getMessage(), [
                'application_id' => $application->id,
                'trace' => $e->getTraceAsString()
            ]);

            if ($request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'error' => 'Failed to send email: ' . $e->getMessage()
                ], 500);
            }

            return redirect()->back()->with('error', 'Failed to send email: ' . $e->getMessage());
        }
    }

    /**
     * Show bulk email modal
     */
    public function showBulkEmailModal(Request $request)
    {
        $validated = $request->validate([
            'application_ids' => 'required|array',
            'application_ids.*' => 'exists:applications,id'
        ]);

        $applications = Application::whereIn('id', $validated['application_ids'])
            ->with('jobListing')
            ->get();

        $jobTitle = $applications->first()?->jobListing->title ?? 'the position';
        $recipientCount = $applications->count();
        $recipientEmails = $applications->pluck('applicant_email')->implode(', ');

        return response()->json([
            'application_ids' => $validated['application_ids'],
            'recipient_count' => $recipientCount,
            'recipient_emails' => $recipientEmails,
            'job_title' => $jobTitle,
            'default_subject' => "Interview Invitation - {$jobTitle}",
            'default_message' => "We are pleased to inform you that you have been shortlisted for the position of {$jobTitle}.\n\n" .
                "Next steps:\n" .
                "1. Please expect a call from our HR team within 3-5 business days\n" .
                "2. Prepare for the interview by reviewing the job requirements\n" .
                "3. Have your portfolio/experience ready for discussion\n\n" .
                "We look forward to speaking with you soon."
        ]);
    }

    /**
     * Send bulk emails to multiple applications
     */
    public function sendBulkEmails(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $validated = $request->validate([
            'application_ids' => 'required|array',
            'application_ids.*' => 'exists:applications,id',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        $applications = Application::whereIn('id', $validated['application_ids'])
            ->with('jobListing.user')
            ->get();

        $successCount = 0;
        $failCount = 0;
        $failedEmails = [];

        foreach ($applications as $application) {
            try {
                // Validate that application has required email data
                if (!$application->applicant_email) {
                    throw new \Exception('No email address for applicant: ' . ($application->applicant_name ?? 'Unknown'));
                }

                Log::info('Attempting to send bulk email', [
                    'application_id' => $application->id,
                    'to_email' => $application->applicant_email,
                    'subject' => $validated['subject']
                ]);

                Mail::to($application->applicant_email)->send(
                    new ShortlistedMail($application, $validated['subject'], $validated['message'])
                );

                // Update status to shortlisted
                if ($application->status !== 'shortlisted') {
                    $application->update(['status' => 'shortlisted']);
                }

                $successCount++;

                Log::info('Bulk email sent successfully', [
                    'application_id' => $application->id,
                    'email' => $application->applicant_email
                ]);
            } catch (\Exception $e) {
                $failCount++;
                $failedEmails[] = [
                    'email' => $application->applicant_email,
                    'reason' => $e->getMessage()
                ];
                Log::error('Bulk email failed: ' . $e->getMessage(), [
                    'application_id' => $application->id,
                    'email' => $application->applicant_email,
                    'trace' => $e->getTraceAsString()
                ]);
            }
        }

        $message = "Emails sent: {$successCount} successful";
        if ($failCount > 0) {
            $message .= ", {$failCount} failed";
        }

        if ($request->wantsJson()) {
            return response()->json([
                'success' => $failCount === 0,
                'message' => $message,
                'success_count' => $successCount,
                'fail_count' => $failCount,
                'failed_emails' => $failedEmails
            ]);
        }

        return redirect()->back()->with('success', $message);
    }
}
