<?php

namespace App\Http\Controllers;

use App\Mail\ApplicationEmail;
use App\Models\Application;
use App\Models\JobListing;
use App\Services\ATSService;
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
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        // Filter by minimum ATS score
        if ($request->has('min_score') && $request->min_score !== '') {
            $minScore = (int) $request->min_score;
            $query->where(function ($q) use ($minScore) {
                $q->whereRaw('JSON_EXTRACT(ats_score, "$.percentage") >= ?', [$minScore])
                    ->orWhereRaw('ats_score >= ?', [$minScore]);
            });
        }

        // Sort by ATS score if requested
        $sortField = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');

        if ($sortField === 'ats_score') {
            $query->orderByRaw('COALESCE(JSON_EXTRACT(ats_score, "$.percentage"), CAST(ats_score AS UNSIGNED), 0) ' . $sortDirection);
        } else {
            $allowedSortFields = ['created_at', 'name', 'email', 'expected_salary', 'years_of_experience', 'status'];
            if (in_array($sortField, $allowedSortFields)) {
                $query->orderBy($sortField, $sortDirection);
            } else {
                $query->orderBy('created_at', 'desc');
            }
        }

        $applications = $query->paginate(20)->withQueryString();

        // Calculate ATS score for each application
        $applications->getCollection()->transform(function ($application) {
            $atsScore = null;

            if ($application->ats_score) {
                if (is_array($application->ats_score)) {
                    $atsScore = $application->ats_score['percentage'] ?? $application->ats_score['total'] ?? null;
                } elseif (is_numeric($application->ats_score)) {
                    $atsScore = $application->ats_score;
                } elseif (is_string($application->ats_score)) {
                    $decoded = json_decode($application->ats_score, true);
                    if ($decoded) {
                        $atsScore = $decoded['percentage'] ?? $decoded['total'] ?? null;
                    }
                }
            }

            $application->calculated_ats_score = $atsScore;

            return $application;
        });

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
            'filters' => $request->only(['status', 'search', 'min_score', 'sort', 'direction'])
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
     * Delete a single application (soft delete)
     */
    public function destroy($id)
    {
        $application = Application::findOrFail($id);
        $application->delete();

        return back()->with('success', 'Application deleted successfully.');
    }

    /**
     * Bulk delete applications (soft delete)
     */
    public function bulkDelete(Request $request)
    {
        $request->validate([
            'application_ids' => 'required|array',
            'application_ids.*' => 'exists:applications,id',
        ]);

        $deleted = Application::whereIn('id', $request->application_ids)->delete();

        return back()->with('success', $deleted . ' applications deleted successfully.');
    }

    /**
     * Download single application resume/CV
     */
    public function downloadResume($id)
    {
        $application = Application::findOrFail($id);
        $resumePath = $application->getActualResumePath();

        if ($resumePath) {
            // Normalize stored paths (some older records may store URL-encoded paths or include `storage/` prefix)
            $resumePath = urldecode($resumePath);
            $resumePath = ltrim($resumePath, '/');
            if (str_starts_with($resumePath, 'storage/')) {
                $resumePath = substr($resumePath, strlen('storage/'));
            }
        }

        if (!$resumePath || !Storage::disk('public')->exists($resumePath)) {
            return back()->with('error', 'Resume file not found.');
        }

        // Get the extension from the actual file
        $extension = pathinfo($resumePath, PATHINFO_EXTENSION);

        // Sanitize the applicant's name for use as a filename
        $applicantName = preg_replace('/[^a-zA-Z0-9\s_-]/', '', $application->name);
        $applicantName = str_replace(' ', '_', trim($applicantName));

        // Create the filename using the applicant's name
        $originalName = 'Resume_' . $applicantName . '.' . $extension;

        // Return file download response with a clean filename
        $fullPath = Storage::disk('public')->path($resumePath);
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

    /**
     * Download applications as CSV with filters
     */
    public function exportApplications(Request $request, $jobId = null)
    {
        $request->validate([
            'status' => 'nullable|in:pending,shortlisted,rejected,hired',
            'search' => 'nullable|string',
            'format' => 'required|in:csv,xlsx',
        ]);

        $status = $request->status;
        $search = $request->search;
        $format = $request->format;

        // Build query
        $query = Application::with(['jobListing.employer', 'applicantProfile']);

        if ($jobId) {
            $query->where('job_listing_id', $jobId);
            $job = JobListing::find($jobId);
            $filename = $job ? $this->sanitizeFilename($job->title) : 'job_applications';
        } else {
            $filename = 'all_applications';
        }

        // Apply filters
        if ($status) {
            $query->where('status', $status);
            $filename .= '_' . $status;
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
            $filename .= '_filtered';
        }

        $applications = $query->orderBy('created_at', 'desc')->get();

        if ($applications->isEmpty()) {
            return back()->with('error', 'No applications found to export.');
        }

        $timestamp = date('Y-m-d_His');
        $filename .= "_{$timestamp}";

        // Prepare CSV data
        $csvData = $this->prepareExportData($applications);

        // Create CSV file
        $output = fopen('php://temp', 'w');

        // Add UTF-8 BOM for Excel compatibility
        fprintf($output, chr(0xEF) . chr(0xBB) . chr(0xBF));

        // Add headers
        fputcsv($output, array_keys($csvData[0]));

        // Add data rows
        foreach ($csvData as $row) {
            fputcsv($output, $row);
        }

        rewind($output);
        $csvContent = stream_get_contents($output);
        fclose($output);

        // For XLSX format, we'll just send as CSV but with .xlsx extension
        // (Excel can open CSV files, but we'll note that it's CSV format)
        $extension = $format === 'xlsx' ? 'xlsx' : 'csv';
        $contentType = $format === 'xlsx' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' : 'text/csv';

        return response($csvContent, 200, [
            'Content-Type' => $contentType,
            'Content-Disposition' => "attachment; filename=\"{$filename}.{$extension}\"",
            'Cache-Control' => 'no-cache, no-store, must-revalidate',
            'Pragma' => 'no-cache',
            'Expires' => '0',
        ]);
    }

    /**
     * Export single application data
     */
    public function exportSingleApplication(Request $request, $id)
    {
        $request->validate([
            'format' => 'required|in:csv,xlsx',
        ]);

        $application = Application::with([
            'jobListing.employer',
            'jobListing.category',
            'jobListing.locations',
            'applicantProfile.user',
            'applicantProfile.jobHistories' => function ($q) {
                $q->orderBy('starting_year', 'desc');
            },
            'applicantProfile.educationHistories' => function ($q) {
                $q->orderBy('passing_year', 'desc');
            },
            'applicantProfile.achievements',
            'statusTimelines'
        ])->findOrFail($id);

        $format = $request->format;
        $filename = "application_{$application->id}_" . $this->sanitizeFilename($application->name) . "_" . date('Y-m-d_His');

        // Prepare detailed export data
        $exportData = $this->prepareSingleApplicationExport($application);

        // Create CSV
        $output = fopen('php://temp', 'w');

        // Add UTF-8 BOM
        fprintf($output, chr(0xEF) . chr(0xBB) . chr(0xBF));

        // Write data sections
        foreach ($exportData as $section => $data) {
            // Add section header
            fputcsv($output, [strtoupper($section)]);
            fputcsv($output, []); // Empty line

            if (!empty($data) && is_array($data)) {
                // Check if it's associative or indexed
                if (isset($data[0]) && is_array($data[0])) {
                    // Multiple rows (like work history)
                    if (!empty($data)) {
                        // Add headers from first item
                        fputcsv($output, array_keys($data[0]));
                        // Add data rows
                        foreach ($data as $row) {
                            fputcsv($output, $row);
                        }
                    }
                } else {
                    // Single row data
                    fputcsv($output, array_keys($data));
                    fputcsv($output, array_values($data));
                }
            }

            fputcsv($output, []); // Empty line between sections
        }

        rewind($output);
        $csvContent = stream_get_contents($output);
        fclose($output);

        $extension = $format === 'xlsx' ? 'xlsx' : 'csv';
        $contentType = $format === 'xlsx' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' : 'text/csv';

        return response($csvContent, 200, [
            'Content-Type' => $contentType,
            'Content-Disposition' => "attachment; filename=\"{$filename}.{$extension}\"",
        ]);
    }

    /**
     * Prepare export data for multiple applications
     */
    private function prepareExportData($applications)
    {
        $exportData = [];

        foreach ($applications as $app) {
            // Get ATS score
            $atsScore = 'N/A';
            if ($app->ats_score) {
                if (is_array($app->ats_score) && isset($app->ats_score['percentage'])) {
                    $atsScore = $app->ats_score['percentage'] . '%';
                } elseif (is_numeric($app->ats_score)) {
                    $atsScore = $app->ats_score . '%';
                }
            }

            $exportData[] = [
                'Application ID' => $app->id,
                'Name' => $app->name,
                'Email' => $app->email,
                'Phone' => $app->phone ?? 'N/A',
                'Status' => ucfirst($app->status),
                'Applied Date' => $app->created_at ? $app->created_at->format('Y-m-d H:i:s') : 'N/A',
                'Job Title' => $app->jobListing->title ?? 'N/A',
                'Company' => $app->jobListing->employer->name ?? 'N/A',
                'Expected Salary (BDT)' => $app->expected_salary ? number_format($app->expected_salary, 0) : 'N/A',
                'Years of Experience' => $app->years_of_experience ?? 'N/A',
                'ATS Score' => $atsScore,
                'Cover Letter Preview' => $app->cover_letter ? substr(str_replace(["\n", "\r"], ' ', $app->cover_letter), 0, 200) . '...' : 'N/A',
                'Current Location' => $app->current_location ?? 'N/A',
                'Current Salary (BDT)' => $app->current_salary ? number_format($app->current_salary, 0) : 'N/A',
                'Notice Period (Days)' => $app->notice_period_days ?? 'N/A',
                'LinkedIn URL' => $app->linkedin_url ?? 'N/A',
                'Portfolio URL' => $app->portfolio_url ?? 'N/A',
                'Additional Info' => $app->additional_info ? substr(str_replace(["\n", "\r"], ' ', $app->additional_info), 0, 200) : 'N/A',
            ];
        }

        return $exportData;
    }

    /**
     * Prepare detailed single application export
     */
    private function prepareSingleApplicationExport($application)
    {
        // Get ATS analysis
        $atsAnalysis = 'N/A';
        if ($application->ats_score) {
            if (is_array($application->ats_score)) {
                if (isset($application->ats_score['analysis'])) {
                    $atsAnalysis = substr(str_replace(["\n", "\r"], ' ', json_encode($application->ats_score['analysis'])), 0, 500);
                } elseif (isset($application->ats_score['percentage'])) {
                    $atsAnalysis = "Score: {$application->ats_score['percentage']}%";
                    if (isset($application->ats_score['feedback'])) {
                        $atsAnalysis .= " - Feedback: " . substr($application->ats_score['feedback'], 0, 200);
                    }
                }
            }
        }

        $data = [
            'APPLICATION DETAILS' => [
                'Application ID' => $application->id,
                'Name' => $application->name,
                'Email' => $application->email,
                'Phone' => $application->phone ?? 'N/A',
                'Status' => ucfirst($application->status),
                'Applied Date' => $application->created_at ? $application->created_at->format('Y-m-d H:i:s') : 'N/A',
                'Last Updated' => $application->updated_at ? $application->updated_at->format('Y-m-d H:i:s') : 'N/A',
                'Expected Salary (BDT)' => $application->expected_salary ? number_format($application->expected_salary, 0) : 'N/A',
                'Years of Experience' => $application->years_of_experience ?? 'N/A',
                'Current Location' => $application->current_location ?? 'N/A',
                'Current Salary (BDT)' => $application->current_salary ? number_format($application->current_salary, 0) : 'N/A',
                'Notice Period (Days)' => $application->notice_period_days ?? 'N/A',
                'LinkedIn URL' => $application->linkedin_url ?? 'N/A',
                'Portfolio URL' => $application->portfolio_url ?? 'N/A',
                'Cover Letter' => $application->cover_letter ? str_replace(["\n", "\r"], ' ', $application->cover_letter) : 'N/A',
                'Additional Info' => $application->additional_info ?? 'N/A',
                'ATS Analysis' => $atsAnalysis,
            ],
            'JOB DETAILS' => [
                'Job Title' => $application->jobListing->title ?? 'N/A',
                'Job Description' => $application->jobListing->description ? substr(str_replace(["\n", "\r"], ' ', $application->jobListing->description), 0, 500) : 'N/A',
                'Company Name' => $application->jobListing->employer->name ?? 'N/A',
                'Category' => $application->jobListing->category->name ?? 'N/A',
                'Job Type' => $application->jobListing->job_type ?? 'N/A',
                'Employment Status' => $application->jobListing->employment_status ?? 'N/A',
                'Min Salary (BDT)' => $application->jobListing->salary_min ? number_format($application->jobListing->salary_min, 0) : 'N/A',
                'Max Salary (BDT)' => $application->jobListing->salary_max ? number_format($application->jobListing->salary_max, 0) : 'N/A',
                'Locations' => $application->jobListing->locations ? $application->jobListing->locations->pluck('name')->implode(', ') : 'N/A',
                'Job Posted Date' => $application->jobListing->created_at ? $application->jobListing->created_at->format('Y-m-d') : 'N/A',
                'Job Deadline' => $application->jobListing->application_deadline ? $application->jobListing->application_deadline->format('Y-m-d') : 'N/A',
            ],
            'WORK HISTORY' => [],
            'EDUCATION' => [],
            'ACHIEVEMENTS' => [],
            'STATUS TIMELINE' => [],
        ];

        // Add work history
        if ($application->applicantProfile && $application->applicantProfile->jobHistories) {
            foreach ($application->applicantProfile->jobHistories as $job) {
                $data['WORK HISTORY'][] = [
                    'Company' => $job->company_name,
                    'Designation' => $job->designation,
                    'Start Year' => $job->starting_year,
                    'End Year' => $job->ending_year ?? 'Present',
                    'Current Job' => $job->is_current ? 'Yes' : 'No',
                    'Responsibilities' => substr(str_replace(["\n", "\r"], ' ', $job->responsibilities ?? ''), 0, 200),
                ];
            }
        }

        // Add education
        if ($application->applicantProfile && $application->applicantProfile->educationHistories) {
            foreach ($application->applicantProfile->educationHistories as $edu) {
                $data['EDUCATION'][] = [
                    'Degree' => $edu->degree,
                    'Institution' => $edu->institution,
                    'Major' => $edu->major ?? 'N/A',
                    'Passing Year' => $edu->passing_year,
                    'Result' => $edu->result ?? 'N/A',
                ];
            }
        }

        // Add achievements
        if ($application->applicantProfile && $application->applicantProfile->achievements) {
            foreach ($application->applicantProfile->achievements as $achievement) {
                $data['ACHIEVEMENTS'][] = [
                    'Title' => $achievement->title,
                    'Description' => substr(str_replace(["\n", "\r"], ' ', $achievement->description ?? ''), 0, 200),
                    'Date' => $achievement->date ?? 'N/A',
                ];
            }
        }

        // Add status timeline
        if ($application->statusTimelines) {
            foreach ($application->statusTimelines as $timeline) {
                $data['STATUS TIMELINE'][] = [
                    'Status' => ucfirst($timeline->status),
                    'Changed By' => $timeline->changed_by ?? 'System',
                    'Notes' => $timeline->notes ?? 'N/A',
                    'Date' => $timeline->created_at ? $timeline->created_at->format('Y-m-d H:i:s') : 'N/A',
                ];
            }
        }

        return $data;
    }

    /**
     * Recalculate ATS score for an application
     */
    public function recalculateAts($id)
    {
        $application = Application::with('jobListing')->findOrFail($id);

        if (!$application->jobListing) {
            $message = 'Associated job listing not found';

            // Inertia requests must receive an Inertia-compatible response (typically a redirect).
            if (request()->header('X-Inertia')) {
                return redirect()->back()->with('error', $message);
            }

            return response()->json([
                'message' => $message
            ], 404);
        }

        try {
            $atsService = new ATSService();
            $atsScore = $atsService->calculateScore($application, $application->jobListing);

            // Update the application with the new ATS score
            $application->ats_score = $atsScore;
            $application->save();

            // Inertia requests must receive an Inertia-compatible response (typically a redirect).
            if (request()->header('X-Inertia')) {
                return redirect()->back()->with('success', 'ATS score recalculated successfully');
            }

            return response()->json([
                'message' => 'ATS score recalculated successfully',
                'ats_score' => $atsScore
            ]);
        } catch (\Exception $e) {
            Log::error('Error recalculating ATS score: ' . $e->getMessage(), [
                'application_id' => $id
            ]);

            $message = 'Failed to recalculate ATS score: ' . $e->getMessage();

            // Inertia requests must receive an Inertia-compatible response (typically a redirect).
            if (request()->header('X-Inertia')) {
                return redirect()->back()->with('error', $message);
            }

            return response()->json([
                'message' => $message
            ], 500);
        }
    }

    /**
     * Prepare export data for a single application
     */
    private function sanitizeFilename(string $filename): string
    {
        $filename = preg_replace('/[^a-zA-Z0-9\s_-]/', '', $filename);
        $filename = str_replace(' ', '_', $filename);
        $filename = preg_replace('/_+/', '_', $filename);
        $filename = trim($filename, '_');

        return substr($filename, 0, 100) ?: 'file';
    }
}
