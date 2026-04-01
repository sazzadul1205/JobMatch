<?php

// routes/web.php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\JobListingController;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\JobCategoryController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\PublicJobListingController;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\EmailVerificationRequest;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

// Home
Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Public job listings (no auth)
Route::get('/jobs', [JobListingController::class, 'publicIndex'])->name('jobs.public');
Route::get('/jobs/{jobListing}', [JobListingController::class, 'publicShow'])->name('jobs.show.public');


/*
|--------------------------------------------------------------------------
| Authenticated + VERIFIED Routes (MAIN APP AREA)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified'])->group(function () {

    /*
    | Dashboard
    */
    Route::get('/dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    /*
    | Backend (Admin/Employer Panel)
    */
    // Inside your authenticated and verified routes group
    Route::prefix('backend')->name('backend.')->group(function () {

        /*
    |--------------------------------------------------------------------------
    | Locations Management
    |--------------------------------------------------------------------------
    */
        Route::prefix('locations')->name('locations.')->group(function () {
            // Custom routes first
            Route::patch('{location}/toggle', [LocationController::class, 'toggleActive'])->name('toggle');
            Route::patch('{location}/restore', [LocationController::class, 'restore'])->name('restore');
            Route::delete('{location}/force-delete', [LocationController::class, 'forceDelete'])->name('force-delete');
            Route::get('active', [LocationController::class, 'getActiveLocations'])->name('active');

            // Resource routes
            Route::get('/', [LocationController::class, 'index'])->name('index');
            Route::post('/', [LocationController::class, 'store'])->name('store');
            Route::put('{location}', [LocationController::class, 'update'])->name('update');
            Route::delete('{location}', [LocationController::class, 'destroy'])->name('destroy');
        });


        /*
    |--------------------------------------------------------------------------
    | Job Categories Management
    |--------------------------------------------------------------------------
    */
        Route::prefix('categories')->name('categories.')->group(function () {
            // Custom routes first
            Route::patch('{category}/toggle', [JobCategoryController::class, 'toggleActive'])->name('toggle');
            Route::patch('{category}/restore', [JobCategoryController::class, 'restore'])->name('restore');
            Route::delete('{category}/force-delete', [JobCategoryController::class, 'forceDelete'])->name('force-delete');
            Route::get('active', [JobCategoryController::class, 'getActiveCategories'])->name('active');

            // Resource routes
            Route::get('/', [JobCategoryController::class, 'index'])->name('index');
            Route::post('/', [JobCategoryController::class, 'store'])->name('store');
            Route::put('{category}', [JobCategoryController::class, 'update'])->name('update');
            Route::delete('{category}', [JobCategoryController::class, 'destroy'])->name('destroy');
        });

        /*
    |--------------------------------------------------------------------------
    | Job Listings Management
    |--------------------------------------------------------------------------
    */
        Route::prefix('listing')->name('listing.')->group(function () {
            // Custom routes first
            Route::patch('{jobListing}/toggle-active', [JobListingController::class, 'toggleActive'])->name('toggle-active');
            Route::patch('{jobListing}/restore', [JobListingController::class, 'restore'])->name('restore');
            Route::delete('{jobListing}/force-delete', [JobListingController::class, 'forceDelete'])->name('force-delete');
            Route::get('{jobListing}/applications', [JobListingController::class, 'applications'])->name('applications');

            // Resource routes
            Route::get('/', [JobListingController::class, 'index'])->name('index');
            Route::get('/create', [JobListingController::class, 'create'])->name('create');
            Route::post('/', [JobListingController::class, 'store'])->name('store');
            Route::get('{jobListing}', [JobListingController::class, 'show'])->name('show');
            Route::get('{jobListing}/edit', [JobListingController::class, 'edit'])->name('edit');
            Route::put('{jobListing}', [JobListingController::class, 'update'])->name('update');
            Route::delete('{jobListing}', [JobListingController::class, 'destroy'])->name('destroy');
        });

        /*
    |--------------------------------------------------------------------------
    | Public Job Listings Management
    |--------------------------------------------------------------------------
    */
        Route::prefix('public-jobs')->name('public-jobs.')->group(function () {
            Route::get('/', [PublicJobListingController::class, 'index'])->name('index');
            Route::get('{slug}', [PublicJobListingController::class, 'show'])->name('show');
        });


        /*
    |--------------------------------------------------------------------------
    | Applications Management
    |--------------------------------------------------------------------------
    */
        Route::prefix('application')->name('application.')->group(function () {
            Route::match(['get', 'post'], '/', [ApplicationController::class, 'index'])->name('index');
            Route::patch('bulk-status', [ApplicationController::class, 'bulkUpdateStatus'])->name('bulk-status');
            Route::get('merge-resumes', [ApplicationController::class, 'mergeResumes'])->name('merge-resumes');

            Route::get('{application}', [ApplicationController::class, 'show'])->name('show');
            Route::patch('{application}/status', [ApplicationController::class, 'updateStatus'])->name('update-status');
            Route::get('{application}/resume', [ApplicationController::class, 'downloadResume'])->name('download-resume');
            Route::delete('{application}', [ApplicationController::class, 'destroy'])->name('destroy');
            Route::post('{application}/recalculate-score', [ApplicationController::class, 'recalculateScore'])->name('recalculate-score');
        });
    });

    /*
    | Job Applications (Job Seekers)
    */
    Route::get('applications/{jobListing}/create', [ApplicationController::class, 'create'])
        ->name('applications.create');

    Route::post('applications/{jobListing}', [ApplicationController::class, 'store'])
        ->name('applications.store');

    /*
    | Settings
    */
    Route::prefix('settings')->name('settings.')->group(function () {

        Route::get('/profile', [\App\Http\Controllers\Settings\ProfileController::class, 'edit'])->name('profile');
        Route::patch('/profile', [\App\Http\Controllers\Settings\ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/profile', [\App\Http\Controllers\Settings\ProfileController::class, 'destroy'])->name('profile.destroy');

        Route::get('/password', [\App\Http\Controllers\Settings\PasswordController::class, 'edit'])->name('password');
        Route::put('/password', [\App\Http\Controllers\Settings\PasswordController::class, 'update'])->name('password.update');
    });
});


/*
|--------------------------------------------------------------------------
| EMAIL VERIFICATION ROUTES
|--------------------------------------------------------------------------
*/

Route::get('/email-verified', function () {
    return Inertia::render('auth/EmailVerified');
})->name('verification.verified');

// When user clicks email verification link
Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
    $request->fulfill();
    return redirect()->route('verification.verified');
})->middleware(['auth', 'signed'])->name('verification.verify');


// Resend verification email
Route::post('/email/verification-notification', function (Request $request) {
    $request->user()->sendEmailVerificationNotification();

    return response()->json([
        'message' => 'Verification link sent'
    ]);
})->middleware(['auth', 'throttle:6,1'])->name('verification.send');


/*
|--------------------------------------------------------------------------
| AUTH ROUTES
|--------------------------------------------------------------------------
*/

require __DIR__ . '/auth.php';
