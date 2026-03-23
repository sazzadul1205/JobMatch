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
use Inertia\Inertia;

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
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('applications/index', [
            'applications' => $applications,
            'filters' => $request->only(['status', 'job_listing_id', 'min_score']),
            'userRole' => $user->role,
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
            return redirect()->back()->with('error', 'This job is no longer accepting applications.');
        }

        // Only job seekers can apply
        if (!$user->isJobSeeker()) {
            return redirect()->back()->with('error', 'Only job seekers can apply for jobs.');
        }

        // Check if already applied
        $existingApplication = Application::where('job_listing_id', $jobListing->id)
            ->where('user_id', Auth::id())
            ->first();

        if ($existingApplication) {
            return redirect()->back()->with('error', 'You have already applied for this job.');
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

        return redirect()->route('backend.application.show', $application)
            ->with('success', 'Application submitted successfully. Your ATS score is being calculated.');
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
            return redirect()->route('backend.application.index')
                ->with('error', 'Unauthorized to view this application.');
        }

        if ($user->isEmployer() && $application->jobListing->user_id !== Auth::id()) {
            return redirect()->route('backend.application.index')
                ->with('error', 'Unauthorized to view this application.');
        }

        $application->load(['jobListing', 'applicant']);

        return Inertia::render('applications/show', [
            'application' => $application,
            'userRole' => $user->role,
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
            return redirect()->back()->with('error', 'Unauthorized to update this application.');
        }

        $validated = $request->validate([
            'status' => 'required|in:pending,reviewed,shortlisted,rejected,hired',
            'employer_notes' => 'nullable|string'
        ]);

        $application->update([
            'status' => $validated['status'],
            'employer_notes' => $validated['employer_notes'] ?? $application->employer_notes
        ]);

        return redirect()->back()->with('success', 'Application status updated successfully.');
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
            return redirect()->back()->with('error', 'Unauthorized to download this resume.');
        }

        if ($user->isEmployer() && $application->jobListing->user_id !== Auth::id()) {
            return redirect()->back()->with('error', 'Unauthorized to download this resume.');
        }

        if (!Storage::disk('public')->exists($application->resume_path)) {
            return redirect()->back()->with('error', 'Resume file not found.');
        }

        $resumeAbsolutePath = Storage::disk('public')->path($application->resume_path);

        return response()->download($resumeAbsolutePath, $application->name . '_resume.pdf');
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
            return redirect()->back()->with('error', 'Unauthorized to delete this application.');
        }

        // Delete resume file
        Storage::disk('public')->delete($application->resume_path);

        $application->delete();

        return redirect()->route('backend.application.index')
            ->with('success', 'Application withdrawn successfully.');
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
            return redirect()->back()->with('error', 'Unauthorized.');
        }

        try {
            $application->calculateATSScore();

            return redirect()->back()->with('success', 'ATS score recalculated successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to recalculate score: ' . $e->getMessage());
        }
    }

    /**
     * Analytics dashboard for web (Inertia)
     */
    public function analyticsDashboard(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $stats = $this->getATSStatsData();

        return Inertia::render('analytics/dashboard', [
            'stats' => $stats,
            'userRole' => $user->role,
        ]);
    }

    /**
     * Job ATS analysis for web (Inertia)
     */
    public function jobATSAnalysis(JobListing $jobListing)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Check authorization
        if (!$user->isAdmin() && $jobListing->user_id !== $user->id) {
            return redirect()->route('backend.analytics.dashboard')
                ->with('error', 'Unauthorized.');
        }

        $keywordAnalysis = $this->getKeywordAnalysisData($jobListing);
        $topCandidates = $this->getTopCandidatesData($jobListing);

        return Inertia::render('analytics/job-analysis', [
            'job' => $jobListing,
            'keywordAnalysis' => $keywordAnalysis,
            'topCandidates' => $topCandidates,
            'userRole' => $user->role,
        ]);
    }

    /**
     * Get ATS statistics for employer (API endpoint)
     */
    public function getATSStats()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $applications = Application::whereHas('jobListing', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->get();

        $stats = [
            'total_applications' => $applications->count(),
            'average_ats_score' => $applications->avg(function ($app) {
                return $app->getAtsScorePercentage() ?? 0;
            }),
            'score_distribution' => [
                'excellent' => $applications->filter(function ($app) {
                    return $app->getAtsScorePercentage() >= 80;
                })->count(),
                'good' => $applications->filter(function ($app) {
                    $score = $app->getAtsScorePercentage();
                    return $score >= 60 && $score < 80;
                })->count(),
                'fair' => $applications->filter(function ($app) {
                    $score = $app->getAtsScorePercentage();
                    return $score >= 40 && $score < 60;
                })->count(),
                'poor' => $applications->filter(function ($app) {
                    return $app->getAtsScorePercentage() < 40;
                })->count(),
            ],
            'top_skills' => $this->getTopSkillsFromApplications($applications),
            'applications_by_status' => [
                'pending' => $applications->where('status', 'pending')->count(),
                'reviewed' => $applications->where('status', 'reviewed')->count(),
                'shortlisted' => $applications->where('status', 'shortlisted')->count(),
                'rejected' => $applications->where('status', 'rejected')->count(),
                'hired' => $applications->where('status', 'hired')->count(),
            ]
        ];

        if (request()->expectsJson()) {
            return response()->json([
                'success' => true,
                'data' => $stats
            ]);
        }

        return $stats;
    }

    /**
     * Helper method to get top skills from applications
     */
    private function getTopSkillsFromApplications($applications)
    {
        $allSkills = [];

        foreach ($applications as $application) {
            $atsScore = $application->ats_score ?? [];
            if (isset($atsScore['extracted_skills'])) {
                $allSkills = array_merge($allSkills, $atsScore['extracted_skills']);
            }
        }

        $skillCounts = array_count_values($allSkills);
        arsort($skillCounts);

        return array_slice($skillCounts, 0, 10, true);
    }

    /**
     * Get keyword analysis data
     */
    private function getKeywordAnalysisData(JobListing $jobListing)
    {
        $applications = $jobListing->applications()->get();

        $keywordStats = [];
        $jobKeywords = $jobListing->keywords ?? [];

        foreach ($jobKeywords as $keyword) {
            $matchCount = $applications->filter(function ($app) use ($keyword) {
                return in_array($keyword, $app->matched_keywords ?? []);
            })->count();

            $keywordStats[] = [
                'keyword' => $keyword,
                'match_count' => $matchCount,
                'match_percentage' => $applications->count() > 0
                    ? round(($matchCount / $applications->count()) * 100, 2)
                    : 0
            ];
        }

        return [
            'total_applications' => $applications->count(),
            'keyword_analysis' => $keywordStats,
            'most_common_missing' => collect($keywordStats)
                ->filter(function ($stat) {
                    return $stat['match_percentage'] < 30;
                })
                ->sortBy('match_percentage')
                ->take(5)
                ->values()
        ];
    }

    /**
     * Get top candidates data
     */
    private function getTopCandidatesData(JobListing $jobListing)
    {
        return $jobListing->applications()
            ->whereNotNull('ats_score')
            ->orderByRaw('JSON_EXTRACT(ats_score, "$.total") DESC')
            ->limit(10)
            ->get();
    }

    /**
     * Get ATS statistics data
     */
    private function getATSStatsData()
    {
        return $this->getATSStats();
    }
}
