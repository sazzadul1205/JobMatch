<?php

namespace App\Notifications;

use App\Models\Application;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class ApplicationStatusUpdated extends Notification
{
    use Queueable;

    public function __construct(
        private readonly Application $application,
        private readonly ?string $previousStatus = null,
        private readonly ?string $notes = null,
    ) {
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        $jobTitle = $this->application->jobListing?->title ?? 'job';
        $statusLabel = ucfirst($this->application->status);
        $previousStatusLabel = $this->previousStatus ? ucfirst($this->previousStatus) : null;

        $message = $previousStatusLabel && $previousStatusLabel !== $statusLabel
            ? "Your application for {$jobTitle} moved from {$previousStatusLabel} to {$statusLabel}."
            : "Your application for {$jobTitle} was updated to {$statusLabel}.";

        return [
            'application_id' => $this->application->id,
            'job_listing_id' => $this->application->job_listing_id,
            'job_title' => $jobTitle,
            'status' => $this->application->status,
            'previous_status' => $this->previousStatus,
            'notes' => $this->notes,
            'title' => "Application {$statusLabel}",
            'message' => $message,
            'route_name' => 'backend.apply.show',
            'route_params' => ['id' => $this->application->id],
            'created_at' => now()->toISOString(),
        ];
    }
}
