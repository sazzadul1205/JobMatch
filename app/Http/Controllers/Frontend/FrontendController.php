<?php
// app/Http/Controllers/Frontend/FrontendController.php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Page;
use App\Models\SharedComponent;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class FrontendController extends Controller
{
    /**
     * Serve any asset from storage (images, files, etc.)
     */
    public function asset(string $path)
    {
        // Security: Prevent path traversal attacks
        if (Str::contains($path, '..')) {
            abort(404);
        }

        // Check if file exists in storage
        if (!Storage::disk('public')->exists($path)) {
            abort(404);
        }

        // Get file mime type from the resolved local file path
        $fullPath = Storage::disk('public')->path($path);
        $mimeType = mime_content_type($fullPath) ?: 'application/octet-stream';

        // Cache for 1 year for better performance
        $cacheTime = 31536000; // 1 year in seconds

        // Return file with proper headers and caching
        return response()
            ->file($fullPath, ['Content-Type' => $mimeType])
            ->setCache([
                'public' => true,
                'max_age' => $cacheTime,
                's_maxage' => $cacheTime
            ]);
    }

    /**
     * @param array<string, mixed>|array<int, mixed> $data
     */
    private function convertAssetPaths(array &$data, callable $assetFn): void
    {
        foreach ($data as &$value) {
            if (is_string($value) && str_starts_with($value, '/storage/')) {
                $value = $assetFn($value);
            } elseif (is_array($value)) {
                $this->convertAssetPaths($value, $assetFn);
            }
        }
    }

    /**
     * Get shared data for all frontend pages from database
     */
    private function getSharedData(): array
    {
        // Asset helper function using route
        $asset = function ($path) {
            // Remove /storage/ prefix if present and convert to route
            $cleanPath = preg_replace('#^/storage/#', '', $path);
            return route('asset', ['path' => ltrim($cleanPath, '/')]);
        };

        $sharedData = [];

        // Get all active shared components from database
        $components = SharedComponent::active()->get();

        foreach ($components as $component) {
            $propName = $component->component_key . 'Data';
            $data = $component->data;

            // Convert asset paths in the data
            $this->convertAssetPaths($data, $asset);

            $sharedData[$propName] = $data;
        }

        return $sharedData;
    }

    /**
     * Build page configuration from database
     */
    private function buildPageConfig(Page $page): array
    {
        // Asset helper for converting paths
        $asset = function ($path) {
            $cleanPath = preg_replace('#^/storage/#', '', $path);
            return route('asset', ['path' => ltrim($cleanPath, '/')]);
        };

        // Get all enabled sections for this page, ordered by order
        $pageSections = $page->pageSections()
            ->with('section')
            ->where('is_enabled', true)
            ->ordered()
            ->get();

        $sections = [];
        $pageData = [];

        foreach ($pageSections as $pageSection) {
            // Get the data and convert asset paths
            $data = $pageSection->data;
            $this->convertAssetPaths($data, $asset);

            // Get custom props
            $customProps = $pageSection->custom_props ?? [];

            // Build section configuration
            $sectionConfig = [
                'id' => $pageSection->section_key,
                'component' => $pageSection->section?->component ?? $pageSection->section_key,
                'enabled' => true,
                'order' => $pageSection->order,
                'customProps' => $customProps,
            ];

            // Handle special components (is_special_component = true)
            if ($pageSection->is_special_component) {
                $sectionConfig['isSpecialComponent'] = true;
                $pageData[$pageSection->section_key] = $data;
            }
            // Handle regular sections with prop_name
            elseif ($pageSection->hasPropName()) {
                $sectionConfig['propName'] = $pageSection->prop_name;
                $sectionConfig['dataKey'] = $pageSection->section_key;
                $pageData[$pageSection->section_key] = $data;
            }
            // Handle multi-prop sections (no prop_name)
            else {
                // Spread the data into pageData (for components like BlogSection)
                $pageData = array_merge($pageData, $data);
            }

            $sections[] = $sectionConfig;
        }

        return [
            'sectionConfig' => ['sections' => $sections],
            'pageData' => $pageData,
        ];
    }

    /**
     * Get page by slug (handles both top-level and sub-pages)
     */
    private function getPageBySlug(string $slug, ?int $parentId = null): ?Page
    {
        $query = Page::where('slug', $slug)->published();

        if ($parentId !== null) {
            $query->where('parent_id', $parentId);
        } else {
            $query->whereNull('parent_id');
        }

        return $query->first();
    }

    /**
     * Handle dynamic page routing
     */
    private function renderPage(string $slug, ?string $subSlug = null): Response
    {
        // Handle sub-pages (e.g., about/vision-mission)
        if ($subSlug) {
            $parentPage = $this->getPageBySlug($slug);
            if (!$parentPage) {
                abort(404, 'Parent page not found');
            }

            $page = $this->getPageBySlug($subSlug, $parentPage->id);
            if (!$page) {
                abort(404, 'Page not found');
            }
        } else {
            $page = $this->getPageBySlug($slug);
            if (!$page) {
                abort(404, 'Page not found');
            }
        }

        // Build configuration from database
        $config = $this->buildPageConfig($page);

        // Get shared data (TopBar, Navbar, Footer)
        $sharedData = $this->getSharedData();

        // Determine which React component to use based on template
        $component = $this->getPageComponent($page);

        return Inertia::render($component, array_merge(
            $sharedData,
            [
                'sectionConfig' => $config['sectionConfig'],
                'slug' => $page->slug,
                'pageTitle' => $page->title,
                ...$config['pageData'],
            ]
        ));
    }

    /**
     * Determine which React component to use for a page
     */
    private function getPageComponent(Page $page): string
    {
        // Check if this page has special handling
        if ($page->page_type === 'about_sub') {
            return 'Frontend/AboutDetails/AboutDetails';
        }

        if ($page->page_type === 'program') {
            return 'Frontend/ProjectsAndProgramsDetails/ProjectsAndProgramsDetails';
        }

        if ($page->page_type === 'blog') {
            // For blog index page
            if ($page->slug === 'blogs') {
                return 'Frontend/Blogs/Blogs';
            }
            // For individual blog posts
            return 'Frontend/BlogDetails/BlogDetails';
        }

        // Regular pages use DynamicPage
        return 'Frontend/Home/Home';
    }

    // ============================================
    // PUBLIC ROUTE METHODS
    // ============================================

    /**
     * Home page
     */
    public function home(): Response
    {
        return $this->renderPage('home');
    }

    /**
     * About page
     */
    public function about(): Response
    {
        return $this->renderPage('about');
    }

    /**
     * About sub-pages (e.g., /about/vision-mission)
     */
    public function aboutDetails(string $slug): Response
    {
        return $this->renderPage('about', $slug);
    }

    /**
     * Projects & Programs page
     */
    public function projectsPrograms(): Response
    {
        return $this->renderPage('projects-programs');
    }

    /**
     * Projects & Programs sub-pages (e.g., /projects-programs/micro-finance)
     */
    public function projectsProgramsDetails(string $slug): Response
    {
        return $this->renderPage('projects-programs', $slug);
    }

    /**
     * Blogs listing page
     */
    public function blogs(): Response
    {
        return $this->renderPage('blogs');
    }

    /**
     * Individual blog post page
     */
    public function blogDetails(string $slug): Response
    {
        return $this->renderPage('blogs', $slug);
    }

    /**
     * Contact Us page
     */
    public function contactUs(): Response
    {
        return $this->renderPage('contact');
    }

    /**
     * Generic page renderer for any slug
     * (Useful for CMS-created pages)
     */
    public function page(string $slug): Response
    {
        $page = Page::where('slug', $slug)
            ->whereNull('parent_id')
            ->published()
            ->first();

        if (!$page) {
            abort(404);
        }

        return $this->renderPage($slug);
    }
}
