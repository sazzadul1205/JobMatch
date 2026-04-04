<?php

namespace App\Http\Middleware;

use App\Models\ApplicantProfile;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureApplicantProfileComplete
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user || $user->role !== 'job_seeker') {
            return $next($request);
        }

        if ($request->routeIs('profile.complete', 'profile.complete.store', 'logout', 'verification.*')) {
            return $next($request);
        }

        $profile = ApplicantProfile::where('user_id', $user->id)->first();

        if (! $profile || ! $profile->isComplete()) {
            return redirect()->route('profile.complete');
        }

        return $next($request);
    }
}
