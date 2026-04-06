<?php
// app/Http/Controllers/ApplicantProfileController.php

namespace App\Http\Controllers\Profile;

// Inertia
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

// Models
use App\Models\User;
use App\Models\JobHistory;
use App\Models\Achievement;
use App\Models\ApplicantCv;
use App\Models\ApplicantProfile;
use App\Models\EducationHistory;


class ApplicantProfileController extends Controller
{
    /**
     * Display the applicant's profile (show page)
     */
    public function show(?int $id = null)
    {
        // Check if user is a job seeker
        if (Auth::user()->role !== 'job_seeker') {
            return redirect()->route('dashboard')
                ->with('error', 'Only job seekers can access applicant profiles.');
        }

        $userId = $id ?? Auth::id();

        // Get profile including soft deleted ones with all relationships
        $profile = ApplicantProfile::withTrashed()
            ->with([
                'cvs' => function ($query) {
                    $query->orderBy('order_position')
                        ->orderBy('created_at', 'desc');
                },
                'jobHistories' => function ($query) {
                    $query->orderBy('starting_year', 'desc')
                        ->orderBy('created_at', 'desc');
                },
                'educationHistories' => function ($query) {
                    $query->orderBy('passing_year', 'desc')
                        ->orderBy('created_at', 'desc');
                },
                'achievements' => function ($query) {
                    $query->orderBy('created_at', 'desc');
                },
                'applications' => function ($query) {
                    $query->with(['jobListing' => function ($q) {
                        $q->with(['category', 'locations']);
                    }])->orderBy('created_at', 'desc');
                },
                'user'
            ])
            ->where('user_id', $userId)
            ->first();

        // If profile exists, add computed attributes
        if ($profile) {
            // Add photo URL
            $profile->photo_url = $profile->photo_path
                ? route('profile.photo', ['path' => $profile->photo_path])
                : null;

            // Add CV URLs and format CV data
            foreach ($profile->cvs as $cv) {
                $cv->cv_url = $cv->cv_path ? asset('storage/' . $cv->cv_path) : null;
                $cv->file_size = $cv->cv_path && Storage::disk('public')->exists($cv->cv_path)
                    ? Storage::disk('public')->size($cv->cv_path)
                    : null;
            }

            // Add completion percentage
            $profile->completion_percentage = $profile->completionPercentage();

            // Add email
            $profile->email = $profile->user?->email;
        }

        return Inertia::render('Backend/ApplicantProfile/Show', [
            'profile' => $profile,
            'auth' => ['user' => Auth::user()]
        ]);
    }

    /**
     * Serve profile photo from storage to avoid public symlink issues.
     */
    public function photo(string $path)
    {
        if (Str::contains($path, '..')) {
            abort(404);
        }

        if (!Storage::disk('public')->exists($path)) {
            abort(404);
        }

        return response()->file(Storage::disk('public')->path($path));
    }

    /**
     * Update Basic Information only
     */
    public function updateBasicInfo(Request $request, ApplicantProfile $applicantProfile)
    {
        if (Auth::id() !== $applicantProfile->user_id) {
            abort(403);
        }

        if ($applicantProfile->trashed()) {
            return response()->json(['error' => 'Cannot update a deleted profile.'], 422);
        }

        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'birth_date' => 'nullable|date',
            'gender' => 'nullable|string|max:50',
            'blood_type' => 'nullable|string|max:3',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'remove_photo' => 'nullable|boolean',
        ]);

        $profileData = [
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'birth_date' => $validated['birth_date'] ?? null,
            'gender' => $validated['gender'] ?? null,
            'blood_type' => $validated['blood_type'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'address' => $validated['address'] ?? null,
        ];

        if ($request->boolean('remove_photo') && $applicantProfile->photo_path) {
            Storage::disk('public')->delete($applicantProfile->photo_path);
            $profileData['photo_path'] = null;
        }

        if ($request->hasFile('photo')) {
            if ($applicantProfile->photo_path) {
                Storage::disk('public')->delete($applicantProfile->photo_path);
            }
            $photoPath = $this->handlePhotoUpload($request->file('photo'), $applicantProfile->user_id);
            $profileData['photo_path'] = $photoPath;
        }

        $applicantProfile->update($profileData);

        return response()->json([
            'success' => true,
            'message' => 'Basic information updated successfully!',
            'profile' => $applicantProfile->fresh()
        ]);
    }

    /**
     * Update Professional Information only
     */
    public function updateProfessionalInfo(Request $request, ApplicantProfile $applicantProfile)
    {
        if (Auth::id() !== $applicantProfile->user_id) {
            abort(403);
        }

        if ($applicantProfile->trashed()) {
            return response()->json(['error' => 'Cannot update a deleted profile.'], 422);
        }

        $validated = $request->validate([
            'experience_years' => 'nullable|integer|min:0|max:60',
            'current_job_title' => 'nullable|string|max:255',
            'social_links' => 'nullable|array',
        ]);

        $applicantProfile->update([
            'experience_years' => $validated['experience_years'] ?? null,
            'current_job_title' => $validated['current_job_title'] ?? null,
            'social_links' => $validated['social_links'] ?? [],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Professional information updated successfully!',
            'profile' => $applicantProfile->fresh()
        ]);
    }

    /**
     * Update Work Experience (Job Histories)
     */
    public function updateWorkExperiences(Request $request, ApplicantProfile $applicantProfile)
    {
        if (Auth::id() !== $applicantProfile->user_id) {
            abort(403);
        }

        if ($applicantProfile->trashed()) {
            return response()->json(['error' => 'Cannot update a deleted profile.'], 422);
        }

        $validated = $request->validate([
            'job_histories' => 'nullable|array',
            'job_histories.*.id' => 'nullable|exists:job_histories,id',
            'job_histories.*.company_name' => 'required|string|max:255',
            'job_histories.*.position' => 'required|string|max:255',
            'job_histories.*.starting_year' => 'required|integer|min:1900|max:' . (date('Y') + 1),
            'job_histories.*.ending_year' => 'nullable|integer|min:1900|max:' . (date('Y') + 1),
            'job_histories.*.is_current' => 'nullable|boolean',
            'job_histories.*.to_delete' => 'nullable|boolean',
        ]);

        DB::transaction(function () use ($validated, $applicantProfile) {
            foreach ($validated['job_histories'] ?? [] as $jobData) {
                if (!empty($jobData['to_delete']) && isset($jobData['id'])) {
                    JobHistory::where('id', $jobData['id'])
                        ->where('applicant_profile_id', $applicantProfile->id)
                        ->delete();
                    continue;
                }

                if (!empty($jobData['is_current'])) {
                    $jobData['ending_year'] = null;
                }

                if (isset($jobData['id'])) {
                    JobHistory::where('id', $jobData['id'])
                        ->where('applicant_profile_id', $applicantProfile->id)
                        ->update([
                            'company_name' => $jobData['company_name'],
                            'position' => $jobData['position'],
                            'starting_year' => $jobData['starting_year'],
                            'ending_year' => $jobData['ending_year'] ?? null,
                            'is_current' => $jobData['is_current'] ?? false,
                        ]);
                } else {
                    $applicantProfile->jobHistories()->create([
                        'company_name' => $jobData['company_name'],
                        'position' => $jobData['position'],
                        'starting_year' => $jobData['starting_year'],
                        'ending_year' => $jobData['ending_year'] ?? null,
                        'is_current' => $jobData['is_current'] ?? false,
                    ]);
                }
            }
        });

        return response()->json([
            'success' => true,
            'message' => 'Work experience updated successfully!',
            'job_histories' => $applicantProfile->fresh()->jobHistories
        ]);
    }

    /**
     * Update Education
     */
    public function updateEducations(Request $request, ApplicantProfile $applicantProfile)
    {
        if (Auth::id() !== $applicantProfile->user_id) {
            abort(403);
        }

        if ($applicantProfile->trashed()) {
            return response()->json(['error' => 'Cannot update a deleted profile.'], 422);
        }

        $validated = $request->validate([
            'education_histories' => 'nullable|array',
            'education_histories.*.id' => 'nullable|exists:education_histories,id',
            'education_histories.*.institution_name' => 'required|string|max:255',
            'education_histories.*.degree' => 'required|string|max:255',
            'education_histories.*.passing_year' => 'required|integer|min:1900|max:' . (date('Y') + 1),
            'education_histories.*.to_delete' => 'nullable|boolean',
        ]);

        DB::transaction(function () use ($validated, $applicantProfile) {
            foreach ($validated['education_histories'] ?? [] as $eduData) {
                if (!empty($eduData['to_delete']) && isset($eduData['id'])) {
                    EducationHistory::where('id', $eduData['id'])
                        ->where('applicant_profile_id', $applicantProfile->id)
                        ->delete();
                    continue;
                }

                if (isset($eduData['id'])) {
                    EducationHistory::where('id', $eduData['id'])
                        ->where('applicant_profile_id', $applicantProfile->id)
                        ->update([
                            'institution_name' => $eduData['institution_name'],
                            'degree' => $eduData['degree'],
                            'passing_year' => $eduData['passing_year'],
                        ]);
                } else {
                    $applicantProfile->educationHistories()->create([
                        'institution_name' => $eduData['institution_name'],
                        'degree' => $eduData['degree'],
                        'passing_year' => $eduData['passing_year'],
                    ]);
                }
            }
        });

        return response()->json([
            'success' => true,
            'message' => 'Education updated successfully!',
            'education_histories' => $applicantProfile->fresh()->educationHistories
        ]);
    }

    /**
     * Update Achievements
     */
    public function updateAchievements(Request $request, ApplicantProfile $applicantProfile)
    {
        if (Auth::id() !== $applicantProfile->user_id) {
            abort(403);
        }

        if ($applicantProfile->trashed()) {
            return response()->json(['error' => 'Cannot update a deleted profile.'], 422);
        }

        $validated = $request->validate([
            'achievements' => 'nullable|array',
            'achievements.*.id' => 'nullable|exists:achievements,id',
            'achievements.*.achievement_name' => 'required|string|max:255',
            'achievements.*.achievement_details' => 'nullable|string',
            'achievements.*.to_delete' => 'nullable|boolean',
        ]);

        DB::transaction(function () use ($validated, $applicantProfile) {
            foreach ($validated['achievements'] ?? [] as $achData) {
                if (!empty($achData['to_delete']) && isset($achData['id'])) {
                    Achievement::where('id', $achData['id'])
                        ->where('applicant_profile_id', $applicantProfile->id)
                        ->delete();
                    continue;
                }

                if (isset($achData['id'])) {
                    Achievement::where('id', $achData['id'])
                        ->where('applicant_profile_id', $applicantProfile->id)
                        ->update([
                            'achievement_name' => $achData['achievement_name'],
                            'achievement_details' => $achData['achievement_details'] ?? null,
                        ]);
                } else {
                    $applicantProfile->achievements()->create([
                        'achievement_name' => $achData['achievement_name'],
                        'achievement_details' => $achData['achievement_details'] ?? null,
                    ]);
                }
            }
        });

        return response()->json([
            'success' => true,
            'message' => 'Achievements updated successfully!',
            'achievements' => $applicantProfile->fresh()->achievements
        ]);
    }

    /**
     * Change Password
     */
    public function changePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::query()->findOrFail(Auth::id());

        // Check if current password matches
        if (!Hash::check($validated['current_password'], $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['The current password is incorrect.'],
            ]);
        }

        // Update password
        $user->forceFill([
            'password' => Hash::make($validated['new_password'])
        ])->save();

        return response()->json([
            'success' => true,
            'message' => 'Password changed successfully!'
        ]);
    }

    /**
     * Remove the specified profile (soft delete)
     */
    public function destroy(ApplicantProfile $applicantProfile)
    {
        // Only allow deleting own profile
        if (Auth::id() !== $applicantProfile->user_id) {
            abort(403);
        }

        if ($applicantProfile->trashed()) {
            return response()->json([
                'success' => false,
                'message' => 'Profile is already deleted.'
            ], 422);
        }

        // Soft delete related records first
        DB::transaction(function () use ($applicantProfile) {
            // Permanently delete CVs (remove file + force delete)
            foreach ($applicantProfile->cvs as $cv) {
                if ($cv->cv_path && Storage::disk('public')->exists($cv->cv_path)) {
                    Storage::disk('public')->delete($cv->cv_path);
                }
                $cv->forceDelete();
            }

            // Delete job histories, education, achievements (these don't have soft delete, so just delete)
            $applicantProfile->jobHistories()->delete();
            $applicantProfile->educationHistories()->delete();
            $applicantProfile->achievements()->delete();

            // Delete profile photo file and clear path
            if ($applicantProfile->photo_path && Storage::disk('public')->exists($applicantProfile->photo_path)) {
                Storage::disk('public')->delete($applicantProfile->photo_path);
            }
            $applicantProfile->photo_path = null;
            $applicantProfile->save();

            // Soft delete the profile
            $applicantProfile->delete();
        });

        return response()->json([
            'success' => true,
            'message' => 'Profile has been deleted. You can restore it if needed.'
        ]);
    }

    /**
     * Restore a soft-deleted profile
     */
    public function restore($id)
    {
        $profile = ApplicantProfile::withTrashed()->where('user_id', $id)->first();

        if (!$profile) {
            return response()->json([
                'success' => false,
                'message' => 'No profile found to restore.'
            ], 404);
        }

        if (!$profile->trashed()) {
            return response()->json([
                'success' => false,
                'message' => 'Profile is not deleted.'
            ], 422);
        }

        DB::transaction(function () use ($profile) {
            // Restore CVs
            ApplicantCv::withTrashed()
                ->where('applicant_profile_id', $profile->id)
                ->restore();

            // Restore the profile
            $profile->restore();
        });

        if ($profile->photo_path && !Storage::disk('public')->exists($profile->photo_path)) {
            $profile->photo_path = null;
            $profile->save();
        }

        return response()->json([
            'success' => true,
            'message' => 'Profile restored successfully!',
            'profile' => $profile->fresh()
        ]);
    }

    /**
     * Handle photo upload
     */
    private function handlePhotoUpload($photo, int $userId): string
    {
        $fileName = 'profile_' . $userId . '_' . time() . '.' . $photo->getClientOriginalExtension();
        $path = $photo->storeAs('profile_photos', $fileName, 'public');
        return $path;
    }

    /**
     * Download the CV
     */
    public function downloadCV(ApplicantProfile $applicantProfile)
    {
        // Only allow viewing own CV
        if (Auth::id() !== $applicantProfile->user_id) {
            abort(403);
        }

        if ($applicantProfile->trashed()) {
            return redirect()->back()->with('error', 'Cannot download CV from a deleted profile.');
        }

        if (!$applicantProfile->cv_path) {
            return redirect()->back()->with('error', 'No CV found.');
        }

        $filePath = storage_path('app/public/' . $applicantProfile->cv_path);

        if (!file_exists($filePath)) {
            return redirect()->back()->with('error', 'CV file not found.');
        }

        return response()->download($filePath, $applicantProfile->full_name . '_CV.pdf');
    }

    /**
     * Get profile data for editing (AJAX endpoint)
     */
    public function getProfileData(ApplicantProfile $applicantProfile)
    {
        if (Auth::id() !== $applicantProfile->user_id) {
            abort(403);
        }

        return response()->json([
            'profile' => $applicantProfile->load([
                'cvs',
                'jobHistories',
                'educationHistories',
                'achievements'
            ])
        ]);
    }
}
