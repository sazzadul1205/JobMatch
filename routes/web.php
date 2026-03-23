<?php
// routes/web.php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\JobListingController;
use App\Http\Controllers\ApplicationController;

// Public routes (no authentication required)
Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Job listings public view (for unauthenticated users)
Route::get('/jobs', [JobListingController::class, 'publicIndex'])->name('jobs.public');
Route::get('/jobs/{jobListing}', [JobListingController::class, 'publicShow'])->name('jobs.show.public');

// Authenticated routes
Route::middleware(['auth'])->group(function () {

    // Dashboard
    Route::get('/dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Backend routes with backend.listing pattern
    Route::prefix('backend')->name('backend.')->group(function () {

        // Job Listing routes (backend.listing.*)
        Route::resource('listing', JobListingController::class)
            ->parameters(['listing' => 'jobListing'])
            ->names([
                'index' => 'listing.index',
                'create' => 'listing.create',
                'store' => 'listing.store',
                'show' => 'listing.show',
                'edit' => 'listing.edit',
                'update' => 'listing.update',
                'destroy' => 'listing.destroy',
            ]);

        // Additional job listing routes
        Route::prefix('listing')->name('listing.')->group(function () {
            Route::get('{jobListing}/applications', [JobListingController::class, 'applications'])
                ->name('applications');
            Route::patch('{jobListing}/toggle-active', [JobListingController::class, 'toggleActive'])
                ->name('toggle-active');
        });

        // Application routes (backend.application.*)
        Route::prefix('application')->name('application.')->group(function () {
            Route::get('/', [ApplicationController::class, 'index'])->name('index');
            Route::get('{application}', [ApplicationController::class, 'show'])->name('show');
            Route::patch('{application}/status', [ApplicationController::class, 'updateStatus'])->name('update-status');
            Route::get('{application}/resume', [ApplicationController::class, 'downloadResume'])->name('download-resume');
            Route::delete('{application}', [ApplicationController::class, 'destroy'])->name('destroy');
            Route::post('{application}/recalculate-score', [ApplicationController::class, 'recalculateScore'])->name('recalculate-score');
        });

        // ATS Analytics routes (backend.analytics.*)
        Route::prefix('analytics')->name('analytics.')->middleware(['role:employer,admin'])->group(function () {
            Route::get('/dashboard', [ApplicationController::class, 'analyticsDashboard'])->name('dashboard');
            Route::get('/jobs/{jobListing}/ats-analysis', [ApplicationController::class, 'jobATSAnalysis'])->name('job.ats');
            Route::get('/stats', [ApplicationController::class, 'getATSStats'])->name('stats');
        });
    });

    // Profile and Settings routes
    Route::prefix('settings')->name('settings.')->group(function () {
        Route::get('/profile', [\App\Http\Controllers\Settings\ProfileController::class, 'edit'])->name('profile');
        Route::patch('/profile', [\App\Http\Controllers\Settings\ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/profile', [\App\Http\Controllers\Settings\ProfileController::class, 'destroy'])->name('profile.destroy');

        Route::get('/password', [\App\Http\Controllers\Settings\PasswordController::class, 'edit'])->name('password');
        Route::put('/password', [\App\Http\Controllers\Settings\PasswordController::class, 'update'])->name('password.update');
    });
});

// Include auth routes
require __DIR__ . '/auth.php';
