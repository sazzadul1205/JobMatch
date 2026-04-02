<?php

namespace App\Console\Commands;

use App\Models\Application;
use App\Jobs\CalculateAtsScore;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class MonitorATSCalculations extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'ats:monitor {--timeout=30 : Timeout in minutes for stuck calculations (default: 30)} {--auto-retry : Automatically retry stuck calculations} {--inline : Use inline calculation for stuck items}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Monitor ATS calculations and detect/handle stuck calculations';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $timeout = $this->option('timeout') ?? 30;
        $autoRetry = $this->option('auto-retry') ?? false;
        $inline = $this->option('inline') ?? false;

        $this->info("🔍 Monitoring ATS calculations (timeout: {$timeout} minutes)...");

        // Find stuck calculations
        $stuckCalculations = Application::where('ats_calculation_status', '!=', 'completed')
            ->where('ats_calculation_status', '!=', 'failed')
            ->where(function ($query) use ($timeout) {
                $cutoffTime = now()->subMinutes($timeout);
                
                $query->whereNull('ats_last_attempted_at')
                    ->where('created_at', '<', $cutoffTime)
                    ->orWhere(function ($q) use ($cutoffTime) {
                        $q->whereNotNull('ats_last_attempted_at')
                          ->where('ats_last_attempted_at', '<', $cutoffTime);
                    });
            })
            ->get();

        if ($stuckCalculations->isEmpty()) {
            $this->line('✓ No stuck calculations found');
            return 0;
        }

        $this->warn("⚠ Found {$stuckCalculations->count()} stuck calculations");

        if (!$autoRetry) {
            $this->line("\nStuck calculations:");
            foreach ($stuckCalculations as $app) {
                $status = $app->ats_calculation_status;
                $attempts = $app->ats_attempt_count;
                $lastAttempted = $app->ats_last_attempted_at?->diffForHumans() ?? 'Never';
                
                $this->line("  - Application #{$app->id} | Status: {$status} | Attempts: {$attempts} | Last: {$lastAttempted}");
            }
            
            $this->warn("\n⚠ Use --auto-retry flag to automatically retry stuck calculations");
            return 0;
        }

        // Auto-retry stuck calculations
        $this->info("\n🔄 Attempting to recover stuck calculations...");
        $bar = $this->output->createProgressBar($stuckCalculations->count());

        $retryCount = 0;
        $failedCount = 0;

        foreach ($stuckCalculations as $application) {
            try {
                if ($inline) {
                    if ($application->recalculateAtsScoreInline()) {
                        $retryCount++;
                        Log::info('Successfully recovered stuck ATS calculation (inline)', [
                            'application_id' => $application->id
                        ]);
                    } else {
                        $failedCount++;
                        Log::warning('Failed to recover stuck ATS calculation (inline)', [
                            'application_id' => $application->id
                        ]);
                    }
                } else {
                    $application->update(['ats_calculation_status' => 'pending']);
                    \App\Jobs\CalculateAtsScore::dispatch($application->id);
                    $retryCount++;
                    
                    Log::info('Requeued stuck ATS calculation', [
                        'application_id' => $application->id
                    ]);
                }
            } catch (\Throwable $e) {
                $failedCount++;
                Log::error('Error recovering stuck ATS calculation', [
                    'application_id' => $application->id,
                    'error' => $e->getMessage()
                ]);
            }

            $bar->advance();
        }

        $bar->finish();
        $this->newLine(2);

        $this->info("✓ Recovery complete!");
        $this->line("  - Successfully recovered: {$retryCount}");
        $this->line("  - Failed to recover: {$failedCount}");

        if ($failedCount > 0) {
            $this->warn("\n⚠ Some calculations could not be recovered. Check logs for details.");
            return 1;
        }

        return 0;
    }
}
