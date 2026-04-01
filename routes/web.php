<?php

// routes/web.php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\JobListingController;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\JobCategoryController;
use App\Http\Controllers\LocationController;
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
    Route::prefix('backend')->name('backend.')->group(function () {

        // Inside your authenticated and verified routes group
        Route::resource('locations', LocationController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::resource('categories', JobCategoryController::class)->only(['index', 'store', 'update', 'destroy']);

        // Or with additional actions
        Route::patch('locations/{location}/toggle', [LocationController::class, 'toggleActive'])->name('locations.toggle');
        Route::patch('locations/{location}/restore', [LocationController::class, 'restore'])
            ->name('locations.restore');
        Route::patch('categories/{category}/toggle', [JobCategoryController::class, 'toggleActive'])->name('categories.toggle');


        // Job Listings CRUD
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

        // Extra listing actions
        Route::prefix('listing')->name('listing.')->group(function () {
            Route::get('{jobListing}/applications', [JobListingController::class, 'applications'])
                ->name('applications');

            Route::patch('{jobListing}/toggle-active', [JobListingController::class, 'toggleActive'])
                ->name('toggle-active');
        });

        /*
        | Applications
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
