<?php

namespace App\Http\Controllers\Api\Auth\JobSeeker;

use App\Http\Controllers\Controller;
use App\Models\JobHistory;
use App\Models\ApplicantCv;
use App\Models\Achievement;
use App\Models\ApplicantProfile;
use App\Models\EducationHistory;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class ProfileCompletionController extends Controller
{
  /**
   * Get profile completion data.
   */
  public function show(Request $request): JsonResponse
  {
    try {
      $user = $request->user();
      $profile = ApplicantProfile::where('user_id', $user->id)->first();

      if ($profile && $profile->isComplete()) {
        return response()->json([
          'success' => true,
          'message' => 'Profile already complete.',
          'data' => [
            'profile' => $this->formatProfileData($profile),
            'is_complete' => true,
            'completion_percentage' => $profile->completionPercentage(),
          ]
        ]);
      }

      return response()->json([
        'success' => true,
        'data' => [
          'profile' => $profile ? $this->formatProfileData($profile) : null,
          'is_complete' => false,
          'completion_percentage' => $profile ? $profile->completionPercentage() : 0,
        ]
      ]);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Failed to get profile: ' . $e->getMessage(),
      ], 500);
    }
  }

  /**
   * Store or update profile.
   */
  public function store(Request $request): JsonResponse
  {
    try {
      $user = $request->user();

      $validated = $request->validate([
        'first_name' => 'required|string|max:255',
        'last_name' => 'required|string|max:255',
        'birth_date' => 'nullable|date',
        'gender' => 'nullable|string|max:50',
        'blood_type' => 'nullable|string|max:3',
        'phone' => 'required|string|max:20',
        'address' => 'nullable|string',
        'photo_path' => 'nullable|string',
        'experience_years' => 'nullable|integer|min:0|max:60',
        'current_job_title' => 'nullable|string|max:255',
        'social_links' => 'nullable|array',
        'cvs' => 'nullable|array',
        'cvs.*.id' => 'nullable|exists:applicant_cvs,id',
        'cvs.*.is_primary' => 'nullable|boolean',
        'cvs.*.order_position' => 'nullable|integer',
        'job_histories' => 'nullable|array|max:' . JobHistory::MAX_ENTRIES_PER_PROFILE,
        'job_histories.*.company_name' => 'required|string|max:255',
        'job_histories.*.position' => 'required|string|max:255',
        'job_histories.*.starting_year' => 'required|integer|min:1900|max:' . (date('Y') + 1),
        'job_histories.*.ending_year' => 'nullable|integer|min:1900|max:' . (date('Y') + 1),
        'job_histories.*.is_current' => 'nullable|boolean',
        'education_histories' => 'nullable|array|max:' . EducationHistory::MAX_ENTRIES_PER_PROFILE,
        'education_histories.*.institution_name' => 'required|string|max:255',
        'education_histories.*.degree' => 'required|string|max:255',
        'education_histories.*.passing_year' => 'required|integer|min:1900|max:' . (date('Y') + 1),
        'achievements' => 'nullable|array|max:' . Achievement::MAX_ACHIEVEMENTS_PER_PROFILE,
        'achievements.*.achievement_name' => 'required|string|max:255',
        'achievements.*.achievement_details' => 'nullable|string',
      ]);

      DB::transaction(function () use ($validated, $user) {
        $profileData = [
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
          'photo_path' => $validated['photo_path'] ?? null,
        ];

        $profile = ApplicantProfile::updateOrCreate(
          ['user_id' => $user->id],
          $profileData
        );

        if (!empty($validated['cvs'])) {
          $this->updateCVs($profile->id, $validated['cvs']);
        }

        if (!empty($validated['job_histories'])) {
          $this->updateJobHistories($profile->id, $validated['job_histories']);
        }

        if (!empty($validated['education_histories'])) {
          $this->updateEducationHistories($profile->id, $validated['education_histories']);
        }

        if (!empty($validated['achievements'])) {
          $this->updateAchievements($profile->id, $validated['achievements']);
        }

        $this->activatePendingCvs($profile->id);
      });

      $profile = ApplicantProfile::where('user_id', $user->id)->first();

      return response()->json([
        'success' => true,
        'message' => 'Profile completed successfully.',
        'data' => [
          'profile' => $this->formatProfileData($profile),
          'is_complete' => $profile->isComplete(),
          'completion_percentage' => $profile->completionPercentage(),
        ]
      ]);
    } catch (ValidationException $e) {
      return response()->json([
        'success' => false,
        'message' => 'Validation failed.',
        'errors' => $e->errors(),
      ], 422);
    } catch (\Exception $e) {
      Log::error('Profile completion failed', [
        'user_id' => $request->user()->id,
        'error' => $e->getMessage(),
      ]);

      return response()->json([
        'success' => false,
        'message' => 'Failed to save profile: ' . $e->getMessage(),
      ], 500);
    }
  }

  /**
   * Upload profile photo.
   */
  public function uploadPhoto(Request $request): JsonResponse
  {
    try {
      $user = $request->user();

      $request->validate([
        'photo' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
      ]);

      $profile = ApplicantProfile::firstOrCreate(
        ['user_id' => $user->id],
        ['first_name' => '', 'last_name' => '']
      );

      if ($profile->photo_path && Storage::disk('public')->exists($profile->photo_path)) {
        Storage::disk('public')->delete($profile->photo_path);
      }

      $fileName = 'profile_' . $user->id . '_' . time() . '.' . $request->file('photo')->getClientOriginalExtension();
      $path = $request->file('photo')->storeAs('profile_photos', $fileName, 'public');

      $profile->photo_path = $path;
      $profile->save();

      return response()->json([
        'success' => true,
        'data' => [
          'photo_url' => asset('storage/' . $path),
          'photo_path' => $path,
        ],
        'message' => 'Photo uploaded successfully.',
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
        'message' => 'Photo upload failed: ' . $e->getMessage(),
      ], 500);
    }
  }

  /**
   * Delete profile photo.
   */
  public function deletePhoto(Request $request): JsonResponse
  {
    try {
      $user = $request->user();
      $profile = ApplicantProfile::where('user_id', $user->id)->first();

      if (!$profile || !$profile->photo_path) {
        return response()->json([
          'success' => false,
          'message' => 'No photo found to delete.',
        ], 404);
      }

      if (Storage::disk('public')->exists($profile->photo_path)) {
        Storage::disk('public')->delete($profile->photo_path);
      }

      $profile->photo_path = null;
      $profile->save();

      return response()->json([
        'success' => true,
        'message' => 'Photo deleted successfully.',
      ]);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Failed to delete photo: ' . $e->getMessage(),
      ], 500);
    }
  }

  /**
   * Upload a CV.
   */
  public function uploadCv(Request $request): JsonResponse
  {
    try {
      $user = $request->user();

      $validated = $request->validate([
        'cv' => 'required|file|mimes:pdf,doc,docx|max:5120',
      ]);

      $profile = ApplicantProfile::firstOrCreate(
        ['user_id' => $user->id],
        ['first_name' => '', 'last_name' => '']
      );

      if (ApplicantCv::hasReachedMaxEntries($profile->id, true)) {
        return response()->json([
          'success' => false,
          'message' => sprintf('Maximum %d CVs reached.', ApplicantCv::MAX_CVS_PER_PROFILE),
        ], 422);
      }

      $path = $validated['cv']->store("cvs/{$profile->id}", 'public');

      $maxPosition = ApplicantCv::where('applicant_profile_id', $profile->id)->max('order_position');
      $nextPosition = is_null($maxPosition) ? 0 : $maxPosition + 1;

      $cv = ApplicantCv::create([
        'applicant_profile_id' => $profile->id,
        'cv_path' => $path,
        'original_name' => $validated['cv']->getClientOriginalName(),
        'order_position' => $nextPosition,
        'is_primary' => false,
        'status' => 'pending',
      ]);

      return response()->json([
        'success' => true,
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
        ],
        'message' => 'CV uploaded successfully.',
      ], 201);
    } catch (ValidationException $e) {
      return response()->json([
        'success' => false,
        'message' => 'Validation failed.',
        'errors' => $e->errors(),
      ], 422);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'CV upload failed: ' . $e->getMessage(),
      ], 500);
    }
  }

  /**
   * Delete a CV.
   */
  public function destroyCv(Request $request, int $cvId): JsonResponse
  {
    try {
      $user = $request->user();
      $cv = ApplicantCv::findOrFail($cvId);

      if ($cv->applicantProfile?->user_id !== $user->id) {
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
        'message' => 'CV removed successfully.',
      ]);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Failed to delete CV: ' . $e->getMessage(),
      ], 500);
    }
  }

  /**
   * Set a CV as primary.
   */
  public function setPrimaryCv(Request $request, int $cvId): JsonResponse
  {
    try {
      $user = $request->user();
      $cv = ApplicantCv::findOrFail($cvId);

      if ($cv->applicantProfile?->user_id !== $user->id) {
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

  // ============== HELPER METHODS ==============

  private function formatProfileData(ApplicantProfile $profile): array
  {
    return [
      'id' => $profile->id,
      'first_name' => $profile->first_name,
      'last_name' => $profile->last_name,
      'birth_date' => $profile->birth_date?->format('Y-m-d'),
      'gender' => $profile->gender,
      'blood_type' => $profile->blood_type,
      'phone' => $profile->phone,
      'address' => $profile->address,
      'social_links' => $profile->social_links ?? [],
      'experience_years' => $profile->experience_years,
      'current_job_title' => $profile->current_job_title,
      'photo_path' => $profile->photo_path,
      'photo_url' => $profile->photo_path ? asset('storage/' . $profile->photo_path) : null,
      'cvs' => $profile->cvs->map(fn($cv) => [
        'id' => $cv->id,
        'original_name' => $cv->original_name,
        'status' => $cv->status,
        'is_primary' => $cv->is_primary,
        'order_position' => $cv->order_position,
        'upload_date' => $cv->created_at?->toISOString(),
        'url' => asset('storage/' . $cv->cv_path),
      ]),
      'job_histories' => $profile->jobHistories,
      'education_histories' => $profile->educationHistories,
      'achievements' => $profile->achievements,
    ];
  }

  private function updateCVs(int $profileId, array $cvs): void
  {
    foreach ($cvs as $cvData) {
      if (isset($cvData['id'])) {
        ApplicantCv::where('id', $cvData['id'])
          ->where('applicant_profile_id', $profileId)
          ->update([
            'is_primary' => $cvData['is_primary'] ?? false,
            'order_position' => $cvData['order_position'] ?? 0,
          ]);
      }
    }
  }

  private function updateJobHistories(int $profileId, array $jobs): void
  {
    $existingIds = JobHistory::where('applicant_profile_id', $profileId)->pluck('id')->toArray();
    $submittedIds = [];

    foreach ($jobs as $jobData) {
      if (isset($jobData['id'])) {
        $submittedIds[] = $jobData['id'];
        JobHistory::where('id', $jobData['id'])
          ->where('applicant_profile_id', $profileId)
          ->update([
            'company_name' => $jobData['company_name'],
            'position' => $jobData['position'],
            'starting_year' => $jobData['starting_year'],
            'ending_year' => $jobData['is_current'] ? null : $jobData['ending_year'],
            'is_current' => $jobData['is_current'] ?? false,
          ]);
      } else {
        $newJob = JobHistory::create([
          'applicant_profile_id' => $profileId,
          'company_name' => $jobData['company_name'],
          'position' => $jobData['position'],
          'starting_year' => $jobData['starting_year'],
          'ending_year' => $jobData['is_current'] ? null : ($jobData['ending_year'] ?? null),
          'is_current' => $jobData['is_current'] ?? false,
        ]);
        $submittedIds[] = $newJob->id;
      }
    }

    $toDelete = array_diff($existingIds, $submittedIds);
    if (!empty($toDelete)) {
      JobHistory::whereIn('id', $toDelete)->delete();
    }
  }

  private function updateEducationHistories(int $profileId, array $educations): void
  {
    $existingIds = EducationHistory::where('applicant_profile_id', $profileId)->pluck('id')->toArray();
    $submittedIds = [];

    foreach ($educations as $eduData) {
      if (isset($eduData['id'])) {
        $submittedIds[] = $eduData['id'];
        EducationHistory::where('id', $eduData['id'])
          ->where('applicant_profile_id', $profileId)
          ->update([
            'institution_name' => $eduData['institution_name'],
            'degree' => $eduData['degree'],
            'passing_year' => $eduData['passing_year'],
          ]);
      } else {
        $newEdu = EducationHistory::create([
          'applicant_profile_id' => $profileId,
          'institution_name' => $eduData['institution_name'],
          'degree' => $eduData['degree'],
          'passing_year' => $eduData['passing_year'],
        ]);
        $submittedIds[] = $newEdu->id;
      }
    }

    $toDelete = array_diff($existingIds, $submittedIds);
    if (!empty($toDelete)) {
      EducationHistory::whereIn('id', $toDelete)->delete();
    }
  }

  private function updateAchievements(int $profileId, array $achievements): void
  {
    $existingIds = Achievement::where('applicant_profile_id', $profileId)->pluck('id')->toArray();
    $submittedIds = [];

    foreach ($achievements as $achData) {
      if (isset($achData['id'])) {
        $submittedIds[] = $achData['id'];
        Achievement::where('id', $achData['id'])
          ->where('applicant_profile_id', $profileId)
          ->update([
            'achievement_name' => $achData['achievement_name'],
            'achievement_details' => $achData['achievement_details'] ?? null,
          ]);
      } else {
        $newAch = Achievement::create([
          'applicant_profile_id' => $profileId,
          'achievement_name' => $achData['achievement_name'],
          'achievement_details' => $achData['achievement_details'] ?? null,
        ]);
        $submittedIds[] = $newAch->id;
      }
    }

    $toDelete = array_diff($existingIds, $submittedIds);
    if (!empty($toDelete)) {
      Achievement::whereIn('id', $toDelete)->delete();
    }
  }

  private function activatePendingCvs(int $profileId): void
  {
    $pendingCount = ApplicantCv::where('applicant_profile_id', $profileId)
      ->where('status', 'pending')->count();

    $activeCount = ApplicantCv::where('applicant_profile_id', $profileId)
      ->where('status', 'active')->count();

    $canActivate = min($pendingCount, ApplicantCv::MAX_CVS_PER_PROFILE - $activeCount);

    if ($canActivate > 0) {
      ApplicantCv::where('applicant_profile_id', $profileId)
        ->where('status', 'pending')
        ->limit($canActivate)
        ->update(['status' => 'active']);

      ApplicantCv::reorderCvs($profileId);

      $primary = ApplicantCv::getPrimaryCv($profileId);
      if (!$primary) {
        $first = ApplicantCv::where('applicant_profile_id', $profileId)
          ->where('status', 'active')
          ->orderBy('order_position')
          ->first();
        if ($first) {
          $first->setAsPrimary();
        }
      }
    }
  }
}
