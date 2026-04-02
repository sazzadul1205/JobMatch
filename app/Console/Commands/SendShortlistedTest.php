<?php

namespace App\Console\Commands;

use App\Mail\ShortlistedMail;
use App\Models\Application;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class SendShortlistedTest extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:shortlisted-email {application_id?} {email?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send a test shortlisted email using the actual mail class';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $applicationId = $this->argument('application_id') ?? 3;
        $email = $this->argument('email') ?? 'psazadul1205@gmail.com';

        $application = Application::with('jobListing.user')->find($applicationId);

        if (!$application) {
            $this->error("Application with ID {$applicationId} not found");
            return;
        }

        $this->info("Sending shortlisted email for application ID: {$applicationId}");
        $this->info("To email: {$email}");
        $this->info("Subject: Interview Invitation - {$application->jobListing->title}");

        try {
            Mail::to($email)->send(
                new ShortlistedMail(
                    $application,
                    "Interview Invitation - {$application->jobListing->title}",
                    "We are pleased to inform you that you have been shortlisted for the position of {$application->jobListing->title}.\n\nNext steps:\n1. Please expect a call from our HR team within 3-5 business days\n2. Prepare for the interview by reviewing the job requirements\n3. Have your portfolio/experience ready for discussion\n\nWe look forward to speaking with you soon."
                )
            );

            $this->info('✅ Shortlisted email sent successfully!');
        } catch (\Exception $e) {
            $this->error('❌ Failed to send shortlisted email: ' . $e->getMessage());
        }
    }
}
