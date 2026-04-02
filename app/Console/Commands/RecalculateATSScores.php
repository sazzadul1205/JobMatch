<?php
// app/Console/Commands/RecalculateATSScores.php

namespace App\Console\Commands;

use App\Models\Application;
use App\Jobs\CalculateAtsScore;
use Illuminate\Console\Command;

class RecalculateATSScores extends Command
{
  protected $signature = 'ats:recalculate {--application= : Specific application ID to recalculate} {--stuck : Only recalculate stuck calculations} {--failed : Only recalculate failed calculations} {--inline : Use inline calculation instead of queue}';
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
      
      if ($this->option('inline')) {
        if ($application->recalculateAtsScoreInline()) {
          $this->info("✓ ATS score recalculated successfully (inline) for application #{$application->id}");
        } else {
          $this->error("✗ Failed to recalculate ATS score for application #{$application->id}");
          return 1;
        }
      } else {
        $application->update(['ats_calculation_status' => 'pending']);
        CalculateAtsScore::dispatch($application->id);
        $this->info("✓ Queued ATS recalculation for application #{$application->id}");
      }
      return 0;
    }

    $query = Application::with('jobListing');

    // Apply filters
    if ($this->option('stuck')) {
      $this->info("Finding stuck ATS calculations...");
      $query->where('ats_calculation_status', 'processing')
            ->orWhere('ats_calculation_status', 'pending');
      
      $applications = $query->get();
      $stuckApps = $applications->filter(function ($app) {
        return $app->isAtsCalculationStuck();
      });
      
      $this->info("Found {$stuckApps->count()} stuck calculations");
      
      foreach ($stuckApps as $application) {
        $this->line("Recalculating stuck calculation for application #{$application->id}...");
        
        if ($this->option('inline')) {
          if ($application->recalculateAtsScoreInline()) {
            $this->info("✓ Application #{$application->id}");
          } else {
            $this->error("✗ Application #{$application->id} - inline calculation failed");
          }
        } else {
          $application->update(['ats_calculation_status' => 'pending']);
          CalculateAtsScore::dispatch($application->id);
          $this->info("✓ Application #{$application->id} queued");
        }
      }
      
      return 0;
    }

    if ($this->option('failed')) {
      $this->info("Finding failed ATS calculations...");
      $applications = $query->where('ats_calculation_status', 'failed')->get();

      $this->info("Found {$applications->count()} failed calculations");

      $bar = $this->output->createProgressBar($applications->count());

      foreach ($applications as $application) {
        if ($this->option('inline')) {
          $application->recalculateAtsScoreInline();
        } else {
          $application->update(['ats_calculation_status' => 'pending']);
          CalculateAtsScore::dispatch($application->id);
        }
        $bar->advance();
      }

      $bar->finish();
      $this->newLine();
      $this->info('All failed scores queued for recalculation!');
      
      return 0;
    }

    // Default: recalculate all missing/zero scores
    $applications = $query
      ->whereNull('ats_score')
      ->orWhere('ats_score', 'like', '%"total":0%')
      ->orWhere('ats_calculation_status', 'failed')
      ->get();

    $this->info("Found {$applications->count()} applications to recalculate");

    $bar = $this->output->createProgressBar($applications->count());

    foreach ($applications as $application) {
      if ($this->option('inline')) {
        $application->recalculateAtsScoreInline();
      } else {
        $application->update(['ats_calculation_status' => 'pending']);
        CalculateAtsScore::dispatch($application->id);
      }
      $bar->advance();
    }

    $bar->finish();
    $this->newLine();
    $this->info('All scores queued for recalculation!');

    return 0;
  }
}
