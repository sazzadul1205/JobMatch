<?php
// app/Services/ATSService.php

namespace App\Services;

use App\Models\Job;
use Illuminate\Support\Facades\Log;
use Smalot\PdfParser\Parser;

class ATSService
{
  protected $parser;

  public function __construct()
  {
    $this->parser = new Parser();
  }

  /**
   * Extract keywords from job listing
   */
  public function extractJobKeywords(Job $job)
  {
    $text = $job->title . ' ' . $job->description . ' ' . $job->requirements;

    // Convert to lowercase
    $text = strtolower($text);

    // Remove common stop words
    $stopWords = ['a', 'an', 'and', 'are', 'as', 'at', 'be', 'but', 'by', 'for', 'in', 'is', 'it', 'of', 'on', 'or', 'the', 'to', 'with'];

    // Extract words (simple approach)
    $words = preg_split('/[\s,\.;:]+/', $text);

    $keywords = [];
    foreach ($words as $word) {
      $word = trim($word);
      if (strlen($word) > 2 && !in_array($word, $stopWords)) {
        $keywords[] = $word;
      }
    }

    // Remove duplicates and get unique keywords
    $keywords = array_unique($keywords);

    // Limit to top 20 keywords
    $keywords = array_slice($keywords, 0, 20);

    return $keywords;
  }

  /**
   * Extract text from PDF
   */
  public function extractTextFromPDF($filePath)
  {
    try {
      $pdf = $this->parser->parseFile($filePath);
      $text = $pdf->getText();

      // Clean the text
      $text = strtolower($text);
      $text = preg_replace('/\s+/', ' ', $text);
      $text = trim($text);

      return $text;
    } catch (\Exception $e) {
      Log::error('PDF Parsing Error: ' . $e->getMessage());
      return null;
    }
  }

  /**
   * Analyze resume against job
   */
  public function analyzeResume($resumePath, $job)
  {
    // Extract text from resume
    $resumeText = $this->extractTextFromPDF($resumePath);

    if (!$resumeText) {
      return [
        'percentage' => 0,
        'message' => 'Could not parse resume',
        'matched_keywords' => [],
        'missing_keywords' => $job->keywords ?? [],
        'score_details' => [
          'keyword_match' => 0,
          'experience_score' => 0,
          'education_score' => 0
        ]
      ];
    }

    // Get job keywords
    $jobKeywords = $job->keywords ?? $this->extractJobKeywords($job);

    // Store keywords back to job if not already stored
    if (!$job->keywords) {
      $job->keywords = $jobKeywords;
      $job->save();
    }

    // Match keywords
    $matchedKeywords = [];
    $missingKeywords = [];

    foreach ($jobKeywords as $keyword) {
      if (strpos($resumeText, strtolower($keyword)) !== false) {
        $matchedKeywords[] = $keyword;
      } else {
        $missingKeywords[] = $keyword;
      }
    }

    // Calculate keyword match percentage
    $totalKeywords = count($jobKeywords);
    $matchedCount = count($matchedKeywords);
    $keywordPercentage = $totalKeywords > 0 ? ($matchedCount / $totalKeywords) * 100 : 0;

    // Experience level scoring (simple check)
    $experienceScore = $this->calculateExperienceScore($resumeText, $job->experience_level);

    // Education scoring (simple check)
    $educationScore = $this->calculateEducationScore($resumeText);

    // Calculate total score
    $totalScore = ($keywordPercentage * 0.7) + ($experienceScore * 0.2) + ($educationScore * 0.1);

    return [
      'percentage' => round($totalScore, 2),
      'matched_keywords' => $matchedKeywords,
      'missing_keywords' => $missingKeywords,
      'keyword_match_percentage' => round($keywordPercentage, 2),
      'matched_count' => $matchedCount,
      'total_keywords' => $totalKeywords,
      'score_details' => [
        'keyword_match' => round($keywordPercentage, 2),
        'experience_score' => $experienceScore,
        'education_score' => $educationScore
      ]
    ];
  }

  /**
   * Calculate experience score based on job level
   */
  protected function calculateExperienceScore($resumeText, $requiredLevel)
  {
    $experienceLevels = [
      'entry' => ['intern', 'junior', '0-2', '0-3', 'fresher', 'graduate'],
      'mid' => ['mid', 'intermediate', '3-5', '2-5', 'senior', 'lead'],
      'senior' => ['senior', 'lead', 'principal', '5+', '7+', '10+', 'manager', 'director']
    ];

    $score = 0;

    foreach ($experienceLevels[$requiredLevel] ?? $experienceLevels['entry'] as $keyword) {
      if (strpos($resumeText, $keyword) !== false) {
        $score += 20;
      }
    }

    // Check for years of experience using regex
    if (preg_match('/(\d+)\+?\s*years?/i', $resumeText, $matches)) {
      $years = (int)$matches[1];

      if ($requiredLevel == 'entry' && $years >= 1) $score += 30;
      if ($requiredLevel == 'mid' && $years >= 3) $score += 30;
      if ($requiredLevel == 'senior' && $years >= 5) $score += 30;
    }

    return min($score, 100);
  }

  /**
   * Calculate education score
   */
  protected function calculateEducationScore($resumeText)
  {
    $educationKeywords = [
      'bachelor' => 30,
      'master' => 50,
      'phd' => 70,
      'degree' => 25,
      'bsc' => 30,
      'msc' => 50,
      'diploma' => 20,
      'certification' => 15
    ];

    $score = 0;

    foreach ($educationKeywords as $keyword => $points) {
      if (strpos($resumeText, $keyword) !== false) {
        $score += $points;
      }
    }

    return min($score, 100);
  }
}
