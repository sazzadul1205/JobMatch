<?php
// tests/Feature/Auth/EmailVerificationTest.php

use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\URL;

test('email verification screen can be rendered', function () {
    $user = User::factory()->unverified()->create();

    $response = $this->actingAs($user)->get(route('verification.notice'));

    $response->assertOk();
});

test('email can be verified', function () {
    $user = User::factory()->unverified()->create();

    Event::fake();

    $verificationUrl = URL::temporarySignedRoute(
        'verification.verify',
        now()->addMinutes(60),
        [
            'id' => $user->id,
            'hash' => sha1($user->getEmailForVerification()),
        ]
    );

    $response = $this->actingAs($user)->get($verificationUrl);

    $user->refresh();

    Event::assertDispatched(Verified::class);
    expect($user->hasVerifiedEmail())->toBeTrue();

    $response->assertRedirect(route('profile.complete', absolute: false));
});

test('email is not verified with invalid hash', function () {
    $user = User::factory()->unverified()->create();

    $verificationUrl = URL::temporarySignedRoute(
        'verification.verify',
        now()->addMinutes(60),
        [
            'id' => $user->id,
            'hash' => sha1('invalid-email'),
        ]
    );

    $response = $this->actingAs($user)->get($verificationUrl);

    $user->refresh();

    expect($user->hasVerifiedEmail())->toBeFalse();

    // optional but better
    $response->assertStatus(403);
});
