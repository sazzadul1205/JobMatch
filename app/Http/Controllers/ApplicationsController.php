<?php

namespace App\Http\Controllers;

use App\Mail\ApplicationEmail;
use App\Models\Application;
use App\Models\JobListing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use ZipArchive;

class ApplicationsController extends Controller
{
    /**
     * Display all applications from all jobs
     */
    public function index(Request $request)
    {
        $query = Application::with(['jobListing', 'applicantProfile.user', 'statusTimelines']);

        // Filter by status
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        // Filter by job
        if ($request->has('job_id') && $request->job_id) {
            $query->where('job_listing_id', $request->job_id);
        }

        // Search by name or email
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $applications = $query->orderBy('created_at', 'desc')->paginate(20);

        // Get all jobs for filter dropdown
        $jobs = JobListing::where('is_active', true)->get(['id', 'title']);

        return inertia('Backend/Applications/Index', [
            'applications' => $applications,
            'jobs' => $jobs,
            'filters' => $request->only(['status', 'job_id', 'search'])
        ]);
    }

    /**
     * Display applications for a specific job
     */
    public function jobApplications(Request $request, $jobId)
    {
        $job = JobListing::with('employer', 'category')->findOrFail($jobId);

        $query = Application::with(['applicantProfile.user', 'statusTimelines'])
            ->where('job_listing_id', $jobId);

        // Filter by status
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        // Search by name or email
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $applications = $query->orderBy('created_at', 'desc')->paginate(20);

        // Status counts
        $statusCounts = [
            'pending' => Application::where('job_listing_id', $jobId)->where('status', 'pending')->count(),
            'shortlisted' => Application::where('job_listing_id', $jobId)->where('status', 'shortlisted')->count(),
            'rejected' => Application::where('job_listing_id', $jobId)->where('status', 'rejected')->count(),
            'hired' => Application::where('job_listing_id', $jobId)->where('status', 'hired')->count(),
        ];

        return inertia('Backend/Applications/JobApplications', [
            'job' => $job,
            'applications' => $applications,
            'statusCounts' => $statusCounts,
            'filters' => $request->only(['status', 'search'])
        ]);
    }

    /**
     * Display single application details with full data
     */
    public function show($id)
    {
        $application = Application::with([
            'jobListing' => function ($q) {
                $q->with(['employer', 'category', 'locations']);
            },
            'applicantProfile' => function ($q) {
                $q->with([
                    'user',
                    'jobHistories' => function ($q) {
                        $q->orderBy('starting_year', 'desc');
                    },
                    'educationHistories' => function ($q) {
                        $q->orderBy('passing_year', 'desc');
                    },
                    'achievements',
                    'cvs' => function ($q) {
                        $q->orderBy('order_position');
                    }
                ]);
            },
            'statusTimelines' => function ($q) {
                $q->orderBy('created_at', 'desc');
            }
        ])->findOrFail($id);

        // Extract ATS analysis data
        $atsAnalysis = null;
        if ($application->ats_score && isset($application->ats_score['analysis'])) {
            $atsAnalysis = $application->ats_score['analysis'];
        }

        return inertia('Backend/Applications/Show', [
            'application' => $application,
            'atsAnalysis' => $atsAnalysis
        ]);
    }

    /**
     * Update single application status
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,shortlisted,rejected,hired',
            'notes' => 'nullable|string'
        ]);

        $application = Application::findOrFail($id);
        $application->updateStatus($request->status, $request->notes);

        return back()->with('success', 'Application status updated successfully.');
    }

    /**
     * Bulk status update
     */
    public function bulkUpdateStatus(Request $request)
    {
        $request->validate([
            'application_ids' => 'required|array',
            'application_ids.*' => 'exists:applications,id',
            'status' => 'required|in:pending,shortlisted,rejected,hired',
            'notes' => 'nullable|string'
        ]);

        $applications = Application::whereIn('id', $request->application_ids)->get();

        DB::transaction(function () use ($applications, $request) {
            foreach ($applications as $application) {
                $application->updateStatus($request->status, $request->notes);
            }
        });

        return back()->with('success', count($applications) . ' applications updated successfully.');
    }

    /**
     * Download single application resume/CV
     */
    public function downloadResume($id)
    {
        $application = Application::findOrFail($id);
        $resumePath = $application->getActualResumePath();

        if (!$resumePath || !Storage::disk('public')->exists($resumePath)) {
            return back()->with('error', 'Resume file not found.');
        }

        // Get the original filename
        $originalName = 'resume_' . $application->id . '_' . $application->name;

        // Try to get original name from application or applicant CV
        if ($application->resume_path) {
            $originalName = basename($application->resume_path);
        } else {
            $primaryCv = $application->applicantProfile?->primaryCv;
            if ($primaryCv && $primaryCv->original_name) {
                $originalName = $primaryCv->original_name;
            } else {
                // Add extension if we can detect it
                $extension = pathinfo($resumePath, PATHINFO_EXTENSION);
                $originalName = $originalName . '.' . $extension;
            }
        }

        // Get the full path to the file
        $fullPath = Storage::disk('public')->path($resumePath);

        // Return file download response
        return response()->download($fullPath, $originalName);
    }

    /**
     * Bulk download resumes as ZIP
     */
    public function bulkDownloadResumes(Request $request)
    {
        $request->validate([
            'application_ids' => 'required|array',
            'application_ids.*' => 'exists:applications,id'
        ]);

        $applications = Application::whereIn('id', $request->application_ids)->get();

        if ($applications->isEmpty()) {
            return back()->with('error', 'No applications selected.');
        }

        // Create temp directory if not exists
        $tempDir = storage_path('app/temp');
        if (!is_dir($tempDir)) {
            mkdir($tempDir, 0755, true);
        }

        $zipFileName = 'applications_resumes_' . date('Y-m-d_His') . '.zip';
        $zipPath = $tempDir . '/' . $zipFileName;

        $zip = new ZipArchive();

        if ($zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
            return back()->with('error', 'Could not create ZIP file.');
        }

        $downloadedCount = 0;

        foreach ($applications as $application) {
            $resumePath = $application->getActualResumePath();

            if ($resumePath && Storage::disk('public')->exists($resumePath)) {
                $fullPath = Storage::disk('public')->path($resumePath);
                $fileContent = file_get_contents($fullPath);

                if ($fileContent !== false) {
                    // Create safe filename
                    $safeName = preg_replace('/[^a-zA-Z0-9_-]/', '_', $application->name);
                    $extension = pathinfo($resumePath, PATHINFO_EXTENSION);
                    $fileName = $safeName . '_' . $application->id . '.' . $extension;

                    $zip->addFromString($fileName, $fileContent);
                    $downloadedCount++;
                }
            }
        }

        $zip->close();

        if ($downloadedCount === 0) {
            if (file_exists($zipPath)) {
                unlink($zipPath);
            }
            return back()->with('error', 'No resume files found to download.');
        }

        return response()->download($zipPath, $zipFileName)->deleteFileAfterSend(true);
    }

    /**
     * Send email to single applicant with template
     */
    public function sendEmail(Request $request, $id)
    {
        $request->validate([
            'subject' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $application = Application::with(['jobListing', 'applicantProfile'])->findOrFail($id);

        // Get the recipient email - check multiple possible fields
        $recipientEmail = $application->email ?? $application->applicantProfile?->email ?? $application->user?->email;

        if (!$recipientEmail) {
            return response()->json([
                'success' => false,
                'message' => 'No email address found for this applicant.'
            ], 400);
        }

        $jobTitle = $application->jobListing->title ?? null;
        $companyName = $application->jobListing->employer->name ?? config('app.name');

        try {
            // IMPORTANT: Use Mail::to() before send()
            Mail::to($recipientEmail)->send(new ApplicationEmail(
                $request->subject,
                $request->content,
                $application->name,
                $jobTitle,
                $companyName,
                $application->id
            ));

            return response()->json([
                'success' => true,
                'message' => 'Email sent successfully to ' . $application->name
            ]);
        } catch (\Exception $e) {
            Log::error('Email sending failed: ' . $e->getMessage(), [
                'application_id' => $id,
                'recipient' => $recipientEmail
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to send email: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Send bulk emails to multiple applicants with template
     */
    public function sendBulkEmail(Request $request)
    {
        $request->validate([
            'application_ids' => 'required|array',
            'application_ids.*' => 'exists:applications,id',
            'subject' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $applications = Application::with(['jobListing', 'applicantProfile'])
            ->whereIn('id', $request->application_ids)
            ->get();

        if ($applications->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'No applications found.'
            ], 404);
        }

        $successCount = 0;
        $failedCount = 0;
        $failedEmails = [];

        foreach ($applications as $application) {
            try {
                // Get the recipient email
                $recipientEmail = $application->email ?? $application->applicantProfile?->email ?? $application->user?->email;

                if (!$recipientEmail) {
                    $failedCount++;
                    $failedEmails[] = $application->name . ' (No email address)';
                    continue;
                }

                $jobTitle = $application->jobListing->title ?? null;
                $companyName = $application->jobListing->employer->name ?? config('app.name');

                // IMPORTANT: Use Mail::to() before send()
                Mail::to($recipientEmail)->send(new ApplicationEmail(
                    $request->subject,
                    $request->content,
                    $application->name,
                    $jobTitle,
                    $companyName,
                    $application->id
                ));
                $successCount++;
            } catch (\Exception $e) {
                $failedCount++;
                $failedEmails[] = $application->email ?? $application->name;
                Log::error('Bulk email failed for application ' . $application->id . ': ' . $e->getMessage());
            }
        }

        if ($failedCount > 0) {
            return response()->json([
                'success' => true,
                'message' => "Sent to {$successCount} applicant(s). Failed: {$failedCount}",
                'failed_emails' => $failedEmails
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => "Email sent successfully to {$successCount} applicant(s)."
        ]);
    }
}
