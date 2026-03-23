<?php
// app/Console/Commands/RecalculateATSScores.php

namespace App\Console\Commands;

use App\Models\Application;
use Illuminate\Console\Command;

class RecalculateATSScores extends Command
{
  protected $signature = 'ats:recalculate {--application= : Specific application ID to recalculate}';
  protected $description = 'Recalculate ATS scores for applications';

  public function handle()
  {
    if ($applicationId = $this->option('application')) {
      $application = Application::find($applicationId);
      if (!$application) {
        $this->error('Application not found!');
        return 1;
      }

      $this->info("Recalculating score for application #{$application->id}...");
      $application->calculateATSScore();
      $this->info("New score: {$application->ats_score['total']}%");
      return 0;
    }

    $applications = Application::with('jobListing')
      ->whereNull('ats_score')
      ->orWhere('ats_score', 'like', '%"total":0%')
      ->get();

    $this->info("Found {$applications->count()} applications to recalculate");

    $bar = $this->output->createProgressBar($applications->count());

    foreach ($applications as $application) {
      $application->calculateATSScore();
      $bar->advance();
    }

    $bar->finish();
    $this->newLine();
    $this->info('All scores recalculated successfully!');

    return 0;
  }
}
