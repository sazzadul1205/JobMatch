<?php
// app/Http/Controllers/ApplicationController.php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\Job;
use App\Services\ATSService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ApplicationController extends Controller
{
    protected $atsService;

    public function __construct(ATSService $atsService)
    {
        $this->atsService = $atsService;
    }

    public function index()
    {
        $applications = Application::with('job', 'applicant')
            ->byScore()
            ->paginate(10);

        return response()->json($applications);
    }

    public function store(Request $request, Job $job)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'nullable|string',
            'resume' => 'required|file|mimes:pdf|max:5120', // 5MB max
        ]);

        // Store the resume
        $resumePath = $request->file('resume')->store('resumes', 'public');

        // Get full path for ATS analysis
        $fullPath = Storage::disk('public')->path($resumePath);

        // Run ATS analysis
        $atsResult = $this->atsService->analyzeResume($fullPath, $job);

        // Create application
        $application = Application::create([
            'job_id' => $job->id,
            'user_id' => Auth::id(),
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'resume_path' => $resumePath,
            'ats_score' => $atsResult,
            'matched_keywords' => $atsResult['matched_keywords'] ?? [],
            'missing_keywords' => $atsResult['missing_keywords'] ?? [],
            'status' => $atsResult['percentage'] >= 70 ? 'shortlisted' : 'pending',
        ]);

        return response()->json($application, 201);
    }

    public function show(Application $application)
    {
        return response()->json($application->load('job', 'applicant'));
    }

    public function updateStatus(Request $request, Application $application)
    {
        $request->validate([
            'status' => 'required|in:pending,reviewed,shortlisted,rejected,hired',
            'employer_notes' => 'nullable|string',
        ]);

        $application->update([
            'status' => $request->status,
            'employer_notes' => $request->employer_notes,
        ]);

        return response()->json($application);
    }

    public function destroy(Application $application)
    {
        // Delete the resume file
        if ($application->resume_path) {
            Storage::disk('public')->delete($application->resume_path);
        }

        $application->delete();
        return response()->json(['message' => 'Application deleted successfully']);
    }

    public function getJobApplications(Job $job)
    {
        $applications = $job->applications()
            ->with('applicant')
            ->byScore()
            ->paginate(10);

        return response()->json($applications);
    }
}
