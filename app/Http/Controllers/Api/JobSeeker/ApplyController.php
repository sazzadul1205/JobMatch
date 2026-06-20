<?php

namespace App\Http\Controllers\Api\JobSeeker;

use App\Http\Controllers\Controller;
use App\Models\JobListing;
use App\Models\Application;
use App\Models\ApplicantCv;
use App\Models\ApplicantProfile;
use App\Models\User;
use App\Services\ATSService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class ApplyController extends Controller
{
  protected ATSService $atsService;

  public function __construct(ATSService $atsService)
  {
    $this->atsService = $atsService;
  }

  /**
   * List all applications for the authenticated user.
   */
  public function index(Request $request): JsonResponse
  {
    try {
      $user = $request->user();

      $query = Application::withTrashed()
        ->where('user_id', $user->id)
        ->with(['jobListing', 'jobListing.employer'])
        ->orderBy('created_at', 'desc');

      // Filter by status
      if ($request->filled('status')) {
        $query->where('status', $request->status);
      }

      // Filter by date range
      if ($request->filled('from_date')) {
        $query->whereDate('created_at', '>=', $request->from_date);
      }
      if ($request->filled('to_date')) {
        $query->whereDate('created_at', '<=', $request->to_date);
      }

      // Include trashed
      $includeTrashed = $request->boolean('include_trashed', false);
      if (!$includeTrashed) {
        $query->whereNull('deleted_at');
      }

      $perPage = $request->get('per_page', 10);
      $applications = $query->paginate($perPage)->through(function ($application) {
        return $this->formatApplication($application);
      });

      // Stats
      $stats = [
        'total' => Application::where('user_id', $user->id)->whereNull('deleted_at')->count(),
        'total_deleted' => Application::onlyTrashed()->where('user_id', $user->id)->count(),
        'pending' => Application::where('user_id', $user->id)->whereNull('deleted_at')->where('status', Application::STATUS_PENDING)->count(),
        'shortlisted' => Application::where('user_id', $user->id)->whereNull('deleted_at')->where('status', Application::STATUS_SHORTLISTED)->count(),
        'rejected' => Application::where('user_id', $user->id)->whereNull('deleted_at')->where('status', Application::STATUS_REJECTED)->count(),
        'hired' => Application::where('user_id', $user->id)->whereNull('deleted_at')->where('status', Application::STATUS_HIRED)->count(),
        'average_ats_score' => Application::where('user_id', $user->id)
          ->whereNull('deleted_at')
          ->whereNotNull('ats_score')
          ->where('ats_calculation_status', Application::ATS_COMPLETED)
          ->avg(DB::raw('JSON_EXTRACT(ats_score, "$.percentage")')) ?? 0,
      ];

      return response()->json([
        'success' => true,
        'data' => [
          'applications' => $applications,
          'stats' => $stats,
        ]
      ]);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Failed to fetch applications: ' . $e->getMessage(),
      ], 500);
    }
  }

  /**
   * Show application form data.
   */
  public function create(Request $request, string $slug): JsonResponse
  {
    try {
      $user = $request->user();

      $jobListing = JobListing::where('slug', $slug)
        ->where('is_active', true)
        ->whereNull('deleted_at')
        ->where('application_deadline', '>=', now())
        ->firstOrFail();

      // Get or create applicant profile
      $applicantProfile = $user->applicantProfile;
      if (!$applicantProfile) {
        $applicantProfile = ApplicantProfile::create([
          'user_id' => $user->id,
          'first_name' => explode(' ', $user->name)[0] ?? '',
          'last_name' => explode(' ', $user->name)[1] ?? '',
        ]);
      }

      // Get user's CVs
      $cvs = ApplicantCv::where('applicant_profile_id', $applicantProfile->id)
        ->where('status', 'active')
        ->orderBy('is_primary', 'desc')
        ->orderBy('order_position')
        ->get()
        ->map(fn($cv) => [
          'id' => $cv->id,
          'original_name' => $cv->original_name,
          'url' => asset('storage/' . $cv->cv_path),
          'is_primary' => $cv->is_primary,
          'order_position' => $cv->order_position,
        ]);

      // Check existing application
      $existingApplication = Application::withTrashed()
        ->where('user_id', $user->id)
        ->where('job_listing_id', $jobListing->id)
        ->first();

      return response()->json([
        'success' => true,
        'data' => [
          'job' => [
            'id' => $jobListing->id,
            'title' => $jobListing->title,
            'slug' => $jobListing->slug,
            'job_type' => $jobListing->job_type,
            'experience_level' => $jobListing->experience_level,
            'application_deadline' => $jobListing->application_deadline?->toISOString(),
            'required_linkedin_link' => $jobListing->required_linkedin_link,
            'required_facebook_link' => $jobListing->required_facebook_link,
            'salary_min' => $jobListing->salary_min,
            'salary_max' => $jobListing->salary_max,
            'as_per_companies_policy' => $jobListing->as_per_companies_policy,
            'is_salary_negotiable' => $jobListing->is_salary_negotiable,
          ],
          'applicant_profile' => [
            'id' => $applicantProfile->id,
            'first_name' => $applicantProfile->first_name,
            'last_name' => $applicantProfile->last_name,
            'email' => $user->email,
            'phone' => $applicantProfile->phone,
            'experience_years' => $applicantProfile->experience_years,
            'current_job_title' => $applicantProfile->current_job_title,
            'social_links' => $applicantProfile->social_links ?? [],
          ],
          'cvs' => $cvs,
          'has_existing_application' => !is_null($existingApplication),
          'existing_application_trashed' => $existingApplication ? $existingApplication->trashed() : false,
        ]
      ]);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Failed to load application form: ' . $e->getMessage(),
      ], 500);
    }
  }

  /**
   * Store a new application.
   */
  public function store(Request $request): JsonResponse
  {
    try {
      $user = $request->user();

      // Validate required fields
      $validated = $request->validate([
        'job_id' => 'required|exists:job_listings,id',
        'cv_id' => 'required|exists:applicant_cvs,id',
        'name' => 'required|string|max:255',
        'email' => 'required|email|max:255',
        'phone' => 'nullable|string|max:20',
        'expected_salary' => 'nullable|numeric|min:0',
        'cover_letter' => 'nullable|string',
        'linkedin_link' => 'nullable|url|max:255',
        'facebook_link' => 'nullable|url|max:255',
      ]);

      $jobListing = JobListing::findOrFail($validated['job_id']);

      // Check job is active and deadline valid
      if (!$jobListing->is_active || $jobListing->application_deadline < now()) {
        return response()->json([
          'success' => false,
          'message' => 'This job is no longer accepting applications.',
        ], 400);
      }

      // Check for existing application
      $existingApplication = Application::withTrashed()
        ->where('user_id', $user->id)
        ->where('job_listing_id', $jobListing->id)
        ->first();

      if ($existingApplication && $existingApplication->trashed()) {
        // Force delete soft-deleted application
        if ($existingApplication->resume_path && Storage::disk('public')->exists($existingApplication->resume_path)) {
          Storage::disk('public')->delete($existingApplication->resume_path);
        }
        $existingApplication->forceDelete();
      } elseif ($existingApplication) {
        return response()->json([
          'success' => false,
          'message' => 'You have already applied for this position.',
        ], 400);
      }

      // Get the CV
      $cv = ApplicantCv::findOrFail($validated['cv_id']);

      // Verify CV belongs to user
      $profile = ApplicantProfile::where('user_id', $user->id)->first();
      if (!$profile || $cv->applicant_profile_id !== $profile->id) {
        return response()->json([
          'success' => false,
          'message' => 'Invalid CV selected.',
        ], 400);
      }

      // Create application
      $application = Application::create([
        'user_id' => $user->id,
        'job_listing_id' => $jobListing->id,
        'applicant_profile_id' => $profile->id,
        'name' => $validated['name'],
        'email' => $validated['email'],
        'phone' => $validated['phone'] ?? null,
        'expected_salary' => $validated['expected_salary'] ?? null,
        'resume_path' => $cv->cv_path,
        'status' => Application::STATUS_PENDING,
        'linkedin_link' => $validated['linkedin_link'] ?? null,
        'facebook_link' => $validated['facebook_link'] ?? null,
        'ats_calculation_status' => Application::ATS_PENDING,
        'ats_attempt_count' => 0,
      ]);

      // Update profile with latest info
      $profile->update([
        'phone' => $validated['phone'] ?? $profile->phone,
      ]);

      // Calculate ATS score
      $atsCalculated = $this->calculateAtsInline($application);

      return response()->json([
        'success' => true,
        'message' => 'Application submitted successfully!' . ($atsCalculated ? ' ATS score calculated.' : ' ATS calculation is pending.'),
        'data' => [
          'application' => $this->formatApplication($application),
          'ats_calculated' => $atsCalculated,
        ]
      ], 201);
    } catch (ValidationException $e) {
      return response()->json([
        'success' => false,
        'message' => 'Validation failed.',
        'errors' => $e->errors(),
      ], 422);
    } catch (\Exception $e) {
      Log::error('Application submission failed', [
        'user_id' => $request->user()->id,
        'error' => $e->getMessage(),
      ]);

      return response()->json([
        'success' => false,
        'message' => 'Failed to submit application: ' . $e->getMessage(),
      ], 500);
    }
  }

  /**
   * Show a specific application.
   */
  public function show(Request $request, int $id): JsonResponse
  {
    try {
      $user = $request->user();

      $application = Application::withTrashed()
        ->with(['jobListing', 'jobListing.employer', 'applicantProfile', 'statusTimelines'])
        ->where('user_id', $user->id)
        ->findOrFail($id);

      return response()->json([
        'success' => true,
        'data' => [
          'application' => $this->formatApplication($application, true),
          'status_timeline' => $application->statusTimelines->map(fn($timeline) => [
            'status' => $timeline->status,
            'notes' => $timeline->notes,
            'created_at' => $timeline->created_at?->toISOString(),
          ]),
          'ats_details' => $this->formatAtsDetails($application),
          'job' => [
            'id' => $application->jobListing->id,
            'title' => $application->jobListing->title,
            'slug' => $application->jobListing->slug,
            'job_type' => $application->jobListing->job_type,
            'experience_level' => $application->jobListing->experience_level,
            'employer' => $application->jobListing->employer ? [
              'name' => $application->jobListing->employer->name,
              'email' => $application->jobListing->employer->email,
            ] : null,
          ],
          'is_deleted' => $application->trashed(),
        ]
      ]);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Application not found.',
      ], 404);
    }
  }

  /**
   * Show edit form data for an application.
   */
  public function edit(Request $request, int $id): JsonResponse
  {
    try {
      $user = $request->user();

      $application = Application::where('user_id', $user->id)
        ->findOrFail($id);

      // Only allow editing if pending
      if ($application->status !== Application::STATUS_PENDING) {
        return response()->json([
          'success' => false,
          'message' => 'Cannot edit application. Status: ' . $application->status,
        ], 400);
      }

      $profile = $application->applicantProfile ?? $user->applicantProfile;

      // Get user's CVs
      $cvs = [];
      $currentCvId = null;

      if ($profile) {
        $cvs = ApplicantCv::where('applicant_profile_id', $profile->id)
          ->where('status', 'active')
          ->orderBy('is_primary', 'desc')
          ->orderBy('order_position')
          ->get()
          ->map(fn($cv) => [
            'id' => $cv->id,
            'original_name' => $cv->original_name,
            'url' => asset('storage/' . $cv->cv_path),
            'is_primary' => $cv->is_primary,
            'order_position' => $cv->order_position,
          ]);

        // Find current CV
        foreach ($cvs as $cv) {
          if ($cv['url'] && str_contains($cv['url'], $application->resume_path)) {
            $currentCvId = $cv['id'];
            break;
          }
        }
        if (!$currentCvId && $cvs->isNotEmpty()) {
          $primary = $cvs->firstWhere('is_primary', true);
          $currentCvId = $primary ? $primary['id'] : $cvs->first()['id'];
        }
      }

      return response()->json([
        'success' => true,
        'data' => [
          'application' => [
            'id' => $application->id,
            'name' => $application->name,
            'email' => $application->email,
            'phone' => $application->phone,
            'expected_salary' => $application->expected_salary,
            'linkedin_link' => $application->linkedin_link,
            'facebook_link' => $application->facebook_link,
            'resume_path' => $application->resume_path,
          ],
          'job' => [
            'id' => $application->jobListing->id,
            'title' => $application->jobListing->title,
            'slug' => $application->jobListing->slug,
            'required_linkedin_link' => $application->jobListing->required_linkedin_link,
            'required_facebook_link' => $application->jobListing->required_facebook_link,
          ],
          'cvs' => $cvs,
          'current_cv_id' => $currentCvId,
        ]
      ]);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Failed to load edit form: ' . $e->getMessage(),
      ], 500);
    }
  }

  /**
   * Update an existing application.
   */
  public function update(Request $request, int $id): JsonResponse
  {
    try {
      $user = $request->user();

      $application = Application::where('user_id', $user->id)
        ->findOrFail($id);

      if ($application->status !== Application::STATUS_PENDING) {
        return response()->json([
          'success' => false,
          'message' => 'Cannot edit application. Status: ' . $application->status,
        ], 400);
      }

      $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|max:255',
        'phone' => 'nullable|string|max:20',
        'expected_salary' => 'nullable|numeric|min:0',
        'cv_id' => 'required|exists:applicant_cvs,id',
        'linkedin_link' => 'nullable|url|max:255',
        'facebook_link' => 'nullable|url|max:255',
      ]);

      $cv = ApplicantCv::findOrFail($validated['cv_id']);
      $profile = ApplicantProfile::where('user_id', $user->id)->first();

      if (!$profile || $cv->applicant_profile_id !== $profile->id) {
        return response()->json([
          'success' => false,
          'message' => 'Invalid CV selected.',
        ], 400);
      }

      $resumeChanged = $application->resume_path !== $cv->cv_path;

      // Update application
      $application->update([
        'name' => $validated['name'],
        'email' => $validated['email'],
        'phone' => $validated['phone'] ?? null,
        'expected_salary' => $validated['expected_salary'] ?? null,
        'resume_path' => $cv->cv_path,
        'linkedin_link' => $validated['linkedin_link'] ?? null,
        'facebook_link' => $validated['facebook_link'] ?? null,
      ]);

      // Reset ATS if resume changed
      if ($resumeChanged) {
        $application->update([
          'ats_calculation_status' => Application::ATS_PENDING,
          'ats_score' => null,
          'matched_keywords' => null,
          'missing_keywords' => null,
          'ats_attempt_count' => 0,
        ]);
        $this->calculateAtsInline($application);
      }

      return response()->json([
        'success' => true,
        'message' => 'Application updated successfully.' . ($resumeChanged ? ' ATS recalculated.' : ''),
        'data' => [
          'application' => $this->formatApplication($application),
          'ats_recalculated' => $resumeChanged,
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
        'message' => 'Failed to update application: ' . $e->getMessage(),
      ], 500);
    }
  }

  /**
   * Withdraw/Cancel an application (Soft Delete).
   */
  public function destroy(Request $request, int $id): JsonResponse
  {
    try {
      $user = $request->user();

      $application = Application::where('user_id', $user->id)
        ->findOrFail($id);

      if ($application->status !== Application::STATUS_PENDING) {
        return response()->json([
          'success' => false,
          'message' => 'Cannot withdraw application. Status: ' . $application->status,
        ], 400);
      }

      // Clear resume path and soft delete
      $application->update(['resume_path' => null]);
      $application->delete();

      return response()->json([
        'success' => true,
        'message' => 'Application withdrawn successfully.',
      ]);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Failed to withdraw application: ' . $e->getMessage(),
      ], 500);
    }
  }

  /**
   * Restore a soft-deleted application.
   */
  public function restore(Request $request, int $id): JsonResponse
  {
    try {
      $user = $request->user();

      $application = Application::withTrashed()
        ->where('user_id', $user->id)
        ->findOrFail($id);

      if (!$application->trashed()) {
        return response()->json([
          'success' => false,
          'message' => 'Application is not deleted.',
        ], 400);
      }

      $application->restore();

      return response()->json([
        'success' => true,
        'message' => 'Application restored successfully.',
        'data' => ['application' => $this->formatApplication($application)],
      ]);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Failed to restore application: ' . $e->getMessage(),
      ], 500);
    }
  }

  /**
   * Force delete a soft-deleted application.
   */
  public function forceDelete(Request $request, int $id): JsonResponse
  {
    try {
      $user = $request->user();

      $application = Application::withTrashed()
        ->where('user_id', $user->id)
        ->findOrFail($id);

      if (!$application->trashed()) {
        return response()->json([
          'success' => false,
          'message' => 'Please withdraw the application first.',
        ], 400);
      }

      // Delete resume file
      if ($application->resume_path && Storage::disk('public')->exists($application->resume_path)) {
        Storage::disk('public')->delete($application->resume_path);
      }

      $application->forceDelete();

      return response()->json([
        'success' => true,
        'message' => 'Application permanently deleted.',
      ]);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Failed to delete application: ' . $e->getMessage(),
      ], 500);
    }
  }

  /**
   * Get trashed applications.
   */
  public function trashed(Request $request): JsonResponse
  {
    try {
      $user = $request->user();

      $query = Application::onlyTrashed()
        ->where('user_id', $user->id)
        ->with(['jobListing', 'jobListing.employer'])
        ->orderBy('deleted_at', 'desc');

      if ($request->filled('search')) {
        $search = $request->search;
        $query->whereHas('jobListing', fn($q) => $q->where('title', 'like', "%{$search}%"));
      }

      $perPage = $request->get('per_page', 10);
      $applications = $query->paginate($perPage)->through(function ($application) {
        return $this->formatApplication($application);
      });

      return response()->json([
        'success' => true,
        'data' => [
          'applications' => $applications,
          'total_deleted' => Application::onlyTrashed()->where('user_id', $user->id)->count(),
        ]
      ]);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Failed to fetch trashed applications: ' . $e->getMessage(),
      ], 500);
    }
  }

  /**
   * Recalculate ATS score.
   */
  public function recalculateAts(Request $request, int $id): JsonResponse
  {
    try {
      $user = $request->user();

      $application = Application::where('user_id', $user->id)
        ->findOrFail($id);

      // Check if recalculation is allowed
      if (!$this->canRecalculateAts($application)) {
        return response()->json([
          'success' => false,
          'message' => 'ATS calculation is already in progress.',
        ], 422);
      }

      $success = $this->calculateAtsInline($application);

      return response()->json([
        'success' => $success,
        'message' => $success ? 'ATS score recalculated successfully.' : 'ATS recalculation failed.',
        'data' => [
          'ats_score' => $application->getAtsScorePercentageAttribute(),
          'ats_status' => $application->ats_calculation_status,
          'ats_details' => $this->formatAtsDetails($application),
        ]
      ]);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Failed to recalculate ATS: ' . $e->getMessage(),
      ], 500);
    }
  }

  /**
   * Get ATS status.
   */
  public function getAtsStatus(Request $request, int $id): JsonResponse
  {
    try {
      $user = $request->user();

      $application = Application::where('user_id', $user->id)
        ->findOrFail($id);

      return response()->json([
        'success' => true,
        'data' => [
          'status' => $application->ats_calculation_status,
          'score' => $application->getAtsScorePercentageAttribute(),
          'can_recalculate' => $this->canRecalculateAts($application),
          'is_stuck' => $application->isAtsCalculationStuck(),
        ]
      ]);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Failed to get ATS status: ' . $e->getMessage(),
      ], 500);
    }
  }

  // ============== PRIVATE METHODS ==============

  private function calculateAtsInline(Application $application): bool
  {
    try {
      $application->load('jobListing');

      if (!$application->jobListing) {
        throw new \Exception('Job listing not found');
      }

      $application->update(['ats_calculation_status' => Application::ATS_PROCESSING]);

      $result = $this->atsService->calculateScore($application, $application->jobListing);

      $application->update([
        'ats_score' => $result,
        'matched_keywords' => $result['matched_keywords'] ?? [],
        'missing_keywords' => $result['missing_keywords'] ?? [],
        'ats_calculation_status' => Application::ATS_COMPLETED,
        'ats_last_attempted_at' => now(),
        'ats_attempt_count' => ($application->ats_attempt_count ?? 0) + 1,
      ]);

      return true;
    } catch (\Throwable $e) {
      Log::error('ATS calculation failed: ' . $e->getMessage(), [
        'application_id' => $application->id,
      ]);

      $application->update([
        'ats_calculation_status' => Application::ATS_FAILED,
        'ats_score' => [
          'percentage' => 0,
          'error' => $e->getMessage(),
          'status' => 'failed',
          'analysis' => [
            'level' => 'Error',
            'message' => 'Unable to calculate ATS score. Please try again.',
            'color' => 'red',
            'suggestions' => ['Try uploading a different resume format (PDF preferred).']
          ]
        ],
        'ats_last_attempted_at' => now(),
      ]);

      return false;
    }
  }

  private function canRecalculateAts(Application $application): bool
  {
    if ($application->ats_calculation_status === Application::ATS_PROCESSING) {
      return $application->isAtsCalculationStuck();
    }

    return in_array($application->ats_calculation_status, [
      Application::ATS_COMPLETED,
      Application::ATS_FAILED
    ]);
  }

  private function formatApplication(Application $application, bool $detailed = false): array
  {
    $atsPercentage = $application->getAtsScorePercentageAttribute();

    $data = [
      'id' => $application->id,
      'name' => $application->name,
      'email' => $application->email,
      'phone' => $application->phone,
      'expected_salary' => $application->expected_salary,
      'status' => $application->status,
      'created_at' => $application->created_at?->toISOString(),
      'updated_at' => $application->updated_at?->toISOString(),
      'deleted_at' => $application->deleted_at?->toISOString(),
      'ats_score' => $atsPercentage,
      'ats_calculation_status' => $application->ats_calculation_status,
      'job' => [
        'id' => $application->jobListing?->id,
        'title' => $application->jobListing?->title,
        'slug' => $application->jobListing?->slug,
        'employer' => $application->jobListing?->employer?->name ?? 'Unknown',
      ],
      'resume_url' => $application->resume_path ? asset('storage/' . $application->resume_path) : null,
    ];

    if ($detailed) {
      $data['linkedin_link'] = $application->linkedin_link;
      $data['facebook_link'] = $application->facebook_link;
      $data['employer_notes'] = $application->employer_notes;
      $data['resume_name'] = $application->resume_path ? basename($application->resume_path) : null;
    }

    return $data;
  }

  private function formatAtsDetails(?Application $application): ?array
  {
    if (!$application || !$application->isAtsCompleted() || !$application->ats_score) {
      return null;
    }

    $atsScore = $application->ats_score;

    return [
      'percentage' => $atsScore['percentage'] ?? 0,
      'matched_keywords' => $application->matched_keywords ?? ($atsScore['matched_keywords'] ?? []),
      'missing_keywords' => $application->missing_keywords ?? ($atsScore['missing_keywords'] ?? []),
      'matched_count' => $atsScore['matched_count'] ?? count($application->matched_keywords ?? []),
      'total_keywords' => $atsScore['total_keywords'] ?? 0,
      'extracted_skills' => $atsScore['extracted_skills'] ?? [],
      'extracted_experience_years' => $atsScore['extracted_experience_years'] ?? 0,
      'extracted_education' => $atsScore['extracted_education'] ?? 'Not specified',
      'analysis' => $atsScore['analysis'] ?? [
        'level' => 'N/A',
        'message' => 'Analysis not available',
        'color' => 'gray',
        'suggestions' => []
      ],
      'calculated_at' => $atsScore['calculated_at'] ?? null,
    ];
  }
}
