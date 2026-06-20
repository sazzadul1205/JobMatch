<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Notifications\Messages\MailMessage;

class CustomVerifyEmailNotification extends VerifyEmail
{
    /**
     * Build the mail representation of the notification.
     */
    public function toMail($notifiable): MailMessage
    {
        $verificationUrl = $this->verificationUrl($notifiable);

        return (new MailMessage)
            ->subject('Verify your email address')
            ->view('emails.verification', [
                'subject' => 'Verify your email address',
                'userName' => $notifiable->name ?? 'there',
                'appName' => config('app.name'),
                'verificationUrl' => $verificationUrl,
            ]);
    }
}
