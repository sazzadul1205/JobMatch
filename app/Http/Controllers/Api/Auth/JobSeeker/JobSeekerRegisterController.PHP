<?php

namespace App\Http\Controllers\Api\Auth\JobSeeker;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;

class JobSeekerRegisterController extends Controller
{
  /**
   * Handle an incoming registration request via API.
   */
  public function register(Request $request): JsonResponse
  {
    try {
      $request->validate([
        'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
        'password' => ['required', 'confirmed', Rules\Password::defaults()],
      ]);

      $email = strtolower($request->email);
      $name = Str::of($email)->before('@')->replace(['.', '_', '-'], ' ')->title()->value() ?: 'New User';

      $user = User::create([
        'name' => $name,
        'email' => $email,
        'password' => Hash::make($request->password),
        'email_verified_at' => null,
      ]);

      // Assign job_seeker role
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

      // Send email verification notification
      $user->sendEmailVerificationNotification();

      event(new Registered($user));

      // Create API token
      $token = $user->createToken('job-seeker-api-token')->plainTextToken;

      return response()->json([
        'success' => true,
        'message' => 'Registration successful. Please verify your email.',
        'data' => [
          'user' => $user->load('roles'),
          'token' => $token,
          'token_type' => 'Bearer',
        ]
      ], 201);
    } catch (ValidationException $e) {
      return response()->json([
        'success' => false,
        'message' => 'Validation failed.',
        'errors' => $e->errors(),
      ], 422);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Registration failed: ' . $e->getMessage(),
      ], 500);
    }
  }
}
