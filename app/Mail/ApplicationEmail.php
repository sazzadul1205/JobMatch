<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ApplicationEmail extends Mailable
{
  use Queueable, SerializesModels;

  public $subject;
  public $content;
  public $applicantName;
  public $jobTitle;
  public $companyName;
  public $applicationId;

  /**
   * Create a new message instance.
   */
  public function __construct($subject, $content, $applicantName, $jobTitle = null, $companyName = null, $applicationId = null)
  {
    $this->subject = $subject;
    $this->content = $content;
    $this->applicantName = $applicantName;
    $this->jobTitle = $jobTitle;
    $this->companyName = $companyName ?? config('app.name');
    $this->applicationId = $applicationId;
  }

  /**
   * Get the message envelope.
   */
  public function envelope(): Envelope
  {
    return new Envelope(
      subject: $this->subject,
    );
  }

  /**
   * Get the message content definition.
   */
  public function content(): Content
  {
    return new Content(
      view: 'emails.application',
    );
  }

  /**
   * Get the attachments for the message.
   *
   * @return array<int, \Illuminate\Mail\Mailables\Attachment>
   */
  public function attachments(): array
  {
    return [];
  }
}
