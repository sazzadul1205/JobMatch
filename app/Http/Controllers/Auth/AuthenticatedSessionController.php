<?php
// controllers/Auth/AuthenticatedSessionController.php

namespace App\Http\Controllers\Auth;

// Controllers
use App\Http\Controllers\Controller;

// Requests
use App\Http\Requests\Auth\LoginRequest;

// Models
use App\Models\ApplicantProfile;

// HTTP
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;

// Support
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

// Inertia
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Show the login page.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('auth/login', [
            'canResetPassword' => Route::has('password.request'),
            'googleAuthEnabled' => $this->googleAuthEnabled(),
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        $user = $request->user();

        // Check if email is verified
        if (!$user->hasVerifiedEmail()) {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return to_route('verification.notice')->withErrors([
                'email' => 'Please verify your email address before logging in.',
            ]);
        }

        // Check user role and redirect accordingly
        $redirectRoute = $this->determineRedirectRoute($user);

        return redirect()->intended(route($redirectRoute, absolute: false));
    }

    /**
     * Determine the redirect route based on user role.
     */
    private function determineRedirectRoute($user): string
    {
        // If user has job_seeker role
        if ($user->hasRole('job-seeker')) {
            // Check if profile exists and is complete
            $profile = ApplicantProfile::where('user_id', $user->id)->first();

            if (!$profile || !$profile->isComplete()) {
                return 'profile.complete';
            }

            return 'dashboard';
        }

        // For admin, super admin, employer, and other roles
        if (
            $user->hasRole('super-admin') ||
            $user->hasRole('admin') ||
            $user->hasRole('employer') ||
            $user->hasRole('hr-manager')
        ) {
            return 'admin.dashboard'; // Or your admin dashboard route
        }

        // Fallback for any other roles
        return 'dashboard';
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }

    /**
     * Determine whether Google auth is configured and ready to use.
     */
    private function googleAuthEnabled(): bool
    {
        return filled(config('services.google.client_id'))
            && filled(config('services.google.client_secret'))
            && filled(config('services.google.redirect'));
    }
}
