<?php

namespace App\Http\Controllers\Api\JobSeeker;

use App\Http\Controllers\Controller;
use App\Models\JobListing;
use App\Models\JobCategory;
use App\Models\Location;
use App\Models\JobView;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class JobListingController extends Controller
{
  /**
   * Display public job listings with filters.
   */
  public function index(Request $request): JsonResponse
  {
    try {
      $query = JobListing::where('is_active', true)
        ->whereNull('deleted_at')
        ->where('application_deadline', '>=', now())
        ->with(['category', 'locations', 'employer'])
        ->withCount(['applications', 'views']);

      // Search filter
      if ($request->filled('search')) {
        $search = $request->search;
        $query->where(function ($q) use ($search) {
          $q->where('title', 'like', "%{$search}%")
            ->orWhere('description', 'like', "%{$search}%")
            ->orWhereHas('category', fn($cat) => $cat->where('name', 'like', "%{$search}%"))
            ->orWhereHas('locations', fn($loc) => $loc->where('name', 'like', "%{$search}%"));
        });
      }

      // Category filter
      if ($request->filled('category')) {
        $query->whereHas('category', fn($q) => $q->where('slug', $request->category));
      }

      // Location filter
      if ($request->filled('location')) {
        $query->whereHas('locations', fn($q) => $q->where('locations.id', $request->location));
      }

      // Job type filter
      if ($request->filled('job_type')) {
        $query->where('job_type', $request->job_type);
      }

      // Experience level filter
      if ($request->filled('experience_level')) {
        $query->where('experience_level', $request->experience_level);
      }

      // Salary range
      if ($request->filled('salary_min')) {
        $query->where('salary_max', '>=', $request->salary_min);
      }
      if ($request->filled('salary_max')) {
        $query->where('salary_min', '<=', $request->salary_max);
      }

      // Sorting
      $sort = $request->get('sort', 'latest');
      switch ($sort) {
        case 'latest':
          $query->orderBy('created_at', 'desc');
          break;
        case 'oldest':
          $query->orderBy('created_at', 'asc');
          break;
        case 'deadline_soon':
          $query->orderBy('application_deadline', 'asc');
          break;
        case 'deadline_later':
          $query->orderBy('application_deadline', 'desc');
          break;
        case 'salary_high':
          $query->orderByRaw('COALESCE(salary_max, salary_min, 0) DESC');
          break;
        case 'salary_low':
          $query->orderByRaw('COALESCE(salary_min, salary_max, 0) ASC');
          break;
        case 'popular':
          $query->orderBy('views_count', 'desc');
          break;
        case 'most_applied':
          $query->orderBy('applications_count', 'desc');
          break;
        default:
          $query->orderBy('created_at', 'desc');
      }

      $perPage = $request->get('per_page', 12);
      $jobListings = $query->paginate($perPage)->through(function ($job) {
        return $this->formatJobListing($job);
      });

      // Get filter options
      $filterOptions = $this->getFilterOptions();

      return response()->json([
        'success' => true,
        'data' => [
          'jobs' => $jobListings,
          'filters' => $request->only(['search', 'category', 'location', 'job_type', 'experience_level', 'salary_min', 'salary_max', 'sort']),
          'filter_options' => $filterOptions,
          'stats' => $this->getStats(),
        ]
      ]);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Failed to fetch jobs: ' . $e->getMessage(),
      ], 500);
    }
  }

  /**
   * Display a single job listing.
   */
  public function show(string $slug): JsonResponse
  {
    try {
      $jobListing = JobListing::where('slug', $slug)
        ->where('is_active', true)
        ->whereNull('deleted_at')
        ->where('application_deadline', '>=', now())
        ->with(['category', 'locations', 'employer'])
        ->withCount(['applications', 'views'])
        ->firstOrFail();

      // Record view
      $ipAddress = request()->ip();
      $alreadyViewed = JobView::where('job_listing_id', $jobListing->id)
        ->where('ip_address', $ipAddress)
        ->exists();

      if (!$alreadyViewed) {
        JobView::recordView($jobListing->id, Auth::id(), $ipAddress);
        $jobListing->incrementViews();
        $jobListing->refresh();
      }

      // Check if user has applied
      $hasApplied = false;
      $existingApplication = null;
      if (Auth::check()) {
        $existingApplication = $jobListing->applications()
          ->where('user_id', Auth::id())
          ->first();
        $hasApplied = !is_null($existingApplication);
      }

      // Get application stats
      $applications = $jobListing->applications()->get();
      $applicationStats = [
        'total' => $applications->count(),
        'pending' => $applications->where('status', 'pending')->count(),
        'shortlisted' => $applications->where('status', 'shortlisted')->count(),
        'rejected' => $applications->where('status', 'rejected')->count(),
        'hired' => $applications->where('status', 'hired')->count(),
      ];

      // Average ATS score
      $completedATS = $applications->filter(
        fn($app) =>
        $app->isAtsCompleted() && $app->ats_score && isset($app->ats_score['percentage'])
      );
      $averageAtsScore = null;
      if ($completedATS->count() > 0) {
        $totalScore = $completedATS->sum(fn($app) => $app->ats_score['percentage'] ?? 0);
        $averageAtsScore = round($totalScore / $completedATS->count(), 2);
      }

      // Related jobs
      $relatedJobs = JobListing::where('category_id', $jobListing->category_id)
        ->where('id', '!=', $jobListing->id)
        ->where('is_active', true)
        ->whereNull('deleted_at')
        ->where('application_deadline', '>=', now())
        ->with(['category', 'locations'])
        ->withCount(['applications', 'views'])
        ->limit(3)
        ->get()
        ->map(fn($job) => $this->formatJobListing($job));

      return response()->json([
        'success' => true,
        'data' => [
          'job' => $this->formatJobListing($jobListing, true),
          'has_applied' => $hasApplied,
          'existing_application' => $existingApplication,
          'application_stats' => $applicationStats,
          'average_ats_score' => $averageAtsScore,
          'related_jobs' => $relatedJobs,
          'total_views' => $jobListing->views()->count(),
        ]
      ]);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Job not found or expired.',
      ], 404);
    }
  }

  /**
   * Get popular jobs.
   */
  public function popular(Request $request): JsonResponse
  {
    try {
      $limit = $request->get('limit', 10);
      $popularJobs = JobListing::where('is_active', true)
        ->whereNull('deleted_at')
        ->where('application_deadline', '>=', now())
        ->with(['category', 'locations'])
        ->withCount(['applications', 'views'])
        ->orderBy('views_count', 'desc')
        ->limit($limit)
        ->get()
        ->map(fn($job) => $this->formatJobListing($job));

      return response()->json([
        'success' => true,
        'data' => $popularJobs,
      ]);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Failed to fetch popular jobs: ' . $e->getMessage(),
      ], 500);
    }
  }

  /**
   * Get trending jobs.
   */
  public function trending(Request $request): JsonResponse
  {
    try {
      $limit = $request->get('limit', 10);
      $trendingJobs = JobListing::where('is_active', true)
        ->whereNull('deleted_at')
        ->where('application_deadline', '>=', now())
        ->with(['category', 'locations'])
        ->withCount(['applications', 'views'])
        ->orderBy('applications_count', 'desc')
        ->limit($limit)
        ->get()
        ->map(fn($job) => $this->formatJobListing($job));

      return response()->json([
        'success' => true,
        'data' => $trendingJobs,
      ]);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Failed to fetch trending jobs: ' . $e->getMessage(),
      ], 500);
    }
  }

  // ============== HELPER METHODS ==============

  private function formatJobListing(JobListing $job, bool $detailed = false): array
  {
    $data = [
      'id' => $job->id,
      'title' => $job->title,
      'slug' => $job->slug,
      'job_type' => $job->job_type,
      'experience_level' => $job->experience_level,
      'salary_min' => $job->salary_min,
      'salary_max' => $job->salary_max,
      'is_salary_negotiable' => $job->is_salary_negotiable,
      'as_per_companies_policy' => $job->as_per_companies_policy,
      'application_deadline' => $job->application_deadline?->toISOString(),
      'views_count' => $job->views_count ?? 0,
      'applications_count' => $job->applications_count ?? 0,
      'category' => $job->category ? [
        'id' => $job->category->id,
        'name' => $job->category->name,
        'slug' => $job->category->slug,
      ] : null,
      'locations' => $job->locations->map(fn($loc) => [
        'id' => $loc->id,
        'name' => $loc->name,
      ]),
      'employer' => $job->employer ? [
        'id' => $job->employer->id,
        'name' => $job->employer->name,
        'email' => $job->employer->email,
      ] : null,
    ];

    if ($detailed) {
      $data['description'] = $job->description;
      $data['requirements'] = $job->requirements;
      $data['benefits'] = $job->benefits;
      $data['skills'] = $job->skills;
      $data['responsibilities'] = $job->responsibilities;
      $data['keywords'] = $job->keywords;
      $data['education_requirement'] = $job->education_requirement;
      $data['education_details'] = $job->education_details;
      $data['required_linkedin_link'] = $job->required_linkedin_link;
      $data['required_facebook_link'] = $job->required_facebook_link;
      $data['created_at'] = $job->created_at?->toISOString();
      $data['updated_at'] = $job->updated_at?->toISOString();
    }

    return $data;
  }

  private function getFilterOptions(): array
  {
    $categories = JobCategory::whereHas('jobListings', function ($query) {
      $query->where('is_active', true)
        ->whereNull('deleted_at')
        ->where('application_deadline', '>=', now());
    })
      ->withCount(['jobListings' => function ($query) {
        $query->where('is_active', true)
          ->whereNull('deleted_at')
          ->where('application_deadline', '>=', now());
      }])
      ->active()
      ->orderBy('name')
      ->get()
      ->map(fn($cat) => [
        'id' => $cat->id,
        'name' => $cat->name,
        'slug' => $cat->slug,
        'count' => $cat->job_listings_count,
      ]);

    $locations = Location::whereHas('jobListings', function ($query) {
      $query->where('is_active', true)
        ->whereNull('deleted_at')
        ->where('application_deadline', '>=', now());
    })
      ->withCount(['jobListings' => function ($query) {
        $query->where('is_active', true)
          ->whereNull('deleted_at')
          ->where('application_deadline', '>=', now());
      }])
      ->active()
      ->orderBy('name')
      ->get()
      ->map(fn($loc) => [
        'id' => $loc->id,
        'name' => $loc->name,
        'count' => $loc->job_listings_count,
      ]);

    $jobTypes = JobListing::where('is_active', true)
      ->whereNull('deleted_at')
      ->where('application_deadline', '>=', now())
      ->distinct()
      ->pluck('job_type')
      ->toArray();

    $experienceLevels = JobListing::where('is_active', true)
      ->whereNull('deleted_at')
      ->where('application_deadline', '>=', now())
      ->distinct()
      ->pluck('experience_level')
      ->toArray();

    $salaryStats = JobListing::where('is_active', true)
      ->whereNull('deleted_at')
      ->where('application_deadline', '>=', now())
      ->selectRaw('MIN(COALESCE(salary_min, salary_max)) as min_salary, MAX(COALESCE(salary_max, salary_min)) as max_salary')
      ->first();

    return [
      'categories' => $categories,
      'locations' => $locations,
      'job_types' => $jobTypes,
      'experience_levels' => $experienceLevels,
      'salary_range' => [
        'min' => (int)($salaryStats->min_salary ?? 0),
        'max' => (int)($salaryStats->max_salary ?? 1000000),
      ],
      'sort_options' => [
        ['value' => 'latest', 'label' => 'Latest'],
        ['value' => 'oldest', 'label' => 'Oldest'],
        ['value' => 'deadline_soon', 'label' => 'Deadline Soon'],
        ['value' => 'salary_high', 'label' => 'Salary: High to Low'],
        ['value' => 'salary_low', 'label' => 'Salary: Low to High'],
        ['value' => 'popular', 'label' => 'Most Viewed'],
        ['value' => 'most_applied', 'label' => 'Most Applied'],
      ],
    ];
  }

  private function getStats(): array
  {
    $totalJobs = JobListing::where('is_active', true)
      ->whereNull('deleted_at')
      ->where('application_deadline', '>=', now())
      ->count();

    $totalViews = JobListing::where('is_active', true)
      ->whereNull('deleted_at')
      ->where('application_deadline', '>=', now())
      ->sum('views_count');

    $totalApplications = JobListing::where('is_active', true)
      ->whereNull('deleted_at')
      ->where('application_deadline', '>=', now())
      ->withCount('applications')
      ->get()
      ->sum('applications_count');

    return [
      'total_jobs' => $totalJobs,
      'total_views' => $totalViews,
      'total_applications' => $totalApplications,
    ];
  }
}
