<?php

namespace App\Jobs;

use App\Models\Application;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class CalculateAtsScore implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 120;
    public int $tries = 3;
    public array $backoff = [10, 30, 60];

    public function __construct(public int $applicationId)
    {
    }

    public function handle(): void
    {
        $application = Application::with('jobListing')->find($this->applicationId);

        if (!$application || !$application->jobListing) {
            Log::warning('ATS job skipped: application or job listing missing', [
                'application_id' => $this->applicationId,
            ]);
            return;
        }

        try {
            $application->calculateATSScore();
        } catch (\Throwable $e) {
            Log::error('ATS job failed: ' . $e->getMessage(), [
                'application_id' => $this->applicationId,
            ]);
            throw $e;
        }
    }
}
