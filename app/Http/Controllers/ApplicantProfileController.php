<?php
// app/Http/Controllers/ApplicantProfileController.php

namespace App\Http\Controllers;

use App\Models\ApplicantProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ApplicantProfileController extends Controller
{
    /**
     * Display the applicant's profile (show page)
     */
    public function show($id = null)
    {
        // Check if user is a job seeker
        if (Auth::user()->role !== 'job_seeker') {
            return redirect()->route('dashboard')
                ->with('error', 'Only job seekers can access applicant profiles.');
        }

        // Get profile including soft deleted ones
        if ($id) {
            $profile = ApplicantProfile::withTrashed()
                ->with(['applications' => function ($query) {
                    $query->with(['jobListing' => function ($q) {
                        $q->with(['category', 'location']);
                    }])->latest();
                }])
                ->where('user_id', $id)
                ->first();
        } else {
            $profile = ApplicantProfile::withTrashed()
                ->where('user_id', Auth::id())
                ->first();

            // Load applications if profile exists
            if ($profile && !$profile->trashed()) {
                $profile->load(['applications' => function ($query) {
                    $query->with(['jobListing' => function ($q) {
                        $q->with(['category', 'location']);
                    }])->latest();
                }]);
            }
        }

        return Inertia::render('Backend/ApplicantProfile/Show', [
            'profile' => $profile
        ]);
    }

    /**
     * Show the form for creating a new profile
     */
    public function create()
    {
        // Check if user already has a profile (including soft deleted)
        $existingProfile = ApplicantProfile::withTrashed()
            ->where('user_id', Auth::id())
            ->first();

        if ($existingProfile) {
            if ($existingProfile->trashed()) {
                return redirect()->route('backend.applicant.profile.show')
                    ->with('info', 'You have a deleted profile. You can restore it instead of creating a new one.');
            } else {
                return redirect()->route('backend.applicant.profile.show')
                    ->with('error', 'You already have a profile.');
            }
        }

        return Inertia::render('Backend/ApplicantProfile/Create');
    }

    /**
     * Store a newly created profile
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'birth_date' => 'nullable|date',
            'phone' => 'nullable|string|max:20',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'cv' => 'nullable|file|mimes:pdf,doc,docx|max:5120',
        ]);

        $user = Auth::user();

        $profileData = [
            'user_id' => $user->id,
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'birth_date' => $validated['birth_date'] ?? null,
            'email' => $user->email,
            'phone' => $validated['phone'] ?? null,
        ];

        // Handle photo upload
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('applicant-photos', 'public');
            $profileData['photo_path'] = $photoPath;
        }

        // Handle CV upload
        if ($request->hasFile('cv')) {
            $cvPath = $request->file('cv')->store('applicant-cvs', 'public');
            $profileData['cv_path'] = $cvPath;
        }

        ApplicantProfile::create($profileData);

        return redirect()->route('backend.applicant.profile.show')
            ->with('success', 'Profile created successfully!');
    }

    /**
     * Show the form for editing the profile
     */
    public function edit(ApplicantProfile $applicantProfile)
    {
        // Only allow editing own profile
        if (Auth::id() !== $applicantProfile->user_id) {
            abort(403);
        }

        if ($applicantProfile->trashed()) {
            return redirect()->route('backend.applicant.profile.show')
                ->with('error', 'Cannot edit a deleted profile. Please restore it first.');
        }

        return Inertia::render('Backend/ApplicantProfile/Edit', [
            'profile' => $applicantProfile
        ]);
    }

    /**
     * Update the specified profile
     */
    public function update(Request $request, ApplicantProfile $applicantProfile)
    {
        // Only allow updating own profile
        if (Auth::id() !== $applicantProfile->user_id) {
            abort(403);
        }

        if ($applicantProfile->trashed()) {
            return redirect()->route('backend.applicant.profile.show')
                ->with('error', 'Cannot update a deleted profile. Please restore it first.');
        }

        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'birth_date' => 'nullable|date',
            'phone' => 'nullable|string|max:20',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'cv' => 'nullable|file|mimes:pdf,doc,docx|max:5120',
            'remove_photo' => 'nullable|boolean',
            'remove_cv' => 'nullable|boolean',
        ]);

        $profileData = [
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'birth_date' => $validated['birth_date'] ?? null,
            'phone' => $validated['phone'] ?? null,
        ];

        // Handle photo removal
        if ($request->boolean('remove_photo') && $applicantProfile->photo_path) {
            Storage::disk('public')->delete($applicantProfile->photo_path);
            $profileData['photo_path'] = null;
        }

        // Handle CV removal
        if ($request->boolean('remove_cv') && $applicantProfile->cv_path) {
            Storage::disk('public')->delete($applicantProfile->cv_path);
            $profileData['cv_path'] = null;
        }

        // Handle photo upload
        if ($request->hasFile('photo')) {
            if ($applicantProfile->photo_path) {
                Storage::disk('public')->delete($applicantProfile->photo_path);
            }
            $photoPath = $request->file('photo')->store('applicant-photos', 'public');
            $profileData['photo_path'] = $photoPath;
        }

        // Handle CV upload
        if ($request->hasFile('cv')) {
            if ($applicantProfile->cv_path) {
                Storage::disk('public')->delete($applicantProfile->cv_path);
            }
            $cvPath = $request->file('cv')->store('applicant-cvs', 'public');
            $profileData['cv_path'] = $cvPath;
        }

        $applicantProfile->update($profileData);

        return redirect()->route('backend.applicant.profile.show')
            ->with('success', 'Profile updated successfully!');
    }

    /**
     * Remove the specified profile (soft delete)
     */
    public function destroy(ApplicantProfile $applicantProfile)
    {
        // Only allow deleting own profile
        if (Auth::id() !== $applicantProfile->user_id) {
            abort(403);
        }

        if ($applicantProfile->trashed()) {
            return redirect()->route('backend.applicant.profile.show')
                ->with('error', 'Profile is already deleted.');
        }

        // Delete associated files
        if ($applicantProfile->photo_path) {
            Storage::disk('public')->delete($applicantProfile->photo_path);
        }
        if ($applicantProfile->cv_path) {
            Storage::disk('public')->delete($applicantProfile->cv_path);
        }

        $applicantProfile->delete();

        return redirect()->route('backend.applicant.profile.show')
            ->with('warning', 'Profile has been deleted. You can restore it if needed.');
    }

    /**
     * Restore a soft-deleted profile
     */
    public function restore($id)
    {
        $profile = ApplicantProfile::withTrashed()->where('user_id', $id)->first();

        if (!$profile) {
            return redirect()->route('backend.applicant.profile.create')
                ->with('error', 'No profile found to restore.');
        }

        if (!$profile->trashed()) {
            return redirect()->route('backend.applicant.profile.show')
                ->with('error', 'Profile is not deleted.');
        }

        $profile->restore();

        return redirect()->route('backend.applicant.profile.show')
            ->with('success', 'Profile restored successfully!');
    }

    /**
     * Download the CV
     */
    public function downloadCV(ApplicantProfile $applicantProfile)
    {
        // Only allow viewing own CV
        if (Auth::id() !== $applicantProfile->user_id) {
            abort(403);
        }

        if ($applicantProfile->trashed()) {
            return redirect()->back()->with('error', 'Cannot download CV from a deleted profile.');
        }

        if (!$applicantProfile->cv_path) {
            return redirect()->back()->with('error', 'No CV found.');
        }

        $filePath = storage_path('app/public/' . $applicantProfile->cv_path);

        if (!file_exists($filePath)) {
            return redirect()->back()->with('error', 'CV file not found.');
        }

        return response()->download($filePath, $applicantProfile->full_name . '_CV.pdf');
    }
}
