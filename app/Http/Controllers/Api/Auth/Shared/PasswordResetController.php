<?php

namespace App\Http\Controllers\Api\Auth\Shared;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\Rules;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class PasswordResetController extends Controller
{
  /**
   * Send password reset link.
   */
  public function sendResetLink(Request $request): JsonResponse
  {
    try {
      $request->validate([
        'email' => 'required|email|exists:users,email',
      ]);

      $status = Password::sendResetLink(
        $request->only('email')
      );

      if ($status === Password::RESET_LINK_SENT) {
        return response()->json([
          'success' => true,
          'message' => 'Password reset link sent to your email.',
        ]);
      }

      return response()->json([
        'success' => false,
        'message' => 'Unable to send reset link. Please try again.',
      ], 400);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Failed to send reset link: ' . $e->getMessage(),
      ], 500);
    }
  }

  /**
   * Reset password.
   */
  public function reset(Request $request): JsonResponse
  {
    try {
      $request->validate([
        'token' => 'required',
        'email' => 'required|email|exists:users,email',
        'password' => ['required', 'confirmed', Rules\Password::defaults()],
      ]);

      $status = Password::reset(
        $request->only('email', 'password', 'password_confirmation', 'token'),
        function ($user) use ($request) {
          $user->forceFill([
            'password' => Hash::make($request->password),
            'remember_token' => Str::random(60),
          ])->save();
        }
      );

      if ($status === Password::PASSWORD_RESET) {
        return response()->json([
          'success' => true,
          'message' => 'Password reset successfully.',
        ]);
      }

      return response()->json([
        'success' => false,
        'message' => 'Password reset failed. Please try again.',
      ], 400);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Password reset failed: ' . $e->getMessage(),
      ], 500);
    }
  }
}
