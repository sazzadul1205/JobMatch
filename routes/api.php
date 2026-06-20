<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Auth\JobSeeker\JobSeekerRegisterController;
use App\Http\Controllers\Api\Auth\JobSeeker\JobSeekerLoginController;
use App\Http\Controllers\Api\Auth\JobSeeker\ProfileCompletionController;
use App\Http\Controllers\Api\Auth\Shared\EmailVerificationController;
use App\Http\Controllers\Api\Auth\Shared\PasswordResetController;
use App\Http\Controllers\Api\JobSeeker\JobListingController;
use App\Http\Controllers\Api\JobSeeker\ApplyController;
use App\Http\Controllers\Api\JobSeeker\ProfileController;

/*
|--------------------------------------------------------------------------
| API Routes - Job Seeker Module
|--------------------------------------------------------------------------
*/

// ============================================
// PUBLIC ROUTES (No Authentication Required)
// ============================================

Route::prefix('job-seeker')->group(function () {

  // Auth Routes
  Route::post('/register', [JobSeekerRegisterController::class, 'register']);
  Route::post('/login', [JobSeekerLoginController::class, 'login']);

  // Email Verification
  Route::post('/email/verify/resend', [EmailVerificationController::class, 'resend']);
  Route::get('/email/verify/{id}/{hash}', [EmailVerificationController::class, 'verify'])
    ->name('verification.verify');

  // Password Reset
  Route::post('/password/forgot', [PasswordResetController::class, 'sendResetLink']);
  Route::post('/password/reset', [PasswordResetController::class, 'reset']);

  // Google Auth
  Route::get('/auth/google', [JobSeekerLoginController::class, 'redirectToGoogle']);
  Route::get('/auth/google/callback', [JobSeekerLoginController::class, 'handleGoogleCallback']);

  // Public Job Listings
  Route::get('/jobs', [JobListingController::class, 'index']);
  Route::get('/jobs/{slug}', [JobListingController::class, 'show']);
  Route::get('/jobs/popular', [JobListingController::class, 'popular']);
  Route::get('/jobs/trending', [JobListingController::class, 'trending']);
});

// ============================================
// PROTECTED ROUTES (Requires Sanctum Token)
// ============================================

Route::prefix('job-seeker')->middleware('auth:sanctum')->group(function () {

  // ============================================
  // AUTH & SESSION
  // ============================================
  Route::post('/logout', [JobSeekerLoginController::class, 'logout']);
  Route::get('/user', [JobSeekerLoginController::class, 'user']);
  Route::post('/refresh-token', [JobSeekerLoginController::class, 'refresh']);

  // ============================================
  // PROFILE COMPLETION
  // ============================================
  Route::prefix('profile')->group(function () {
    Route::get('/completion', [ProfileCompletionController::class, 'show']);
    Route::post('/completion', [ProfileCompletionController::class, 'store']);

    // Photo
    Route::post('/photo', [ProfileCompletionController::class, 'uploadPhoto']);
    Route::delete('/photo', [ProfileCompletionController::class, 'deletePhoto']);

    // CV Management (during completion)
    Route::post('/cv', [ProfileCompletionController::class, 'uploadCv']);
    Route::delete('/cv/{cvId}', [ProfileCompletionController::class, 'destroyCv']);
    Route::put('/cv/{cvId}/primary', [ProfileCompletionController::class, 'setPrimaryCv']);
  });

  // ============================================
  // PROFILE MANAGEMENT (After Completion)
  // ============================================
  Route::prefix('profile')->group(function () {
    // Get profile
    Route::get('/', [ProfileController::class, 'show']);
    Route::get('/{id}', [ProfileController::class, 'show']); // For viewing others

    // Update sections
    Route::put('/basic', [ProfileController::class, 'updateBasicInfo']);
    Route::put('/professional', [ProfileController::class, 'updateProfessionalInfo']);
    Route::put('/work-experience', [ProfileController::class, 'updateWorkExperiences']);
    Route::put('/education', [ProfileController::class, 'updateEducations']);
    Route::put('/achievements', [ProfileController::class, 'updateAchievements']);

    // Password
    Route::post('/change-password', [ProfileController::class, 'changePassword']);

    // CV Management (after completion)
    Route::post('/cv/upload', [ProfileController::class, 'uploadCv']);
    Route::delete('/cv/{cv}', [ProfileController::class, 'destroyCv']);
    Route::put('/cv/{cv}/primary', [ProfileController::class, 'setPrimaryCv']);
    Route::get('/cv/{cv}/download', [ProfileController::class, 'downloadCv']);

    // Delete/Restore Profile
    Route::delete('/', [ProfileController::class, 'destroy']);
    Route::post('/{id}/restore', [ProfileController::class, 'restore']);
    Route::delete('/{id}/force', [ProfileController::class, 'forceDelete']);
  });

  // ============================================
  // APPLICATIONS
  // ============================================
  Route::prefix('applications')->group(function () {
    // List all applications
    Route::get('/', [ApplyController::class, 'index']);
    Route::get('/trashed', [ApplyController::class, 'trashed']);

    // Apply for job
    Route::get('/create/{slug}', [ApplyController::class, 'create']);
    Route::post('/', [ApplyController::class, 'store']);

    // Manage specific application
    Route::get('/{id}', [ApplyController::class, 'show']);
    Route::get('/{id}/edit', [ApplyController::class, 'edit']);
    Route::put('/{id}', [ApplyController::class, 'update']);
    Route::delete('/{id}', [ApplyController::class, 'destroy']);
    Route::post('/{id}/restore', [ApplyController::class, 'restore']);
    Route::delete('/{id}/force', [ApplyController::class, 'forceDelete']);

    // ATS
    Route::post('/{id}/recalculate-ats', [ApplyController::class, 'recalculateAts']);
    Route::get('/{id}/ats-status', [ApplyController::class, 'getAtsStatus']);
  });
});
