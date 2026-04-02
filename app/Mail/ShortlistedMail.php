<?php
// app/Mail/ShortlistedMail.php

namespace App\Mail;

use App\Models\Application;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ShortlistedMail extends Mailable
{
  use Queueable, SerializesModels;

  public $application;
  public $customMessage;
  public $subject;

  public function __construct(Application $application, $subject, $customMessage)
  {
    $this->application = $application;
    $this->subject = $subject;
    $this->customMessage = $customMessage;
  }

  public function envelope(): Envelope
  {
    return new Envelope(
      subject: $this->subject,
    );
  }

  public function content(): Content
  {
    return new Content(
      view: 'emails.shortlisted',
    );
  }

  public function headers(): \Illuminate\Mail\Mailables\Headers
  {
    return new \Illuminate\Mail\Mailables\Headers(
      text: [
        'X-Priority' => '1', // High priority
        'X-Mailer' => 'JobMatch Application System',
        'List-Unsubscribe' => '<mailto:unsubscribe@jobmatch.com>',
      ],
    );
  }

  public function attachments(): array
  {
    return [];
  }
}
