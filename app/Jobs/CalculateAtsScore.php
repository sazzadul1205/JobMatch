<?php
// app/Jobs/CalculateAtsScore.php

namespace App\Jobs;

use App\Models\Application;
use App\Services\ATSService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Bus\Batchable;
use Throwable;

class CalculateAtsScore implements ShouldQueue
{
    use Batchable, Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $applicationId;
    
    /**
     * Maximum number of attempts to calculate ATS score
     */
    public $maxAttempts = 3;
    
    /**
     * Time to wait before retrying the job (in seconds)
     * Exponential backoff: 1 min, 5 min, 30 min
     */
    public $backoff = [60, 300, 1800];
    
    /**
     * Time before job times out (in seconds)
     */
    public $timeout = 300; // 5 minutes

    /**
     * Create a new job instance.
     */
    public function __construct($applicationId)
    {
        $this->applicationId = $applicationId;
    }

    /**
     * Execute the job.
     */
    public function handle(ATSService $atsService): void
    {
        $attempt = $this->attempts();
        
        try {
            $application = Application::with(['jobListing', 'applicantProfile'])
                ->find($this->applicationId);

            if (!$application) {
                Log::error('Application not found for ATS calculation', [
                    'application_id' => $this->applicationId,
                    'attempt' => $attempt
                ]);
                $this->fail(new \Exception('Application not found'));
                return;
            }

            if (!$application->jobListing) {
                Log::error('Job listing not found for ATS calculation', [
                    'application_id' => $this->applicationId,
                    'attempt' => $attempt
                ]);
                $this->fail(new \Exception('Job listing not found'));
                return;
            }

            // Calculate the score
            $result = $atsService->calculateScore($application, $application->jobListing);

            // Update the application with calculated score and mark as completed
            $application->update([
                'ats_score' => $result,
                'matched_keywords' => $result['matched_keywords'] ?? [],
                'missing_keywords' => $result['missing_keywords'] ?? [],
                'ats_calculation_status' => 'completed',
                'ats_last_attempted_at' => now(),
                'ats_attempt_count' => $attempt,
            ]);

            Log::info('ATS score calculated successfully', [
                'application_id' => $this->applicationId,
                'percentage' => $result['percentage'] ?? 0,
                'matched_count' => $result['matched_count'] ?? 0,
                'attempt' => $attempt
            ]);
        } catch (Throwable $e) {
            Log::warning('ATS calculation attempt ' . $attempt . ' failed: ' . $e->getMessage(), [
                'application_id' => $this->applicationId,
                'trace' => $e->getTraceAsString()
            ]);

            // Update attempt count
            $application = Application::find($this->applicationId);
            if ($application) {
                $application->update([
                    'ats_attempt_count' => $attempt,
                    'ats_last_attempted_at' => now(),
                ]);
            }

            // Retry if we haven't exceeded max attempts
            if ($attempt < $this->maxAttempts) {
                $nextAttempt = $attempt + 1;
                $delay = $this->backoff[$attempt - 1] ?? 60;
                
                Log::info('Retrying ATS calculation', [
                    'application_id' => $this->applicationId,
                    'current_attempt' => $attempt,
                    'next_attempt' => $nextAttempt,
                    'retry_delay_seconds' => $delay
                ]);
                
                // Release the job back to the queue with delay
                $this->release($delay);
            } else {
                // Max attempts reached, fail the job
                Log::error('ATS calculation failed after ' . $this->maxAttempts . ' attempts', [
                    'application_id' => $this->applicationId,
                    'error' => $e->getMessage()
                ]);
                
                $this->fail($e);
            }
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed($exception): void
    {
        $application = Application::find($this->applicationId);
        
        if ($application) {
            $errorMessage = 'We are having trouble calculating the ATS score. Please try recalculating later.';
            
            $application->update([
                'ats_calculation_status' => 'failed',
                'ats_score' => [
                    'percentage' => 0,
                    'error' => $exception->getMessage(),
                    'status' => 'failed',
                    'max_attempts_reached' => true,
                    'attempts' => $this->maxAttempts,
                    'analysis' => [
                        'level' => 'Error',
                        'message' => $errorMessage,
                        'color' => 'red',
                        'matched_count' => 0,
                        'missing_count' => 0,
                        'top_matched' => [],
                        'top_missing' => [],
                        'suggestions' => [
                            'Our system encountered an error while calculating your ATS score.',
                            'This may be due to file format issues or temporary system problems.',
                            'Please try uploading a different resume format (PDF, DOC, or DOCX) or wait a few minutes and recalculate.'
                        ]
                    ]
                ],
                'ats_last_attempted_at' => now(),
                'ats_attempt_count' => $this->maxAttempts,
            ]);

            Log::error('ATS calculation job permanently failed', [
                'application_id' => $this->applicationId,
                'exception' => $exception->getMessage(),
                'attempts' => $this->maxAttempts
            ]);
        }
    }
}
