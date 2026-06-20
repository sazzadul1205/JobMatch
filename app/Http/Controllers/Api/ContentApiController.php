<?php
// app/Http/Controllers/Api/ContentApiController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ContentApiController extends Controller
{
  /**
   * Get pages with query parameters
   * 
   * @param Request $request
   * @return JsonResponse
   */
  public function pages(Request $request): JsonResponse
  {
    $query = DB::table('pages')
      ->where('is_active', 1)
      ->select('id', 'slug', 'name', 'title', 'description', 'is_active', 'created_at', 'updated_at');

    // Filter by slug
    if ($request->has('slug')) {
      $query->where('slug', $request->slug);
    }

    // Filter by multiple slugs
    if ($request->has('slugs')) {
      $slugs = explode(',', $request->slugs);
      $query->whereIn('slug', $slugs);
    }

    // Search by name or title
    if ($request->has('search')) {
      $search = '%' . $request->search . '%';
      $query->where(function ($q) use ($search) {
        $q->where('name', 'like', $search)
          ->orWhere('title', 'like', $search)
          ->orWhere('description', 'like', $search);
      });
    }

    // Sorting
    $sortBy = $request->sort_by ?? 'id';
    $sortOrder = $request->sort_order ?? 'asc';
    $allowedSorts = ['id', 'slug', 'name', 'title', 'created_at', 'updated_at'];

    if (in_array($sortBy, $allowedSorts)) {
      $query->orderBy($sortBy, $sortOrder);
    }

    // Pagination
    $perPage = $request->per_page ?? 15;
    $perPage = min(max($perPage, 1), 100); // Clamp between 1-100

    if ($request->has('page')) {
      $data = $query->paginate($perPage);
    } else {
      $data = $query->get();
    }

    return response()->json(['data' => $data]);
  }

  /**
   * Get section configs with query parameters
   * 
   * @param Request $request
   * @return JsonResponse
   */
  public function sectionConfigs(Request $request): JsonResponse
  {
    $query = DB::table('section_configs')
      ->where('is_enabled', 1)
      ->orderBy('display_order');

    // Filter by page slug
    if ($request->has('page_slug')) {
      $query->where('page_slug', $request->page_slug);
    }

    // Filter by component
    if ($request->has('component')) {
      $query->where('component', $request->component);
    }

    // Filter by multiple components
    if ($request->has('components')) {
      $components = explode(',', $request->components);
      $query->whereIn('component', $components);
    }

    // Filter by data table
    if ($request->has('data_table')) {
      $query->where('data_table', $request->data_table);
    }

    // Get only fixed sections
    if ($request->has('is_fixed_section')) {
      $query->where('is_fixed_section', (int) $request->is_fixed_section);
    }

    // Search by component or data_key
    if ($request->has('search')) {
      $search = '%' . $request->search . '%';
      $query->where(function ($q) use ($search) {
        $q->where('component', 'like', $search)
          ->orWhere('data_key', 'like', $search)
          ->orWhere('section_key', 'like', $search);
      });
    }

    // Filter by display order range
    if ($request->has('display_order_min')) {
      $query->where('display_order', '>=', (int) $request->display_order_min);
    }
    if ($request->has('display_order_max')) {
      $query->where('display_order', '<=', (int) $request->display_order_max);
    }

    // Sorting
    $sortBy = $request->sort_by ?? 'display_order';
    $sortOrder = $request->sort_order ?? 'asc';
    $allowedSorts = ['id', 'display_order', 'component', 'page_slug', 'created_at'];

    if (in_array($sortBy, $allowedSorts)) {
      $query->orderBy($sortBy, $sortOrder);
    }

    // Pagination
    $perPage = $request->per_page ?? 50;
    $perPage = min(max($perPage, 1), 200);

    if ($request->has('page')) {
      $data = $query->paginate($perPage);
    } else {
      $data = $query->get();
    }

    return response()->json(['data' => $data]);
  }

  /**
   * Get shared data with query parameters
   * 
   * @param Request $request
   * @return JsonResponse
   */
  public function sharedData(Request $request): JsonResponse
  {
    $query = DB::table('shared_data')
      ->where('is_active', 1);

    // Filter by type
    if ($request->has('type')) {
      $query->where('type', $request->type);
    }

    // Filter by multiple types
    if ($request->has('types')) {
      $types = explode(',', $request->types);
      $query->whereIn('type', $types);
    }

    // Search by type or data content
    if ($request->has('search')) {
      $search = '%' . $request->search . '%';
      $query->where(function ($q) use ($search) {
        $q->where('type', 'like', $search)
          ->orWhere('data', 'like', $search);
      });
    }

    // Deep search within JSON data
    if ($request->has('json_search')) {
      $search = '%' . $request->json_search . '%';
      $query->where('data', 'like', $search);
    }

    // Sorting
    $sortBy = $request->sort_by ?? 'type';
    $sortOrder = $request->sort_order ?? 'asc';
    $allowedSorts = ['id', 'type', 'created_at', 'updated_at'];

    if (in_array($sortBy, $allowedSorts)) {
      $query->orderBy($sortBy, $sortOrder);
    }

    // Pagination
    $perPage = $request->per_page ?? 50;
    $perPage = min(max($perPage, 1), 200);

    if ($request->has('page')) {
      $data = $query->paginate($perPage);
    } else {
      $data = $query->get();
    }

    return response()->json(['data' => $data]);
  }

  /**
   * Get custom section data with query parameters
   * 
   * @param Request $request
   * @return JsonResponse
   */
  public function customSectionData(Request $request): JsonResponse
  {
    $query = DB::table('custom_section_data')
      ->where('is_active', 1);

    // Filter by page slug
    if ($request->has('page_slug')) {
      $query->where('page_slug', $request->page_slug);
    }

    // Filter by section key
    if ($request->has('section_key')) {
      $query->where('section_key', $request->section_key);
    }

    // Filter by multiple section keys
    if ($request->has('section_keys')) {
      $keys = explode(',', $request->section_keys);
      $query->whereIn('section_key', $keys);
    }

    // Search by section_key or data content
    if ($request->has('search')) {
      $search = '%' . $request->search . '%';
      $query->where(function ($q) use ($search) {
        $q->where('section_key', 'like', $search)
          ->orWhere('data', 'like', $search);
      });
    }

    // Get only active or inactive
    if ($request->has('is_active')) {
      $query->where('is_active', (int) $request->is_active);
    }

    // Sorting
    $sortBy = $request->sort_by ?? 'id';
    $sortOrder = $request->sort_order ?? 'asc';
    $allowedSorts = ['id', 'page_slug', 'section_key', 'is_active', 'created_at'];

    if (in_array($sortBy, $allowedSorts)) {
      $query->orderBy($sortBy, $sortOrder);
    }

    // Pagination
    $perPage = $request->per_page ?? 50;
    $perPage = min(max($perPage, 1), 200);

    if ($request->has('page')) {
      $data = $query->paginate($perPage);
    } else {
      $data = $query->get();
    }

    return response()->json(['data' => $data]);
  }

  /**
   * Get programs with query parameters
   * 
   * @param Request $request
   * @return JsonResponse
   */
  public function programs(Request $request): JsonResponse
  {
    $query = DB::table('programs')
      ->where('is_active', 1);

    // Filter by slug
    if ($request->has('slug')) {
      $query->where('slug', $request->slug);
    }

    // Filter by multiple slugs
    if ($request->has('slugs')) {
      $slugs = explode(',', $request->slugs);
      $query->whereIn('slug', $slugs);
    }

    // Filter by featured status
    if ($request->has('is_featured')) {
      $query->where('is_featured', (int) $request->is_featured);
    }

    // Filter by category
    if ($request->has('category')) {
      $query->where('category', $request->category);
    }

    // Filter by multiple categories
    if ($request->has('categories')) {
      $categories = explode(',', $request->categories);
      $query->whereIn('category', $categories);
    }

    // Search by title or description
    if ($request->has('search')) {
      $search = '%' . $request->search . '%';
      $query->where(function ($q) use ($search) {
        $q->where('title', 'like', $search)
          ->orWhere('description', 'like', $search)
          ->orWhere('content', 'like', $search);
      });
    }

    // Filter by display order range
    if ($request->has('display_order_min')) {
      $query->where('display_order', '>=', (int) $request->display_order_min);
    }
    if ($request->has('display_order_max')) {
      $query->where('display_order', '<=', (int) $request->display_order_max);
    }

    // Filter by date range
    if ($request->has('created_from')) {
      $query->where('created_at', '>=', $request->created_from);
    }
    if ($request->has('created_to')) {
      $query->where('created_at', '<=', $request->created_to);
    }

    // Sorting
    $sortBy = $request->sort_by ?? 'display_order';
    $sortOrder = $request->sort_order ?? 'asc';
    $allowedSorts = ['id', 'title', 'display_order', 'is_featured', 'created_at', 'updated_at'];

    if (in_array($sortBy, $allowedSorts)) {
      $query->orderBy($sortBy, $sortOrder);
    }

    // Limit
    if ($request->has('limit')) {
      $limit = (int) $request->limit;
      $limit = min(max($limit, 1), 100);
      $query->limit($limit);
    }

    // Pagination
    $perPage = $request->per_page ?? 15;
    $perPage = min(max($perPage, 1), 100);

    if ($request->has('page')) {
      $data = $query->paginate($perPage);
    } else {
      $data = $query->get();
    }

    return response()->json(['data' => $data]);
  }

  /**
   * Get blogs with query parameters
   * 
   * @param Request $request
   * @return JsonResponse
   */
  public function blogs(Request $request): JsonResponse
  {
    $query = DB::table('blogs')
      ->where('is_active', 1);

    // Filter by slug
    if ($request->has('slug')) {
      $query->where('slug', $request->slug);
    }

    // Filter by multiple slugs
    if ($request->has('slugs')) {
      $slugs = explode(',', $request->slugs);
      $query->whereIn('slug', $slugs);
    }

    // Filter by featured status
    if ($request->has('is_featured')) {
      $query->where('is_featured', (int) $request->is_featured);
    }

    // Filter by author
    if ($request->has('author')) {
      $query->where('author', 'like', '%' . $request->author . '%');
    }

    // Filter by category
    if ($request->has('category')) {
      $query->where('category', $request->category);
    }

    // Filter by multiple categories
    if ($request->has('categories')) {
      $categories = explode(',', $request->categories);
      $query->whereIn('category', $categories);
    }

    // Filter by tag
    if ($request->has('tag')) {
      $query->where('tags', 'like', '%"' . $request->tag . '"%')
        ->orWhere('tags', 'like', '%' . $request->tag . '%');
    }

    // Filter by multiple tags
    if ($request->has('tags')) {
      $tags = explode(',', $request->tags);
      $query->where(function ($q) use ($tags) {
        foreach ($tags as $tag) {
          $q->orWhere('tags', 'like', '%"' . trim($tag) . '"%')
            ->orWhere('tags', 'like', '%' . trim($tag) . '%');
        }
      });
    }

    // Search by title, excerpt, or content
    if ($request->has('search')) {
      $search = '%' . $request->search . '%';
      $query->where(function ($q) use ($search) {
        $q->where('title', 'like', $search)
          ->orWhere('excerpt', 'like', $search)
          ->orWhere('content', 'like', $search)
          ->orWhere('full_content', 'like', $search);
      });
    }

    // Filter by date range
    if ($request->has('created_from')) {
      $query->where('created_at', '>=', $request->created_from);
    }
    if ($request->has('created_to')) {
      $query->where('created_at', '<=', $request->created_to);
    }

    // Filter by publish date range
    if ($request->has('published_from')) {
      $query->where('published_at', '>=', $request->published_from);
    }
    if ($request->has('published_to')) {
      $query->where('published_at', '<=', $request->published_to);
    }

    // Sorting
    $sortBy = $request->sort_by ?? 'created_at';
    $sortOrder = $request->sort_order ?? 'desc';
    $allowedSorts = ['id', 'title', 'author', 'is_featured', 'created_at', 'updated_at', 'published_at'];

    if (in_array($sortBy, $allowedSorts)) {
      $query->orderBy($sortBy, $sortOrder);
    }

    // Limit
    if ($request->has('limit')) {
      $limit = (int) $request->limit;
      $limit = min(max($limit, 1), 100);
      $query->limit($limit);
    }

    // Pagination
    $perPage = $request->per_page ?? 15;
    $perPage = min(max($perPage, 1), 100);

    if ($request->has('page')) {
      $data = $query->paginate($perPage);
    } else {
      $data = $query->get();
    }

    return response()->json(['data' => $data]);
  }

  /**
   * Get about content with query parameters
   * 
   * @param Request $request
   * @return JsonResponse
   */
  public function aboutContent(Request $request): JsonResponse
  {
    $query = DB::table('about_content')
      ->where('is_active', 1);

    // Filter by slug
    if ($request->has('slug')) {
      $query->where('slug', $request->slug);
    }

    // Filter by multiple slugs
    if ($request->has('slugs')) {
      $slugs = explode(',', $request->slugs);
      $query->whereIn('slug', $slugs);
    }

    // Search by title or content
    if ($request->has('search')) {
      $search = '%' . $request->search . '%';
      $query->where(function ($q) use ($search) {
        $q->where('title', 'like', $search)
          ->orWhere('content', 'like', $search)
          ->orWhere('full_content', 'like', $search);
      });
    }

    // Filter by display order range
    if ($request->has('display_order_min')) {
      $query->where('display_order', '>=', (int) $request->display_order_min);
    }
    if ($request->has('display_order_max')) {
      $query->where('display_order', '<=', (int) $request->display_order_max);
    }

    // Sorting
    $sortBy = $request->sort_by ?? 'display_order';
    $sortOrder = $request->sort_order ?? 'asc';
    $allowedSorts = ['id', 'title', 'slug', 'display_order', 'created_at', 'updated_at'];

    if (in_array($sortBy, $allowedSorts)) {
      $query->orderBy($sortBy, $sortOrder);
    }

    // Limit
    if ($request->has('limit')) {
      $limit = (int) $request->limit;
      $limit = min(max($limit, 1), 100);
      $query->limit($limit);
    }

    // Pagination
    $perPage = $request->per_page ?? 15;
    $perPage = min(max($perPage, 1), 100);

    if ($request->has('page')) {
      $data = $query->paginate($perPage);
    } else {
      $data = $query->get();
    }

    return response()->json(['data' => $data]);
  }

  /**
   * Get jobs with query parameters
   * 
   * @param Request $request
   * @return JsonResponse
   */
  public function jobs(Request $request): JsonResponse
  {
    try {
      $query = DB::table('job_listings')
        ->where('is_active', 1);

      // Filter by slug
      if ($request->has('slug')) {
        $query->where('slug', $request->slug);
      }

      // Filter by job type
      if ($request->has('type')) {
        $query->where('job_type', $request->type);
      }

      // Filter by multiple job types
      if ($request->has('types')) {
        $types = explode(',', $request->types);
        $query->whereIn('job_type', $types);
      }

      // Filter by department
      if ($request->has('department')) {
        $query->where('department', 'like', '%' . $request->department . '%');
      }

      // Filter by location
      if ($request->has('location')) {
        $query->where('location', 'like', '%' . $request->location . '%');
      }

      // Search by title or description
      if ($request->has('search')) {
        $search = '%' . $request->search . '%';
        $query->where(function ($q) use ($search) {
          $q->where('title', 'like', $search)
            ->orWhere('description', 'like', $search);
        });
      }

      // Filter by view count
      if ($request->has('min_views')) {
        $query->where('views_count', '>=', (int) $request->min_views);
      }
      if ($request->has('max_views')) {
        $query->where('views_count', '<=', (int) $request->max_views);
      }

      // Filter by date range
      if ($request->has('created_from')) {
        $query->where('created_at', '>=', $request->created_from);
      }
      if ($request->has('created_to')) {
        $query->where('created_at', '<=', $request->created_to);
      }

      // Filter by deadline
      if ($request->has('deadline_before')) {
        $query->where('application_deadline', '<=', $request->deadline_before);
      }
      if ($request->has('deadline_after')) {
        $query->where('application_deadline', '>=', $request->deadline_after);
      }

      // Get top N most viewed
      if ($request->has('most_viewed')) {
        $limit = (int) $request->most_viewed;
        $limit = min(max($limit, 1), 20);
        $query->orderBy('views_count', 'desc')->limit($limit);
      }

      // Sorting
      $sortBy = $request->sort_by ?? 'created_at';
      $sortOrder = $request->sort_order ?? 'desc';
      $allowedSorts = ['id', 'title', 'job_type', 'views_count', 'created_at', 'updated_at', 'application_deadline'];

      if (in_array($sortBy, $allowedSorts)) {
        $query->orderBy($sortBy, $sortOrder);
      }

      // Limit
      if ($request->has('limit')) {
        $limit = (int) $request->limit;
        $limit = min(max($limit, 1), 100);
        $query->limit($limit);
      }

      // Get data with optional formatting
      $data = $query->get();

      // Apply formatting if requested
      if ($request->has('format') && $request->format === 'react') {
        $data = $data->map(function ($job) {
          return [
            'id' => $job->id,
            'type' => $this->formatJobType($job->job_type),
            'department' => $this->getDepartmentFromTitle($job->title),
            'location' => $job->location ?? 'Bangladesh',
            'title' => $job->title,
            'description' => $job->description ?? 'No description available.',
            'link' => "/jobs/{$job->slug}",
            'views' => $job->views_count ?? 0,
          ];
        });
      }

      // Pagination
      if ($request->has('page')) {
        $perPage = $request->per_page ?? 15;
        $perPage = min(max($perPage, 1), 100);
        $paginated = $query->paginate($perPage);

        if ($request->has('format') && $request->format === 'react') {
          $paginated->getCollection()->transform(function ($job) {
            return [
              'id' => $job->id,
              'type' => $this->formatJobType($job->job_type),
              'department' => $this->getDepartmentFromTitle($job->title),
              'location' => $job->location ?? 'Bangladesh',
              'title' => $job->title,
              'description' => $job->description ?? 'No description available.',
              'link' => "/jobs/{$job->slug}",
              'views' => $job->views_count ?? 0,
            ];
          });
        }

        return response()->json(['data' => $paginated]);
      }

      return response()->json(['data' => $data]);
    } catch (\Exception $e) {
      return response()->json(['data' => [], 'error' => $e->getMessage()], 500);
    }
  }

  /**
   * Format job type to match React's expected format
   */
  private function formatJobType(?string $type): string
  {
    if (!$type) return 'Full time';

    $mapping = [
      'full-time' => 'Full time',
      'part-time' => 'Part time',
      'contract' => 'Contract',
      'internship' => 'Internship',
      'remote' => 'Remote',
      'hybrid' => 'Hybrid',
    ];

    return $mapping[$type] ?? ucfirst(str_replace('-', ' ', $type));
  }

  /**
   * Extract department from job title
   */
  private function getDepartmentFromTitle(string $title): string
  {
    $keywords = [
      'Manager' => 'Management',
      'Developer' => 'IT & Development',
      'Engineer' => 'IT & Development',
      'Designer' => 'Creative',
      'Marketing' => 'Marketing',
      'Sales' => 'Sales',
      'HR' => 'Human Resources',
      'Finance' => 'Finance',
      'Accountant' => 'Finance',
      'Support' => 'Customer Support',
      'Analyst' => 'Data & Analytics',
      'Specialist' => 'Operations',
      'Coordinator' => 'Operations',
      'Executive' => 'Management',
      'Officer' => 'Operations',
      'Assistant' => 'Operations',
      'Intern' => 'Entry Level',
    ];

    foreach ($keywords as $keyword => $department) {
      if (stripos($title, $keyword) !== false) {
        return $department;
      }
    }

    return 'General';
  }
}
