<?php
// app/Http/Controllers/Frontend/FrontendController.php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class FrontendController extends Controller
{
    /**
     * Serve any asset from storage (images, files, etc.)
     * Works for both static theme assets and user uploads
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
}
