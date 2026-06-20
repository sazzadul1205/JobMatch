<?php

namespace App\Http\Controllers\Api\Auth\Shared;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;

class EmailVerificationController extends Controller
{
  /**
   * Resend email verification notification.
   */
  public function resend(Request $request): JsonResponse
  {
    try {
      $user = $request->user();

      if (!$user) {
        return response()->json([
          'success' => false,
          'message' => 'User not authenticated.',
        ], 401);
      }

      if ($user->hasVerifiedEmail()) {
        return response()->json([
          'success' => false,
          'message' => 'Email already verified.',
        ], 400);
      }

      $user->sendEmailVerificationNotification();

      return response()->json([
        'success' => true,
        'message' => 'Verification link sent successfully.',
      ]);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Failed to send verification: ' . $e->getMessage(),
      ], 500);
    }
  }

  /**
   * Verify email using signed URL.
   */
  public function verify(Request $request, $id, $hash): JsonResponse
  {
    try {
      $user = \App\Models\User::findOrFail($id);

      if (!hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
        return response()->json([
          'success' => false,
          'message' => 'Invalid verification link.',
        ], 400);
      }

      if ($user->hasVerifiedEmail()) {
        return response()->json([
          'success' => true,
          'message' => 'Email already verified.',
        ]);
      }

      if ($user->markEmailAsVerified()) {
        event(new Verified($user));
      }

      return response()->json([
        'success' => true,
        'message' => 'Email verified successfully.',
        'data' => [
          'user' => $user,
          'email_verified' => true,
        ]
      ]);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Verification failed: ' . $e->getMessage(),
      ], 500);
    }
  }
}
