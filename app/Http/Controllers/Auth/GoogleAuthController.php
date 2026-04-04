<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\User as SocialiteUser;
use Symfony\Component\HttpKernel\Exception\HttpException;

class GoogleAuthController extends Controller
{
    /**
     * Redirect the user to Google's OAuth consent screen.
     */
    public function redirect(): RedirectResponse
    {
        $this->ensureGoogleIsConfigured();

        return Socialite::driver('google')->redirect();
    }

    /**
     * Handle the OAuth callback from Google.
     */
    public function callback(Request $request): RedirectResponse
    {
        $this->ensureGoogleIsConfigured();

        try {
            /** @var SocialiteUser $googleUser */
            $googleUser = Socialite::driver('google')->user();
        } catch (\Throwable $exception) {
            report($exception);

            return to_route('login')->withErrors([
                'google' => 'Google sign-in could not be completed. Please try again.',
            ]);
        }

        $email = Str::lower((string) $googleUser->getEmail());

        if ($email === '') {
            return to_route('login')->withErrors([
                'google' => 'Google did not return an email address for this account.',
            ]);
        }

        if (! $this->emailIsVerifiedByGoogle($googleUser)) {
            return to_route('login')->withErrors([
                'google' => 'Please verify your Google account email before signing in.',
            ]);
        }

        $user = User::query()
            ->where('google_id', $googleUser->getId())
            ->orWhere('email', $email)
            ->first();

        $user ??= $this->createUserFromGoogleProfile($googleUser);

        $user->forceFill([
            'email' => $email,
            'google_id' => $googleUser->getId(),
            'google_avatar' => $googleUser->getAvatar(),
            'email_verified_at' => $user->email_verified_at ?? now(),
        ])->save();

        Auth::login($user, true);
        $request->session()->regenerate();

        return redirect()->intended(route('profile.complete', absolute: false));
    }

    /**
     * Create a local account from the Google profile.
     */
    private function createUserFromGoogleProfile(SocialiteUser $googleUser): User
    {
        return User::create([
            'name' => $googleUser->getName() ?: Str::before($googleUser->getEmail(), '@'),
            'email' => Str::lower((string) $googleUser->getEmail()),
            'password' => Hash::make(Str::random(40)),
            'google_id' => $googleUser->getId(),
            'google_avatar' => $googleUser->getAvatar(),
            'role' => User::ROLE_JOB_SEEKER,
            'email_verified_at' => now(),
        ]);
    }

    /**
     * Guard the Socialite flow behind complete Google credentials.
     */
    private function ensureGoogleIsConfigured(): void
    {
        if (
            blank(config('services.google.client_id'))
            || blank(config('services.google.client_secret'))
            || blank(config('services.google.redirect'))
        ) {
            throw new HttpException(503, 'Google authentication is not configured.');
        }
    }

    /**
     * Only trust Google sign-in for verified Google emails.
     */
    private function emailIsVerifiedByGoogle(SocialiteUser $googleUser): bool
    {
        $verified = data_get($googleUser->user, 'verified_email');

        return $verified === null ? true : (bool) $verified;
    }
}
