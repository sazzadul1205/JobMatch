<?php
// app/Http/Controllers/JobListingController.php

namespace App\Http\Controllers;

use App\Models\JobListing;
use App\Models\JobCategory;
use App\Models\Location;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class JobListingController extends Controller
{
    /**
     * Display a listing of job listings
     */
    public function index()
    {
        // Update statuses before displaying
        $this->updateJobStatuses();

        // This will include soft-deleted records
        $jobListings = JobListing::withTrashed()
            ->with(['category', 'location', 'user'])
            ->withCount('applications') // Add this line to get applications count
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Backend/JobListings/Index', [
            'jobListings' => $jobListings
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
        $data = $request->all();

        // Generate slug
        $data['slug'] = Str::slug($data['title'] ?? 'job');

        $originalSlug = $data['slug'];
        $counter = 1;

        while (JobListing::where('slug', $data['slug'])->exists()) {
            $data['slug'] = $originalSlug . '-' . $counter;
            $counter++;
        }

        $data['user_id'] = Auth::id();

        // Apply initial status based on dates
        $data['is_active'] = $this->determineInitialStatus($data);

        JobListing::create($data);

        return redirect()->route('backend.listing.index')
            ->with('success', 'Job listing created successfully');
    }

    /**
     * Display the specified job listing
     */
    public function show(JobListing $jobListing)
    {
        $jobListing->load(['category', 'location', 'user']);

        return Inertia::render('Backend/JobListings/Show', [
            'jobListing' => $jobListing
        ]);
    }

    /**
     * Show the form for editing the specified job listing
     */
    public function edit(JobListing $jobListing)
    {
        $categories = JobCategory::active()->orderBy('name')->get();
        $locations = Location::active()->orderBy('name')->get();

        return Inertia::render('Backend/JobListings/Edit', [
            'jobListing' => $jobListing,
            'categories' => $categories,
            'locations' => $locations
        ]);
    }

    /**
     * Update the specified job listing
     */
    public function update(Request $request, JobListing $jobListing)
    {
        $data = $request->all();

        // Update slug if title changed
        if (isset($data['title']) && $jobListing->title !== $data['title']) {
            $data['slug'] = Str::slug($data['title']);

            $originalSlug = $data['slug'];
            $counter = 1;

            while (
                JobListing::where('slug', $data['slug'])
                ->where('id', '!=', $jobListing->id)
                ->exists()
            ) {
                $data['slug'] = $originalSlug . '-' . $counter;
                $counter++;
            }
        }

        // Apply automatic status update based on dates if is_active is not explicitly set
        if (!isset($data['is_active']) || $data['is_active'] === null) {
            $data['is_active'] = $this->determineStatusFromDates($data, $jobListing);
        }

        $jobListing->update($data);

        return redirect()->route('backend.listing.index')
            ->with('success', 'Job listing updated successfully');
    }

    /**
     * Remove the specified job listing
     */
    public function destroy(JobListing $jobListing)
    {
        // Check if there are applications before deleting
        if ($jobListing->applications()->count() > 0) {
            return redirect()->route('backend.listing.index')
                ->with('error', 'Cannot delete job listing with existing applications. Consider deactivating it instead.');
        }

        $jobListing->delete();

        return redirect()->route('backend.listing.index')
            ->with('success', 'Job listing moved to trash');
    }

    /**
     * Toggle active status
     */
    public function toggleActive(JobListing $jobListing)
    {
        $jobListing->update([
            'is_active' => !$jobListing->is_active
        ]);

        $status = $jobListing->is_active ? 'activated' : 'deactivated';

        return back()->with('success', "Job listing {$status} successfully");
    }

    /**
     * Display applications for a job listing
     */
    public function applications(JobListing $jobListing)
    {
        $applications = $jobListing->applications()
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Backend/JobListings/Applications', [
            'jobListing' => $jobListing,
            'applications' => $applications
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

        // Auto-activate jobs that have reached their schedule start date
        $activated = JobListing::where('is_active', false)
            ->whereNotNull('schedule_start_date')
            ->where('schedule_start_date', '<=', $now)
            ->update(['is_active' => true]);

        // Auto-deactivate jobs that have passed their application deadline
        $deactivated = JobListing::where('is_active', true)
            ->whereNotNull('application_deadline')
            ->where('application_deadline', '<', $now)
            ->update(['is_active' => false]);

        // Handle jobs with both dates
        $bothDeactivated = JobListing::where('is_active', true)
            ->whereNotNull('application_deadline')
            ->whereNotNull('schedule_start_date')
            ->where('application_deadline', '<', $now)
            ->where('schedule_start_date', '>', $now)
            ->update(['is_active' => false]);

        Log::info("Job status update completed: {$activated} activated, {$deactivated} deactivated, {$bothDeactivated} both deactivated");

        return true;
    }
    /**
     * Determine initial status when creating a new job
     */
    protected function determineInitialStatus(array $data)
    {
        $now = Carbon::now();

        // If is_active is explicitly set in the request, use that
        if (isset($data['is_active'])) {
            return $data['is_active'];
        }

        // Check if there's an application deadline that's already passed
        if (isset($data['application_deadline']) && $data['application_deadline']) {
            $deadline = Carbon::parse($data['application_deadline']);
            if ($deadline < $now) {
                return false; // Job is already expired
            }
        }

        // Check schedule start date
        if (isset($data['schedule_start_date']) && $data['schedule_start_date']) {
            $startDate = Carbon::parse($data['schedule_start_date']);

            // If start date is in the future, keep inactive until it arrives
            if ($startDate > $now) {
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

        // Use new start date if provided, otherwise use existing
        $startDate = isset($data['schedule_start_date']) && $data['schedule_start_date']
            ? Carbon::parse($data['schedule_start_date'])
            : ($existingJob->schedule_start_date ? Carbon::parse($existingJob->schedule_start_date) : null);

        // Check if deadline is passed
        if ($deadline && $deadline < $now) {
            return false;
        }

        // Check if start date is in the future
        if ($startDate && $startDate > $now) {
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

        $jobListing->restore();

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

        $jobListing->forceDelete();

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

        $count = JobListing::whereIn('id', $validated['job_ids'])
            ->whereNull('deleted_at')
            ->delete();

        return redirect()->back()->with('success', "{$count} job listing(s) moved to trash.");
    }
}
