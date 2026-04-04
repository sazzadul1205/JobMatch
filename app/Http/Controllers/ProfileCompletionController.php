<?php

namespace App\Http\Controllers;

use App\Models\ApplicantProfile;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ProfileCompletionController extends Controller
{
    /**
     * Show the profile completion page.
     */
    public function show(): Response|RedirectResponse
    {
        $user = Auth::user();

        $profile = ApplicantProfile::with(['cvs', 'jobHistories', 'educationHistories', 'achievements'])
            ->where('user_id', $user->id)
            ->first();

        if ($profile && $profile->isComplete()) {
            return redirect()->route('dashboard');
        }

        return Inertia::render('auth/completeProfile', [
            'applicantProfile' => $profile,
        ]);
    }

    /**
     * Store or update the applicant profile from the completion flow.
     */
    public function store(Request $request): RedirectResponse
    {
        $user = Auth::user();

        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'birth_date' => 'nullable|date',
            'gender' => 'nullable|string|max:50',
            'blood_type' => 'nullable|string|max:3',
            'phone' => 'required|string|max:20',
            'address' => 'nullable|string',
            'social_links' => 'nullable|array',
            'experience_years' => 'nullable|integer|min:0|max:60',
            'current_job_title' => 'nullable|string|max:255',
        ]);

        ApplicantProfile::updateOrCreate(
            ['user_id' => $user->id],
            $validated
        );

        return redirect()->route('dashboard');
    }
}
