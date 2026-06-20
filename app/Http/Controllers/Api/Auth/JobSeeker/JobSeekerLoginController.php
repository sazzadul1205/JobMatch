<?php

namespace App\Http\Controllers\Api\Auth\JobSeeker;

use App\Http\Controllers\Controller;
use App\Models\ApplicantProfile;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Laravel\Socialite\Facades\Socialite;
use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Contracts\User as SocialiteUser;

class JobSeekerLoginController extends Controller
{
  /**
   * Handle job seeker login via API.
   */
  public function login(Request $request): JsonResponse
  {
    try {
      $request->validate([
        'email' => 'required|email',
        'password' => 'required',
      ]);

      // Attempt to authenticate
      if (!Auth::attempt($request->only('email', 'password'))) {
        return response()->json([
          'success' => false,
          'message' => 'The provided credentials are incorrect.',
        ], 401);
      }

      /** @var \App\Models\User $user */
      $user = Auth::user();

      // Verify email
      if (!$user->hasVerifiedEmail()) {
        Auth::logout();
        return response()->json([
          'success' => false,
          'message' => 'Please verify your email address before logging in.',
          'requires_verification' => true,
        ], 403);
      }

      // Check if user has job_seeker role
      if (!$user->hasRole('job-seeker')) {
        Auth::logout();
        return response()->json([
          'success' => false,
          'message' => 'This account does not have job seeker access.',
        ], 403);
      }

      // Check profile completion
      $profile = ApplicantProfile::where('user_id', $user->id)->first();
      $profileComplete = $profile && $profile->isComplete();

      // Revoke existing tokens
      $user->tokens()->delete();

      // Create API token with expiration (7 days)
      $token = $user->createToken('job-seeker-api-token', ['*'], now()->addDays(7))->plainTextToken;

      // Load user with roles
      $user->load('roles');

      return response()->json([
        'success' => true,
        'message' => 'Login successful.',
        'data' => [
          'user' => $user,
          'token' => $token,
          'token_type' => 'Bearer',
          'expires_in' => now()->addDays(7)->toDateTimeString(),
          'profile_complete' => $profileComplete,
          'requires_profile_completion' => !$profileComplete,
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
        'message' => 'Login failed: ' . $e->getMessage(),
      ], 500);
    }
  }

  /**
   * Logout user and revoke token.
   */
  public function logout(Request $request): JsonResponse
  {
    try {
      /** @var \App\Models\User $user */
      $user = $request->user();

      if ($user) {
        // Delete current access token
        /** @var \Laravel\Sanctum\PersonalAccessToken|null $token */
        $token = $user->currentAccessToken();

        if ($token) {
          $token->delete();
        }
      }

      return response()->json([
        'success' => true,
        'message' => 'Logged out successfully.',
      ]);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Logout failed: ' . $e->getMessage(),
      ], 500);
    }
  }

  /**
   * Get authenticated user data.
   */
  public function user(Request $request): JsonResponse
  {
    try {
      /** @var \App\Models\User $user */
      $user = $request->user();
      $user->load('roles');

      $profile = ApplicantProfile::where('user_id', $user->id)->first();
      $profileComplete = $profile && $profile->isComplete();

      return response()->json([
        'success' => true,
        'data' => [
          'user' => $user,
          'profile_complete' => $profileComplete,
          'profile' => $profile ? $this->formatProfileData($profile) : null,
        ]
      ]);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Failed to get user data: ' . $e->getMessage(),
      ], 500);
    }
  }

  /**
   * Refresh token (extend expiration).
   */
  public function refresh(Request $request): JsonResponse
  {
    try {
      /** @var \App\Models\User $user */
      $user = $request->user();

      // Revoke current token
      /** @var \Laravel\Sanctum\PersonalAccessToken|null $token */
      $token = $user->currentAccessToken();

      if ($token) {
        $token->delete();
      }

      // Create new token with 7 days expiration
      $newToken = $user->createToken('job-seeker-api-token', ['*'], now()->addDays(7))->plainTextToken;

      return response()->json([
        'success' => true,
        'message' => 'Token refreshed successfully.',
        'data' => [
          'token' => $newToken,
          'token_type' => 'Bearer',
          'expires_in' => now()->addDays(7)->toDateTimeString(),
        ]
      ]);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Token refresh failed: ' . $e->getMessage(),
      ], 500);
    }
  }

  /**
   * Redirect to Google OAuth.
   */
  public function redirectToGoogle(): JsonResponse
  {
    try {
      $this->ensureGoogleIsConfigured();
      $url = Socialite::driver('google')->redirect()->getTargetUrl();

      return response()->json([
        'success' => true,
        'data' => ['redirect_url' => $url]
      ]);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Google auth not configured: ' . $e->getMessage(),
      ], 503);
    }
  }

  /**
   * Handle Google OAuth callback.
   */
  public function handleGoogleCallback(Request $request): JsonResponse
  {
    try {
      $this->ensureGoogleIsConfigured();

      /** @var \Laravel\Socialite\Two\User $googleUser */
      $googleUser = Socialite::driver('google')->user();

      $email = strtolower($googleUser->getEmail());

      if (empty($email)) {
        return response()->json([
          'success' => false,
          'message' => 'Google did not return an email address.',
        ], 400);
      }

      if (!$this->emailIsVerifiedByGoogle($googleUser)) {
        return response()->json([
          'success' => false,
          'message' => 'Please verify your Google account email before signing in.',
        ], 403);
      }

      $user = User::where('google_id', $googleUser->getId())
        ->orWhere('email', $email)
        ->first();

      if (!$user) {
        $user = $this->createUserFromGoogleProfile($googleUser);
      } else {
        $user->forceFill([
          'email' => $email,
          'google_id' => $googleUser->getId(),
          'google_avatar' => $googleUser->getAvatar(),
          'email_verified_at' => $user->email_verified_at ?? now(),
        ])->save();
      }

      // Revoke existing tokens
      $user->tokens()->delete();

      // Create API token
      $token = $user->createToken('job-seeker-api-token', ['*'], now()->addDays(7))->plainTextToken;

      // Check profile completion
      $profile = ApplicantProfile::where('user_id', $user->id)->first();
      $profileComplete = $profile && $profile->isComplete();

      return response()->json([
        'success' => true,
        'message' => 'Google login successful.',
        'data' => [
          'user' => $user->load('roles'),
          'token' => $token,
          'token_type' => 'Bearer',
          'expires_in' => now()->addDays(7)->toDateTimeString(),
          'profile_complete' => $profileComplete,
        ]
      ]);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Google authentication failed: ' . $e->getMessage(),
      ], 500);
    }
  }

  /**
   * Create user from Google profile.
   */
  private function createUserFromGoogleProfile(SocialiteUser $googleUser): User
  {
    $user = User::create([
      'name' => $googleUser->getName() ?: explode('@', $googleUser->getEmail())[0],
      'email' => strtolower($googleUser->getEmail()),
      'password' => Hash::make(Str::random(40)),
      'google_id' => $googleUser->getId(),
      'google_avatar' => $googleUser->getAvatar(),
      'email_verified_at' => now(),
    ]);

    $jobSeekerRole = Role::where('slug', 'job-seeker')->first();
    if ($jobSeekerRole) {
      $user->roles()->attach($jobSeekerRole->id, [
        'assigned_by' => $user->id,
        'assigned_at' => now(),
        'is_active' => true,
        'created_at' => now(),
        'updated_at' => now(),
      ]);
    }

    return $user;
  }

  /**
   * Ensure Google is configured.
   */
  private function ensureGoogleIsConfigured(): void
  {
    if (
      blank(config('services.google.client_id')) ||
      blank(config('services.google.client_secret')) ||
      blank(config('services.google.redirect'))
    ) {
      throw new \Exception('Google authentication is not configured.');
    }
  }

  /**
   * Check if email is verified by Google.
   */
  private function emailIsVerifiedByGoogle(SocialiteUser $googleUser): bool
  {
    $verified = data_get($googleUser->user, 'verified_email');
    return $verified === null ? true : (bool) $verified;
  }

  /**
   * Format profile data for response.
   */
  private function formatProfileData(ApplicantProfile $profile): array
  {
    return [
      'id' => $profile->id,
      'first_name' => $profile->first_name,
      'last_name' => $profile->last_name,
      'birth_date' => $profile->birth_date?->format('Y-m-d'),
      'gender' => $profile->gender,
      'blood_type' => $profile->blood_type,
      'phone' => $profile->phone,
      'address' => $profile->address,
      'social_links' => $profile->social_links ?? [],
      'experience_years' => $profile->experience_years,
      'current_job_title' => $profile->current_job_title,
      'photo_path' => $profile->photo_path,
      'photo_url' => $profile->photo_path ? asset('storage/' . $profile->photo_path) : null,
      'is_complete' => $profile->isComplete(),
      'completion_percentage' => $profile->completionPercentage(),
    ];
  }
}
