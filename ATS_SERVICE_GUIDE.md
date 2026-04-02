# ATS Service Implementation Guide

## Overview
The ATS (Applicant Tracking System) Service has been fully implemented with comprehensive retry logic, stuck calculation detection, and error handling. It supports both queue-based and inline (instant) calculations.

## Features

### 1. **Dual Calculation Modes**
- **Queue-based**: Asynchronous calculation using Laravel queues (default)
- **Inline Mode**: Synchronous instant calculation (fallback or explicit)

### 2. **Automatic Retry Logic**
- **Max Attempts**: 3 attempts to calculate ATS score
- **Exponential Backoff**: 
  - 1st retry: 60 seconds
  - 2nd retry: 300 seconds (5 minutes)
  - 3rd retry: 1800 seconds (30 minutes)
- **Timeout**: 5 minutes per calculation attempt
- **Automatic Fallback**: If queue dispatch fails, falls back to inline calculation

### 3. **Stuck Calculation Detection**
- **Detection**: Identifies calculations pending for more than 30 minutes
- **Auto-recovery**: Can automatically retry stuck calculations
- **Status Tracking**: Tracks calculation attempts and timestamps

### 4. **Comprehensive Error Handling**
- **Failed Calculations**: After max attempts, stores detailed error information
- **User-Friendly Messages**: Shows "We are having trouble calculating the ATS score" message
- **Suggestions**: Provides actionable suggestions to users on failure

### 5. **Status Tracking Fields**
New database fields added to `applications` table:
- `ats_calculation_status`: pending | processing | completed | failed
- `ats_attempt_count`: Number of calculation attempts
- `ats_last_attempted_at`: Timestamp of last attempt

## Database Schema

```sql
ALTER TABLE applications ADD COLUMN ats_calculation_status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending';
ALTER TABLE applications ADD COLUMN ats_attempt_count UNSIGNED TINYINT DEFAULT 0;
ALTER TABLE applications ADD COLUMN ats_last_attempted_at TIMESTAMP NULL;
```

## Usage

### Application Creation (Automatic)
When a user submits a job application:

```php
// In ApplicationController::store()
$application = Application::create($applicationData);

// Automatically queues ATS calculation with fallback to inline
CalculateAtsScore::dispatch($application->id);
// If queue fails, automatically runs calculateATSScore() inline
```

### Manual Recalculation (Queue)
```php
// In controller or command
$application->recalculateAtsScoreQueued();
// Sets status to 'pending' and queues for calculation
```

### Manual Recalculation (Inline)
```php
// For immediate results
if ($application->recalculateAtsScoreInline()) {
    // Success - score is now calculated
} else {
    // Failed - check logs for details
}
```

### Check Calculation Status
```php
// Check if currently calculating
if ($application->isAtsCalculationPending()) {
    // Status is 'pending' or 'processing'
}

// Check if calculation is stuck
if ($application->isAtsCalculationStuck()) {
    // Pending for more than 30 minutes
}

// Check if can retry
if ($application->canRetryAtsCalculation()) {
    // Either failed or stuck
}

// Get status label for UI
echo $application->getAtsCalculationStatusLabel();
// Output: "Pending", "Calculating...", "Completed", "Failed"
```

## Console Commands

### Recalculate ATS Scores

**Basic usage - recalculate all missing/zero scores:**
```bash
php artisan ats:recalculate
```

**Recalculate specific application:**
```bash
php artisan ats:recalculate --application=123
```

**Recalculate only stuck calculations:**
```bash
php artisan ats:recalculate --stuck
```

**Recalculate only failed calculations:**
```bash
php artisan ats:recalculate --failed
```

**Use inline calculation instead of queue:**
```bash
php artisan ats:recalculate --inline
```

**Combine options:**
```bash
# Recalculate stuck calculations using inline mode
php artisan ats:recalculate --stuck --inline
```

### Monitor ATS Calculations

**Basic monitoring (detect stuck calculations):**
```bash
php artisan ats:monitor
```

**Auto-recover stuck calculations with queue:**
```bash
php artisan ats:monitor --auto-retry
```

**Auto-recover stuck calculations with inline:**
```bash
php artisan ats:monitor --auto-retry --inline
```

**Custom timeout (default 30 minutes):**
```bash
php artisan ats:monitor --timeout=60
```

**Full recovery example:**
```bash
php artisan ats:monitor --timeout=30 --auto-retry --inline
```

## Job Class: CalculateAtsScore

**Key Features:**
- Implements `ShouldQueue` interface
- Serializes models for queue compatibility
- Automatic retry with exponential backoff
- Timeout handling (5 minutes)
- Failed job callback with error details

**Configuration:**
```php
public $maxAttempts = 3;           // Maximum attempts
public $backoff = [60, 300, 1800]; // Retry delays in seconds
public $timeout = 300;              // Job timeout in seconds
```

## Application Model Methods

### Status Checking Methods
```php
// Check if calculation is pending/processing
$application->isAtsCalculationPending(): bool

// Check if calculation is stuck (30+ minutes)
$application->isAtsCalculationStuck(): bool

// Check if can retry (failed or stuck)
$application->canRetryAtsCalculation(): bool

// Get status label for UI
$application->getAtsCalculationStatusLabel(): string
```

### Calculation Methods
```php
// Queue-based recalculation
$application->recalculateAtsScoreQueued(): void

// Inline recalculation (returns success/failure)
$application->recalculateAtsScoreInline(): bool

// Inline calculation (legacy, for backward compatibility)
$application->calculateATSScore(): void
```

## Error Handling

### Failed Calculations
When a calculation fails after 3 attempts:

```php
// Application record is updated with:
[
    'ats_calculation_status' => 'failed',
    'ats_score' => [
        'percentage' => 0,
        'status' => 'failed',
        'max_attempts_reached' => true,
        'attempts' => 3,
        'error' => 'Detailed error message',
        'analysis' => [
            'level' => 'Error',
            'message' => 'We are having trouble calculating the ATS score. Please try recalculating later.',
            'color' => 'red',
            'suggestions' => [
                'Our system encountered an error...',
                'This may be due to file format issues...',
                'Please try uploading a different resume format...'
            ]
        ]
    ]
]
```

### User-Facing Error Messages
- **Calculation In Progress**: "Your ATS score is being calculated..."
- **Stuck Calculation**: "ATS score recalculation encountered an error. Please try again later."
- **Permanent Failure**: "We are having trouble calculating the ATS score. Please try recalculating later."

## Logging

All ATS operations are logged for monitoring and debugging:

```
storage/logs/laravel.log
```

**Log Levels:**
- `INFO`: Successful calculations, queue dispatches, recoveries
- `WARNING`: Queue failures, retries, stuck detections
- `ERROR`: Permanent failures, exceptions, max attempts reached

**Example Log Entry:**
```
[2026-04-02 04:00:00] local.WARNING: ATS calculation attempt 1 failed: Resume file not found
[2026-04-02 04:01:00] local.INFO: Retrying ATS calculation (current_attempt: 1, next_attempt: 2, retry_delay_seconds: 60)
[2026-04-02 04:02:00] local.INFO: ATS score calculated successfully (attempt: 2, percentage: 85.5)
```

## Architecture Diagram

```
Application Submission
       ↓
   [Auto Queue] ← Can succeed
       ↓
   [Attempt 1] → Success? → COMPLETED ✓
       ↓ Failure
   [Backoff 60s]
       ↓
   [Attempt 2] → Success? → COMPLETED ✓
       ↓ Failure
   [Backoff 300s]
       ↓
   [Attempt 3] → Success? → COMPLETED ✓
       ↓ Failure
   [Max Attempts Reached]
       ↓
   Queue Dispatch Failed?
       ↓ Yes
   [Fallback to Inline]
       ↓
   [Inline Calculation] → Success? → COMPLETED ✓
       ↓ Failure
   [FAILED] → Store Error Details → User Notified ✗
```

## Testing

### Test Queue Calculation
```php
// In your test
Bus::fake();

$application->recalculateAtsScoreQueued();

Bus::assertDispatched(CalculateAtsScore::class, function ($job) use ($application) {
    return $job->applicationId === $application->id;
});
```

### Test Inline Calculation
```php
$result = $application->recalculateAtsScoreInline();
$this->assertTrue($result);
$this->assertEquals('completed', $application->refresh()->ats_calculation_status);
```

### Test Stuck Detection
```php
$application->update([
    'ats_calculation_status' => 'processing',
    'ats_last_attempted_at' => now()->subMinutes(31)
]);

$this->assertTrue($application->isAtsCalculationStuck());
```

## Best Practices

1. **Always use the Model Methods**: Use `recalculateAtsScoreQueued()` or `recalculateAtsScoreInline()` instead of directly dispatching the job
2. **Monitor Stuck Calculations**: Run `ats:monitor --auto-retry` periodically (e.g., every 5 minutes via cron)
3. **Check Status Before Actions**: Verify calculation status before operations that depend on ATS score
4. **Handle Failures Gracefully**: Display user-friendly messages when calculations fail
5. **Log Important Events**: Always log when recovering or retrying calculations
6. **Test Thoroughly**: Test both queue and inline modes with various resume formats

## Troubleshooting

### Issue: Calculation stuck in "processing"
```bash
# Check for stuck calculations
php artisan ats:monitor --timeout=30

# Auto-recover stuck calculations
php artisan ats:monitor --timeout=30 --auto-retry --inline
```

### Issue: Queue not working
1. Check queue driver in `.env`: `QUEUE_CONNECTION=`
2. Ensure queue worker is running: `php artisan queue:work`
3. Check queue failed jobs: `php artisan queue:failed`
4. Retry failed jobs: `php artisan queue:retry all`

### Issue: High failure rate
1. Check resume files exist and are readable
2. Verify job listing has keywords defined
3. Check PHP memory limit - increase if needed
4. Review logs for specific error patterns

## Future Improvements

- [ ] Add webhook notifications for calculation completion
- [ ] Implement priority queue for VIP applications
- [ ] Add bulk calculation with progress tracking
- [ ] Implement caching for repeated calculations
- [ ] Add preview mode before formal scoring
- [ ] Support for custom scoring algorithms
- [ ] Webhook integration with external ATS systems

## Support & Questions

For issues or questions about the ATS Service:
1. Check the logs: `storage/logs/laravel.log`
2. Review application status: `php artisan tinker` → `Application::find(id)`
3. Monitor system: `php artisan ats:monitor`
4. Check command documentation: `php artisan ats:recalculate --help`
