<?php
// app/Http/Controllers/ProfileCompletionController.php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use App\Models\ApplicantCv;
use App\Models\JobHistory;
use App\Models\Achievement;
use Illuminate\Http\Request;
use App\Models\ApplicantProfile;
use App\Models\EducationHistory;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProfileCompletionController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the profile completion page.
     */
    public function show(): Response|RedirectResponse
    {
        $user = Auth::user();

        $profile = ApplicantProfile::with(['cvs', 'jobHistories', 'educationHistories', 'achievements'])
            ->where('user_id', $user->id)
            ->first();

        if ($profile && method_exists($profile, 'isComplete') && $profile->isComplete()) {
            return redirect()->route('dashboard');
        }

        return Inertia::render('auth/completeProfile', [
            'applicantProfile' => $profile,
        ]);
    }

    /**
     * Store or update profile
     */
    public function store(Request $request): RedirectResponse
    {
        $user = Auth::user();

        $validated = $request->validate([
            // Basic Info
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'birth_date' => 'nullable|date',
            'gender' => 'nullable|string|max:50',
            'blood_type' => 'nullable|string|max:3',
            'phone' => 'required|string|max:20',
            'address' => 'nullable|string',

            // Professional Info
            'experience_years' => 'nullable|integer|min:0|max:60',
            'current_job_title' => 'nullable|string|max:255',
            'social_links' => 'nullable|array',

            // CVs
            'cvs' => 'nullable|array',
            'cvs.*.id' => 'nullable|exists:applicant_cvs,id',
            'cvs.*.file' => 'nullable|file|mimetypes:application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document|max:5120',
            'cvs.*.original_name' => 'nullable|string',
            'cvs.*.is_primary' => 'nullable|boolean',
            'cvs.*.order_position' => 'nullable|integer',
            'cvs.*.to_delete' => 'nullable|boolean',

            // Job History
            'job_histories' => 'nullable|array',
            'job_histories.*.id' => 'nullable|integer',
            'job_histories.*.company_name' => 'required|string|max:255',
            'job_histories.*.position' => 'required|string|max:255',
            'job_histories.*.starting_year' => 'required|integer|min:1900|max:' . (date('Y') + 1),
            'job_histories.*.ending_year' => 'nullable|integer|min:1900|max:' . (date('Y') + 1),
            'job_histories.*.is_current' => 'nullable|boolean',
            'job_histories.*.to_delete' => 'nullable|boolean',

            // Education
            'education_histories' => 'nullable|array',
            'education_histories.*.id' => 'nullable|integer',
            'education_histories.*.institution_name' => 'required|string|max:255',
            'education_histories.*.degree' => 'required|string|max:255',
            'education_histories.*.passing_year' => 'required|integer|min:1900|max:' . (date('Y') + 1),
            'education_histories.*.to_delete' => 'nullable|boolean',

            // Achievements
            'achievements' => 'nullable|array',
            'achievements.*.id' => 'nullable|integer',
            'achievements.*.achievement_name' => 'required|string|max:255',
            'achievements.*.achievement_details' => 'nullable|string',
            'achievements.*.to_delete' => 'nullable|boolean',
        ]);

        try {
            DB::transaction(function () use ($validated, $user) {

                $profile = ApplicantProfile::updateOrCreate(
                    ['user_id' => $user->id],
                    [
                        'first_name' => $validated['first_name'],
                        'last_name' => $validated['last_name'],
                        'birth_date' => $validated['birth_date'] ?? null,
                        'gender' => $validated['gender'] ?? null,
                        'blood_type' => $validated['blood_type'] ?? null,
                        'phone' => $validated['phone'],
                        'address' => $validated['address'] ?? null,
                        'social_links' => $validated['social_links'] ?? [],
                        'experience_years' => $validated['experience_years'] ?? null,
                        'current_job_title' => $validated['current_job_title'] ?? null,
                    ]
                );

                if (!empty($validated['cvs'])) {
                    $this->handleCVs($profile->id, $validated['cvs']);
                }

                if (!empty($validated['job_histories'])) {
                    $this->handleJobHistories($profile->id, $validated['job_histories']);
                }

                if (!empty($validated['education_histories'])) {
                    $this->handleEducationHistories($profile->id, $validated['education_histories']);
                }

                if (!empty($validated['achievements'])) {
                    $this->handleAchievements($profile->id, $validated['achievements']);
                }

                // Once profile is completed, activate any pending CVs
                $this->activatePendingCvs($profile->id);
            });

            return redirect()->route('dashboard')->with('success', 'Profile completed successfully!');
        } catch (\Throwable $e) {

            Log::error('Profile completion failed', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return back()->withErrors([
                'error' => 'Failed to save profile. Please try again.'
            ]);
        }
    }

    /**
     * Handle CVs
     * Save uploaded CVs as pending by default
     */
    private function handleCVs(int $profileId, array $cvs): void
    {
        foreach ($cvs as $cvData) {

            // Delete CV
            if (!empty($cvData['to_delete']) && isset($cvData['id'])) {
                $cv = ApplicantCv::where('id', $cvData['id'])
                    ->where('applicant_profile_id', $profileId)
                    ->first();

                if ($cv) {
                    if ($cv->cv_path && Storage::disk('public')->exists($cv->cv_path)) {
                        Storage::disk('public')->delete($cv->cv_path);
                    }
                    $cv->delete();
                }
                continue;
            }

            // Update existing CV
            if (isset($cvData['id'])) {
                ApplicantCv::where('id', $cvData['id'])
                    ->where('applicant_profile_id', $profileId)
                    ->update([
                        'is_primary' => $cvData['is_primary'] ?? false,
                        'order_position' => $cvData['order_position'] ?? 0,
                    ]);
                continue;
            }

            // Upload new CV
            if (isset($cvData['file']) && $cvData['file'] instanceof UploadedFile) {

                $path = $cvData['file']->store("cvs/{$profileId}", 'public');

                $isPrimary = !empty($cvData['is_primary']);

                // Count active CVs only
                $activeCount = ApplicantCv::where('applicant_profile_id', $profileId)
                    ->where('status', 'active')
                    ->count();

                ApplicantCv::create([
                    'applicant_profile_id' => $profileId,
                    'cv_path' => $path,
                    'original_name' => $cvData['original_name'] ?? $cvData['file']->getClientOriginalName(),
                    'order_position' => $cvData['order_position'] ?? $activeCount,
                    'is_primary' => $activeCount === 0 ? true : $isPrimary,
                    'status' => 'pending', 
                ]);
            }
        }

        // Reorder only active CVs
        ApplicantCv::reorderCvs($profileId);
    }

    /**
     * Upload a CV immediately and mark it as pending until profile completion.
     */
    public function uploadCv(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'cv' => 'required|file|mimes:pdf,doc,docx|max:5120',
        ]);

        $profile = ApplicantProfile::firstOrCreate(
            ['user_id' => $user->id],
            $this->placeholderProfileData($user)
        );

        if (ApplicantCv::hasReachedMaxEntries($profile->id, true)) {
            return response()->json([
                'message' => 'Maximum CVs reached.',
            ], 422);
        }

        $path = $validated['cv']->store("cvs/{$profile->id}", 'public');

        $nextPosition = ApplicantCv::where('applicant_profile_id', $profile->id)->max('order_position');
        $nextPosition = is_null($nextPosition) ? 0 : $nextPosition + 1;

        $cv = ApplicantCv::create([
            'applicant_profile_id' => $profile->id,
            'cv_path' => $path,
            'original_name' => $validated['cv']->getClientOriginalName(),
            'order_position' => $nextPosition,
            'is_primary' => false,
            'status' => 'pending',
        ]);

        return response()->json([
            'id' => $cv->id,
            'original_name' => $cv->original_name,
            'size' => $validated['cv']->getSize(),
            'type' => $validated['cv']->getMimeType(),
            'url' => $cv->url,
            'is_primary' => $cv->is_primary,
            'status' => $cv->status,
            'order_position' => $cv->order_position,
            'upload_date' => $cv->created_at?->toISOString(),
        ]);
    }

    /**
     * Remove a CV (pending or active).
     */
    public function destroyCv(ApplicantCv $cv): RedirectResponse
    {
        $user = Auth::user();

        if ($cv->applicantProfile?->user_id !== $user->id) {
            abort(403);
        }

        if ($cv->cv_path && Storage::disk('public')->exists($cv->cv_path)) {
            Storage::disk('public')->delete($cv->cv_path);
        }

        $cv->delete();
        ApplicantCv::reorderCvs($cv->applicant_profile_id);

        return back();
    }

    /**
     * Set a CV as primary (active only).
     */
    public function setPrimaryCv(ApplicantCv $cv): RedirectResponse
    {
        $user = Auth::user();

        if ($cv->applicantProfile?->user_id !== $user->id) {
            abort(403);
        }

        if ($cv->status !== 'active') {
            return back();
        }

        $cv->setAsPrimary();

        return back();
    }

    /**
     * Promote pending CVs once profile is completed.
     */
    private function activatePendingCvs(int $profileId): void
    {
        ApplicantCv::where('applicant_profile_id', $profileId)
            ->where('status', 'pending')
            ->update(['status' => 'active']);

        ApplicantCv::reorderCvs($profileId);

        $primary = ApplicantCv::getPrimaryCv($profileId);
        if (! $primary) {
            $first = ApplicantCv::where('applicant_profile_id', $profileId)
                ->where('status', 'active')
                ->orderBy('order_position')
                ->first();
            if ($first) {
                $first->setAsPrimary();
            }
        }
    }

    /**
     * Seed a temporary profile for early CV uploads.
     */
    private function placeholderProfileData($user): array
    {
        $name = trim((string) $user->name);
        if ($name === '') {
            $email = Str::before((string) $user->email, '@');
            $name = Str::of($email)->replace(['.', '_', '-'], ' ')->title();
        }

        [$first, $last] = array_pad(preg_split('/\s+/', $name, 2) ?: [], 2, null);

        return [
            'first_name' => $first,
            'last_name' => $last,
        ];
    }

    // Other handlers (Job, Education, Achievement) remain the same
    private function handleJobHistories(int $profileId, array $jobs): void
    {
        foreach ($jobs as $job) {
            if (!empty($job['to_delete']) && isset($job['id'])) {
                JobHistory::where('id', $job['id'])
                    ->where('applicant_profile_id', $profileId)
                    ->delete();
                continue;
            }

            if (!empty($job['is_current'])) {
                $job['ending_year'] = null;
            }

            if (isset($job['id'])) {
                JobHistory::where('id', $job['id'])
                    ->where('applicant_profile_id', $profileId)
                    ->update($job);
            } else {
                if (JobHistory::hasReachedMaxEntries($profileId)) {
                    throw new \Exception('Max job history reached.');
                }
                $job['applicant_profile_id'] = $profileId;
                JobHistory::create($job);
            }
        }
    }

    private function handleEducationHistories(int $profileId, array $educations): void
    {
        foreach ($educations as $edu) {
            if (!empty($edu['to_delete']) && isset($edu['id'])) {
                EducationHistory::where('id', $edu['id'])
                    ->where('applicant_profile_id', $profileId)
                    ->delete();
                continue;
            }

            if (isset($edu['id'])) {
                EducationHistory::where('id', $edu['id'])
                    ->where('applicant_profile_id', $profileId)
                    ->update($edu);
            } else {
                if (EducationHistory::hasReachedMaxEntries($profileId)) {
                    throw new \Exception('Max education history reached.');
                }
                $edu['applicant_profile_id'] = $profileId;
                EducationHistory::create($edu);
            }
        }
    }

    private function handleAchievements(int $profileId, array $achievements): void
    {
        foreach ($achievements as $ach) {
            if (!empty($ach['to_delete']) && isset($ach['id'])) {
                Achievement::where('id', $ach['id'])
                    ->where('applicant_profile_id', $profileId)
                    ->delete();
                continue;
            }

            if (isset($ach['id'])) {
                Achievement::where('id', $ach['id'])
                    ->where('applicant_profile_id', $profileId)
                    ->update($ach);
            } else {
                if (Achievement::hasReachedMaxEntries($profileId)) {
                    throw new \Exception('Max achievements reached.');
                }
                $ach['applicant_profile_id'] = $profileId;
                Achievement::create($ach);
            }
        }
    }
}
