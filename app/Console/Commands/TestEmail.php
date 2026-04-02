<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class TestEmail extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:email {email?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send a test email to verify SMTP configuration';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email') ?? 'psazadul1205@gmail.com';

        $this->info("Sending test email to: {$email}");

        try {
            Mail::raw('This is a test email from JobMatch to verify SMTP configuration.', function ($message) use ($email) {
                $message->to($email)
                        ->subject('JobMatch Test Email');
            });

            $this->info('✅ Test email sent successfully!');
        } catch (\Exception $e) {
            $this->error('❌ Failed to send test email: ' . $e->getMessage());
        }
    }
}
