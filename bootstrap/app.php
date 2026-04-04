<?php

use App\Http\Controllers\JobListingController;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Console\Scheduling\Schedule;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->alias([
            'profile.complete' => \App\Http\Middleware\EnsureApplicantProfileComplete::class,
        ]);

        $middleware->web(append: [
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);
    })
    ->withSchedule(function (Schedule $schedule) {
        // Update job statuses every hour
        $schedule->call(function () {
            $controller = app(JobListingController::class);
            $controller->updateJobStatuses();
        })->hourly()->name('update-job-statuses');

        // You can also use a command if you create one (recommended)
        // $schedule->command('jobs:update-status')->hourly();
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
