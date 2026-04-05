<?php

// routes/web.php


use App\Http\Controllers\ApplicantProfileController;
use App\Http\Controllers\ProfileCompletionController;
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
| Profile Completion Route
|--------------------------------------------------------------------------
*/

Route::middleware(['auth'])->group(function () {
    Route::get('/complete-profile', [ProfileCompletionController::class, 'show'])
        ->name('profile.complete');
    Route::get('/profile/photo/{path}', [ApplicantProfileController::class, 'photo'])
        ->where('path', '.*')
        ->name('profile.photo');
    Route::post('/profile/complete', [ProfileCompletionController::class, 'store'])
        ->name('profile.complete.store');
    Route::post('/profile/cv', [ProfileCompletionController::class, 'uploadCv'])
        ->middleware('throttle:profile-cv')
        ->name('profile.cv.upload');
    Route::delete('/profile/cv/{cv}', [ProfileCompletionController::class, 'destroyCv'])
        ->name('profile.cv.destroy');
    Route::patch('/profile/cv/{cv}/primary', [ProfileCompletionController::class, 'setPrimaryCv'])
        ->name('profile.cv.primary');
});


/*
|--------------------------------------------------------------------------
| Authenticated + VERIFIED Routes (MAIN APP AREA)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified', 'profile.complete'])->group(function () {

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



            // Add these routes inside your backend.listing group
            Route::post('/bulk-activate', [JobListingController::class, 'bulkActivate'])->name('bulk-activate');
            Route::post('/bulk-deactivate', [JobListingController::class, 'bulkDeactivate'])->name('bulk-deactivate');
            Route::delete('/bulk-delete', [JobListingController::class, 'bulkDelete'])->name('bulk-delete');

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
| Applicant Profile Routes
|--------------------------------------------------------------------------
*/
        Route::prefix('applicant')->name('applicant.')->group(function () {

            Route::get('/profile/create', [ApplicantProfileController::class, 'create'])->name('profile.create');
            Route::post('/profile', [ApplicantProfileController::class, 'store'])->name('profile.store');
            Route::get('/profile/{applicantProfile}/edit', [ApplicantProfileController::class, 'edit'])->name('profile.edit');
            Route::put('/profile/{applicantProfile}', [ApplicantProfileController::class, 'update'])->name('profile.update');
            Route::delete('/profile/{applicantProfile}', [ApplicantProfileController::class, 'destroy'])->name('profile.destroy');
            Route::get('/profile/{applicantProfile}/download-cv', [ApplicantProfileController::class, 'downloadCV'])->name('profile.download-cv');
            Route::post('/profile/{id}/restore', [ApplicantProfileController::class, 'restore'])->name('profile.restore');
            Route::get('/profile/{id?}', [ApplicantProfileController::class, 'show'])->name('profile.show');

            // Additional routes for the enhanced controller
            Route::patch('/profile/{applicantProfile}/basic-info', [ApplicantProfileController::class, 'updateBasicInfo'])->name('profile.update-basic-info');
            Route::patch('/profile/{applicantProfile}/professional-info', [ApplicantProfileController::class, 'updateProfessionalInfo'])->name('profile.update-professional-info');
            Route::put('/profile/{applicantProfile}/work-experiences', [ApplicantProfileController::class, 'updateWorkExperiences'])->name('profile.update-work-experiences');
            Route::put('/profile/{applicantProfile}/educations', [ApplicantProfileController::class, 'updateEducations'])->name('profile.update-educations');
            Route::put('/profile/{applicantProfile}/achievements', [ApplicantProfileController::class, 'updateAchievements'])->name('profile.update-achievements');
            Route::post('/profile/change-password', [ApplicantProfileController::class, 'changePassword'])->name('profile.change-password');
            Route::get('/profile/{applicantProfile}/data', [ApplicantProfileController::class, 'getProfileData'])->name('profile.get-data');
        });

        /*
    |--------------------------------------------------------------------------
    | Applications Management
    |--------------------------------------------------------------------------
    */
        Route::prefix('applications')->name('applications.')->group(function () {
            // Job-specific applications
            Route::get('/job/{jobListing}', [ApplicationController::class, 'index'])->name('job.index');

            // User-specific applications
            Route::get('/my-applications', [ApplicationController::class, 'myApplications'])->name('my-applications');

            // Create/Store
            Route::get('/create/{jobListing}', [ApplicationController::class, 'create'])->name('create');
            Route::post('/store/{jobListing}', [ApplicationController::class, 'store'])->name('store');

            // Single application CRUD
            Route::get('/{application}', [ApplicationController::class, 'show'])->name('show');
            Route::get('/{application}/edit', [ApplicationController::class, 'edit'])->name('edit');
            Route::put('/{application}', [ApplicationController::class, 'update'])->name('update');
            Route::delete('/{application}', [ApplicationController::class, 'destroy'])->name('destroy');

            // Status updates
            Route::patch('/{application}/status', [ApplicationController::class, 'updateStatus'])->name('update-status');
            Route::post('/batch/status', [ApplicationController::class, 'batchUpdateStatus'])->name('batch-status');

            // Delete operations
            Route::post('/batch/delete', [ApplicationController::class, 'batchDelete'])->name('batch-delete');

            // Resume downloads
            Route::get('/{application}/resume', [ApplicationController::class, 'downloadResume'])->name('download-resume');
            Route::post('/batch/download', [ApplicationController::class, 'batchDownloadResumes'])->name('batch-download');

            // ATS
            Route::post('/{application}/recalculate-score', [ApplicationController::class, 'recalculateScore'])->name('recalculate-score');
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
    return redirect()->route('profile.complete');
})->middleware(['auth', 'signed'])->name('verification.verify');

// Resend verification email
Route::post('/email/verification-notification', function (Request $request) {
    $request->user()->sendEmailVerificationNotification();

    return response()->json([
        'message' => 'Verification link sent'
    ]);
})->middleware(['auth', 'throttle:6,1'])->name('verification.send');

// Email routes - API endpoints for sending emails
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/applications/{application}/email-modal', [ApplicationController::class, 'showEmailModal'])
        ->name('backend.applications.email-modal');

    Route::post('/applications/{application}/send-email', [ApplicationController::class, 'sendEmail'])
        ->name('backend.applications.send-email');

    Route::post('/applications/bulk-email-modal', [ApplicationController::class, 'showBulkEmailModal'])
        ->name('backend.applications.bulk-email-modal');

    Route::post('/applications/bulk-send-emails', [ApplicationController::class, 'sendBulkEmails'])
        ->name('backend.applications.bulk-send-emails');
});



/*
|--------------------------------------------------------------------------
| AUTH ROUTES
|--------------------------------------------------------------------------
*/

require __DIR__ . '/auth.php';
