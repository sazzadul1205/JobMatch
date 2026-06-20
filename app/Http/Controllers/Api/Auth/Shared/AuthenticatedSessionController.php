<?php

namespace App\Http\Controllers\Api\Auth\Shared;

// Controllers
use App\Http\Controllers\Controller;

// HTTP
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AuthenticatedSessionController extends Controller
{
  /**
   * Destroy an authenticated session/token.
   */
  public function destroy(Request $request): JsonResponse
  {
    $request->user()->currentAccessToken()->delete();

    return response()->json([
      'success' => true,
      'message' => 'Logged out successfully.',
    ]);
  }
}
