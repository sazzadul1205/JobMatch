<?php

namespace App\Http\Controllers\Api\JobSeeker;

use App\Http\Controllers\Controller;
use App\Models\ApplicantProfile;
use App\Models\ApplicantCv;
use App\Models\JobHistory;
use App\Models\EducationHistory;
use App\Models\Achievement;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ProfileController extends Controller
{
  /**
   * Show profile.
   */
  public function show(Request $request, ?int $id = null): JsonResponse
  {
    try {
      $user = $request->user();

      // If no ID, show own profile
      if (is_null($id)) {
        $profile = ApplicantProfile::withTrashed()
          ->with([
            'cvs' => fn($q) => $q->orderBy('order_position')->orderBy('created_at', 'desc'),
            'jobHistories' => fn($q) => $q->orderBy('starting_year', 'desc'),
            'educationHistories' => fn($q) => $q->orderBy('passing_year', 'desc'),
            'achievements' => fn($q) => $q->orderBy('created_at', 'desc'),
            'applications' => fn($q) => $q->with('jobListing')->orderBy('created_at', 'desc'),
            'user',
          ])
          ->where('user_id', $user->id)
          ->first();

        if (!$profile) {
          return response()->json([
            'success' => false,
            'message' => 'Profile not found. Please complete your profile.',
          ], 404);
        }

        return response()->json([
          'success' => true,
          'data' => $this->formatProfile($profile, true),
          'is_owner' => true,
        ]);
      }

      // View other profile (admin/full access)
      $profile = ApplicantProfile::withTrashed()
        ->with([
          'cvs' => fn($q) => $q->where('status', 'active')->orderBy('order_position'),
          'jobHistories' => fn($q) => $q->orderBy('starting_year', 'desc'),
          'educationHistories' => fn($q) => $q->orderBy('passing_year', 'desc'),
          'achievements' => fn($q) => $q->orderBy('created_at', 'desc'),
          'user',
        ])
        ->where('id', $id)
        ->firstOrFail();

      return response()->json([
        'success' => true,
        'data' => $this->formatProfile($profile, false),
        'is_owner' => $profile->user_id === $user->id,
      ]);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Profile not found: ' . $e->getMessage(),
      ], 404);
    }
  }

  /**
   * Update basic information.
   */
  public function updateBasicInfo(Request $request): JsonResponse
  {
    try {
      $user = $request->user();
      $profile = ApplicantProfile::where('user_id', $user->id)->firstOrFail();

      $validated = $request->validate([
        'first_name' => 'required|string|max:255',
        'last_name' => 'required|string|max:255',
        'birth_date' => 'nullable|date',
        'gender' => 'nullable|string|max:50',
        'blood_type' => 'nullable|string|max:3',
        'phone' => 'nullable|string|max:20',
        'address' => 'nullable|string',
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

      // Handle photo removal
      if ($request->boolean('remove_photo') && $profile->photo_path) {
        Storage::disk('public')->delete($profile->photo_path);
        $profileData['photo_path'] = null;
      }

      // Handle photo upload (base64 or file)
      if ($request->has('photo')) {
        $photoData = $request->input('photo');
        if ($this->isBase64Image($photoData)) {
          $profileData['photo_path'] = $this->handleBase64Photo($photoData, $user->id);
        }
      }

      $profile->update($profileData);

      return response()->json([
        'success' => true,
        'message' => 'Basic information updated successfully.',
        'data' => $this->formatProfile($profile->fresh()),
      ]);
    } catch (ValidationException $e) {
      return response()->json([
        'success' => false,
        'message' => 'Validation failed.',
        'errors' => $e->errors(),
      ], 422);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Failed to update profile: ' . $e->getMessage(),
      ], 500);
    }
  }

  /**
   * Update professional information.
   */
  public function updateProfessionalInfo(Request $request): JsonResponse
  {
    try {
      $user = $request->user();
      $profile = ApplicantProfile::where('user_id', $user->id)->firstOrFail();

      $validated = $request->validate([
        'experience_years' => 'nullable|integer|min:0|max:60',
        'current_job_title' => 'nullable|string|max:255',
        'social_links' => 'nullable|array',
        'social_links.linkedin' => 'nullable|url',
        'social_links.facebook' => 'nullable|url',
        'social_links.twitter' => 'nullable|url',
        'social_links.github' => 'nullable|url',
        'social_links.portfolio' => 'nullable|url',
      ]);

      $profile->update([
        'experience_years' => $validated['experience_years'] ?? null,
        'current_job_title' => $validated['current_job_title'] ?? null,
        'social_links' => $validated['social_links'] ?? [],
      ]);

      return response()->json([
        'success' => true,
        'message' => 'Professional information updated successfully.',
        'data' => $this->formatProfile($profile->fresh()),
      ]);
    } catch (ValidationException $e) {
      return response()->json([
        'success' => false,
        'message' => 'Validation failed.',
        'errors' => $e->errors(),
      ], 422);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Failed to update professional info: ' . $e->getMessage(),
      ], 500);
    }
  }

  /**
   * Update work experiences.
   */
  public function updateWorkExperiences(Request $request): JsonResponse
  {
    try {
      $user = $request->user();
      $profile = ApplicantProfile::where('user_id', $user->id)->firstOrFail();

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

      DB::transaction(function () use ($validated, $profile) {
        foreach ($validated['job_histories'] ?? [] as $jobData) {
          // Delete
          if (!empty($jobData['to_delete']) && isset($jobData['id'])) {
            JobHistory::where('id', $jobData['id'])
              ->where('applicant_profile_id', $profile->id)
              ->delete();
            continue;
          }

          // If current, clear ending_year
          if (!empty($jobData['is_current'])) {
            $jobData['ending_year'] = null;
          }

          // Update or create
          if (isset($jobData['id'])) {
            JobHistory::where('id', $jobData['id'])
              ->where('applicant_profile_id', $profile->id)
              ->update([
                'company_name' => $jobData['company_name'],
                'position' => $jobData['position'],
                'starting_year' => $jobData['starting_year'],
                'ending_year' => $jobData['ending_year'] ?? null,
                'is_current' => $jobData['is_current'] ?? false,
              ]);
          } else {
            $profile->jobHistories()->create([
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
        'message' => 'Work experience updated successfully.',
        'data' => [
          'job_histories' => $profile->fresh()->jobHistories,
        ],
      ]);
    } catch (ValidationException $e) {
      return response()->json([
        'success' => false,
        'message' => 'Validation failed.',
        'errors' => $e->errors(),
      ], 422);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Failed to update work experience: ' . $e->getMessage(),
      ], 500);
    }
  }

  /**
   * Update education.
   */
  public function updateEducations(Request $request): JsonResponse
  {
    try {
      $user = $request->user();
      $profile = ApplicantProfile::where('user_id', $user->id)->firstOrFail();

      $validated = $request->validate([
        'education_histories' => 'nullable|array',
        'education_histories.*.id' => 'nullable|exists:education_histories,id',
        'education_histories.*.institution_name' => 'required|string|max:255',
        'education_histories.*.degree' => 'required|string|max:255',
        'education_histories.*.passing_year' => 'required|integer|min:1900|max:' . (date('Y') + 1),
        'education_histories.*.to_delete' => 'nullable|boolean',
      ]);

      DB::transaction(function () use ($validated, $profile) {
        foreach ($validated['education_histories'] ?? [] as $eduData) {
          if (!empty($eduData['to_delete']) && isset($eduData['id'])) {
            EducationHistory::where('id', $eduData['id'])
              ->where('applicant_profile_id', $profile->id)
              ->delete();
            continue;
          }

          if (isset($eduData['id'])) {
            EducationHistory::where('id', $eduData['id'])
              ->where('applicant_profile_id', $profile->id)
              ->update([
                'institution_name' => $eduData['institution_name'],
                'degree' => $eduData['degree'],
                'passing_year' => $eduData['passing_year'],
              ]);
          } else {
            $profile->educationHistories()->create([
              'institution_name' => $eduData['institution_name'],
              'degree' => $eduData['degree'],
              'passing_year' => $eduData['passing_year'],
            ]);
          }
        }
      });

      return response()->json([
        'success' => true,
        'message' => 'Education updated successfully.',
        'data' => [
          'education_histories' => $profile->fresh()->educationHistories,
        ],
      ]);
    } catch (ValidationException $e) {
      return response()->json([
        'success' => false,
        'message' => 'Validation failed.',
        'errors' => $e->errors(),
      ], 422);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Failed to update education: ' . $e->getMessage(),
      ], 500);
    }
  }

  /**
   * Update achievements.
   */
  public function updateAchievements(Request $request): JsonResponse
  {
    try {
      $user = $request->user();
      $profile = ApplicantProfile::where('user_id', $user->id)->firstOrFail();

      $validated = $request->validate([
        'achievements' => 'nullable|array',
        'achievements.*.id' => 'nullable|exists:achievements,id',
        'achievements.*.achievement_name' => 'required|string|max:255',
        'achievements.*.achievement_details' => 'nullable|string',
        'achievements.*.to_delete' => 'nullable|boolean',
      ]);

      DB::transaction(function () use ($validated, $profile) {
        foreach ($validated['achievements'] ?? [] as $achData) {
          if (!empty($achData['to_delete']) && isset($achData['id'])) {
            Achievement::where('id', $achData['id'])
              ->where('applicant_profile_id', $profile->id)
              ->delete();
            continue;
          }

          if (isset($achData['id'])) {
            Achievement::where('id', $achData['id'])
              ->where('applicant_profile_id', $profile->id)
              ->update([
                'achievement_name' => $achData['achievement_name'],
                'achievement_details' => $achData['achievement_details'] ?? null,
              ]);
          } else {
            $profile->achievements()->create([
              'achievement_name' => $achData['achievement_name'],
              'achievement_details' => $achData['achievement_details'] ?? null,
            ]);
          }
        }
      });

      return response()->json([
        'success' => true,
        'message' => 'Achievements updated successfully.',
        'data' => [
          'achievements' => $profile->fresh()->achievements,
        ],
      ]);
    } catch (ValidationException $e) {
      return response()->json([
        'success' => false,
        'message' => 'Validation failed.',
        'errors' => $e->errors(),
      ], 422);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Failed to update achievements: ' . $e->getMessage(),
      ], 500);
    }
  }

  /**
   * Change password.
   */
  public function changePassword(Request $request): JsonResponse
  {
    try {
      $user = $request->user();

      $validated = $request->validate([
        'current_password' => 'required|string',
        'new_password' => 'required|string|min:8|confirmed',
      ]);

      if (!Hash::check($validated['current_password'], $user->password)) {
        return response()->json([
          'success' => false,
          'message' => 'Current password is incorrect.',
        ], 401);
      }

      $user->forceFill([
        'password' => Hash::make($validated['new_password']),
      ])->save();

      return response()->json([
        'success' => true,
        'message' => 'Password changed successfully.',
      ]);
    } catch (ValidationException $e) {
      return response()->json([
        'success' => false,
        'message' => 'Validation failed.',
        'errors' => $e->errors(),
      ], 422);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Failed to change password: ' . $e->getMessage(),
      ], 500);
    }
  }

  /**
   * Upload CV (after profile completion).
   */
  public function uploadCv(Request $request): JsonResponse
  {
    try {
      $user = $request->user();
      $profile = ApplicantProfile::where('user_id', $user->id)->firstOrFail();

      $validated = $request->validate([
        'cv' => 'required|file|mimes:pdf,doc,docx|max:5120',
      ]);

      $activeCount = ApplicantCv::where('applicant_profile_id', $profile->id)
        ->where('status', 'active')
        ->count();

      if ($activeCount >= ApplicantCv::MAX_CVS_PER_PROFILE) {
        return response()->json([
          'success' => false,
          'message' => sprintf('Maximum %d CVs reached.', ApplicantCv::MAX_CVS_PER_PROFILE),
        ], 422);
      }

      $path = $validated['cv']->store("cvs/{$profile->id}", 'public');

      $maxPosition = ApplicantCv::where('applicant_profile_id', $profile->id)
        ->max('order_position');
      $nextPosition = is_null($maxPosition) ? 0 : $maxPosition + 1;

      $cv = ApplicantCv::create([
        'applicant_profile_id' => $profile->id,
        'cv_path' => $path,
        'original_name' => $validated['cv']->getClientOriginalName(),
        'order_position' => $nextPosition,
        'is_primary' => $activeCount === 0,
        'status' => 'active',
      ]);

      return response()->json([
        'success' => true,
        'message' => 'CV uploaded successfully.',
        'data' => [
          'id' => $cv->id,
          'original_name' => $cv->original_name,
          'size' => $validated['cv']->getSize(),
          'type' => $validated['cv']->getMimeType(),
          'url' => asset('storage/' . $cv->cv_path),
          'is_primary' => $cv->is_primary,
          'status' => $cv->status,
          'order_position' => $cv->order_position,
          'upload_date' => $cv->created_at?->toISOString(),
        ]
      ]);
    } catch (ValidationException $e) {
      return response()->json([
        'success' => false,
        'message' => 'Validation failed.',
        'errors' => $e->errors(),
      ], 422);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Failed to upload CV: ' . $e->getMessage(),
      ], 500);
    }
  }

  /**
   * Delete CV.
   */
  public function destroyCv(Request $request, ApplicantCv $cv): JsonResponse
  {
    try {
      $user = $request->user();

      if ($cv->applicantProfile->user_id !== $user->id) {
        return response()->json([
          'success' => false,
          'message' => 'Unauthorized.',
        ], 403);
      }

      if ($cv->cv_path && Storage::disk('public')->exists($cv->cv_path)) {
        Storage::disk('public')->delete($cv->cv_path);
      }

      $cv->forceDelete();
      ApplicantCv::reorderCvs($cv->applicant_profile_id);

      return response()->json([
        'success' => true,
        'message' => 'CV deleted successfully.',
      ]);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Failed to delete CV: ' . $e->getMessage(),
      ], 500);
    }
  }

  /**
   * Set primary CV.
   */
  public function setPrimaryCv(Request $request, ApplicantCv $cv): JsonResponse
  {
    try {
      $user = $request->user();

      if ($cv->applicantProfile->user_id !== $user->id) {
        return response()->json([
          'success' => false,
          'message' => 'Unauthorized.',
        ], 403);
      }

      if ($cv->status !== 'active') {
        return response()->json([
          'success' => false,
          'message' => 'Only active CVs can be set as primary.',
        ], 422);
      }

      $cv->setAsPrimary();

      return response()->json([
        'success' => true,
        'message' => 'Primary CV updated successfully.',
      ]);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Failed to set primary CV: ' . $e->getMessage(),
      ], 500);
    }
  }

  /**
   * Download CV.
   */
  public function downloadCv(
    Request $request,
    ApplicantCv $cv
  ): BinaryFileResponse|JsonResponse {
    try {
      $user = $request->user();

      if ($cv->applicantProfile->user_id !== $user->id) {
        return response()->json([
          'success' => false,
          'message' => 'Unauthorized.',
        ], 403);
      }

      if (!$cv->cv_path || !Storage::disk('public')->exists($cv->cv_path)) {
        return response()->json([
          'success' => false,
          'message' => 'CV file not found.',
        ], 404);
      }

      $fullPath = Storage::disk('public')->path($cv->cv_path);
      $fileName = $cv->original_name ?? 'CV.pdf';

      return response()->download($fullPath, $fileName);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Failed to download CV: ' . $e->getMessage(),
      ], 500);
    }
  }

  /**
   * Delete profile (soft delete).
   */
  public function destroy(Request $request): JsonResponse
  {
    try {
      $user = $request->user();
      $profile = ApplicantProfile::where('user_id', $user->id)->firstOrFail();

      DB::transaction(function () use ($profile) {
        // Delete CV files
        foreach ($profile->cvs as $cv) {
          if ($cv->cv_path && Storage::disk('public')->exists($cv->cv_path)) {
            Storage::disk('public')->delete($cv->cv_path);
          }
          $cv->forceDelete();
        }

        // Delete photo
        if ($profile->photo_path && Storage::disk('public')->exists($profile->photo_path)) {
          Storage::disk('public')->delete($profile->photo_path);
        }

        // Delete related data
        $profile->jobHistories()->delete();
        $profile->educationHistories()->delete();
        $profile->achievements()->delete();

        // Soft delete profile
        $profile->delete();
      });

      return response()->json([
        'success' => true,
        'message' => 'Profile deleted successfully. You can restore it if needed.',
      ]);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Failed to delete profile: ' . $e->getMessage(),
      ], 500);
    }
  }

  /**
   * Restore soft-deleted profile.
   */
  public function restore(Request $request, int $id): JsonResponse
  {
    try {
      $profile = ApplicantProfile::withTrashed()
        ->where('user_id', $request->user()->id)
        ->findOrFail($id);

      if (!$profile->trashed()) {
        return response()->json([
          'success' => false,
          'message' => 'Profile is not deleted.',
        ], 400);
      }

      DB::transaction(function () use ($profile) {
        ApplicantCv::withTrashed()
          ->where('applicant_profile_id', $profile->id)
          ->restore();
        $profile->restore();
      });

      return response()->json([
        'success' => true,
        'message' => 'Profile restored successfully.',
        'data' => $this->formatProfile($profile->fresh()),
      ]);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Failed to restore profile: ' . $e->getMessage(),
      ], 500);
    }
  }

  /**
   * Force delete profile.
   */
  public function forceDelete(Request $request, int $id): JsonResponse
  {
    try {
      $profile = ApplicantProfile::withTrashed()
        ->where('user_id', $request->user()->id)
        ->findOrFail($id);

      if (!$profile->trashed()) {
        return response()->json([
          'success' => false,
          'message' => 'Profile must be soft-deleted first.',
        ], 400);
      }

      DB::transaction(function () use ($profile) {
        // Delete all CV files
        foreach ($profile->cvs as $cv) {
          if ($cv->cv_path && Storage::disk('public')->exists($cv->cv_path)) {
            Storage::disk('public')->delete($cv->cv_path);
          }
          $cv->forceDelete();
        }

        if ($profile->photo_path && Storage::disk('public')->exists($profile->photo_path)) {
          Storage::disk('public')->delete($profile->photo_path);
        }

        $profile->jobHistories()->forceDelete();
        $profile->educationHistories()->forceDelete();
        $profile->achievements()->forceDelete();
        $profile->forceDelete();
      });

      return response()->json([
        'success' => true,
        'message' => 'Profile permanently deleted.',
      ]);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Failed to permanently delete profile: ' . $e->getMessage(),
      ], 500);
    }
  }

  // ============== PRIVATE METHODS ==============

  private function formatProfile(ApplicantProfile $profile, bool $detailed = true): array
  {
    $data = [
      'id' => $profile->id,
      'first_name' => $profile->first_name,
      'last_name' => $profile->last_name,
      'full_name' => $profile->full_name,
      'email' => $profile->user?->email,
      'phone' => $profile->phone,
      'birth_date' => $profile->birth_date?->format('Y-m-d'),
      'gender' => $profile->gender,
      'blood_type' => $profile->blood_type,
      'address' => $profile->address,
      'social_links' => $profile->social_links ?? [],
      'experience_years' => $profile->experience_years,
      'current_job_title' => $profile->current_job_title,
      'photo_path' => $profile->photo_path,
      'photo_url' => $profile->photo_path ? asset('storage/' . $profile->photo_path) : null,
      'is_complete' => $profile->isComplete(),
      'completion_percentage' => $profile->completionPercentage(),
      'created_at' => $profile->created_at?->toISOString(),
      'updated_at' => $profile->updated_at?->toISOString(),
      'deleted_at' => $profile->deleted_at?->toISOString(),
    ];

    if ($detailed) {
      $data['cvs'] = $profile->cvs->map(fn($cv) => [
        'id' => $cv->id,
        'original_name' => $cv->original_name,
        'status' => $cv->status,
        'is_primary' => $cv->is_primary,
        'order_position' => $cv->order_position,
        'upload_date' => $cv->created_at?->toISOString(),
        'url' => asset('storage/' . $cv->cv_path),
      ]);

      $data['job_histories'] = $profile->jobHistories->map(fn($job) => [
        'id' => $job->id,
        'company_name' => $job->company_name,
        'position' => $job->position,
        'starting_year' => $job->starting_year,
        'ending_year' => $job->ending_year,
        'is_current' => $job->is_current,
      ]);

      $data['education_histories'] = $profile->educationHistories->map(fn($edu) => [
        'id' => $edu->id,
        'institution_name' => $edu->institution_name,
        'degree' => $edu->degree,
        'passing_year' => $edu->passing_year,
      ]);

      $data['achievements'] = $profile->achievements->map(fn($ach) => [
        'id' => $ach->id,
        'achievement_name' => $ach->achievement_name,
        'achievement_details' => $ach->achievement_details,
      ]);

      $data['applications_count'] = $profile->applications()->count();
      $data['active_cvs_count'] = $profile->cvs()->where('status', 'active')->count();
    }

    return $data;
  }

  private function isBase64Image(string $data): bool
  {
    return str_starts_with($data, 'data:image/');
  }

  private function handleBase64Photo(string $base64Data, int $userId): string
  {
    $imageData = explode(',', $base64Data);
    $image = base64_decode($imageData[1]);
    $extension = explode(';', explode('/', $imageData[0])[1])[0];

    $fileName = 'profile_' . $userId . '_' . time() . '.' . $extension;
    $path = 'profile_photos/' . $fileName;

    Storage::disk('public')->put($path, $image);

    return $path;
  }
}
