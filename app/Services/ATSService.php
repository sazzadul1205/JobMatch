<?php
// app/Services/ATSService.php

namespace App\Services;

use App\Models\Application;
use App\Models\JobListing;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Smalot\PdfParser\Parser;
use ZipArchive;

class ATSService
{
  /**
   * Calculate ATS score for an application
   * Simple flow: extract resume text, compare against JobListing keywords JSON.
   */
  public function calculateScore(Application $application, JobListing $jobListing): array
  {
    try {
      $resumePath = $application->getActualResumePath();

      if (!$resumePath) {
        Log::warning('No resume found for application', [
          'application_id' => $application->id
        ]);
        return $this->defaultScore('No resume found for this application');
      }

      $resumeText = $this->extractResumeText($resumePath);

      if (empty($resumeText)) {
        return $this->defaultScore('Unable to extract text from resume');
      }

      $jobKeywords = $this->extractJobKeywords($jobListing);

      if (empty($jobKeywords)) {
        Log::warning('No keywords found for job listing', [
          'job_listing_id' => $jobListing->id
        ]);
        return $this->defaultScore('No keywords defined for this job');
      }

      $matches = $this->calculateKeywordMatches($resumeText, $jobKeywords);
      $score = $this->calculateATSScore($matches, $jobKeywords);

      return [
        'percentage' => round($score, 2),
        'matched_keywords' => $matches['matched'],
        'missing_keywords' => $matches['missing'],
        'matched_count' => count($matches['matched']),
        'total_keywords' => count($jobKeywords),
        'extracted_skills' => [],
        'extracted_experience_years' => 0,
        'extracted_education' => 'Not specified',
        'analysis' => $this->generateAnalysis($matches, $score),
        'calculated_at' => now()->toDateTimeString()
      ];
    } catch (\Exception $e) {
      Log::error('ATS Score Calculation Error: ' . $e->getMessage(), [
        'application_id' => $application->id,
        'job_listing_id' => $jobListing->id,
        'trace' => $e->getTraceAsString()
      ]);

      return $this->defaultScore('Error calculating score: ' . $e->getMessage());
    }
  }

  /**
   * Extract text from resume file
   */
  private function extractResumeText(string $resumePath): string
  {
    if (Storage::disk('public')->exists($resumePath)) {
      $fullPath = Storage::disk('public')->path($resumePath);
    } elseif (file_exists($resumePath)) {
      $fullPath = $resumePath;
    } else {
      throw new \Exception('Resume file not found at: ' . $resumePath);
    }

    if (!file_exists($fullPath)) {
      throw new \Exception('Resume file does not exist: ' . $fullPath);
    }

    $extension = strtolower(pathinfo($fullPath, PATHINFO_EXTENSION));

    switch ($extension) {
      case 'pdf':
        return $this->extractFromPDF($fullPath);
      case 'docx':
        return $this->extractFromDocx($fullPath);
      case 'doc':
        return $this->extractFromDoc($fullPath);
      default:
        throw new \Exception('Unsupported file format: ' . $extension);
    }
  }

  private function extractFromPDF(string $pdfPath): string
  {
    try {
      $parser = new Parser();
      $pdf = $parser->parseFile($pdfPath);
      $text = $pdf->getText();

      if (empty($text)) {
        throw new \Exception('PDF text extraction returned empty');
      }

      return $text;
    } catch (\Exception $e) {
      Log::error('PDF extraction failed: ' . $e->getMessage());

      if (function_exists('shell_exec')) {
        $output = shell_exec("pdftotext '{$pdfPath}' - 2>/dev/null");
        if ($output && !empty(trim($output))) {
          return $output;
        }
      }

      throw new \Exception('Failed to extract text from PDF: ' . $e->getMessage());
    }
  }

  private function extractFromDocx(string $docxPath): string
  {
    try {
      $zip = new ZipArchive();
      if ($zip->open($docxPath) !== true) {
        throw new \Exception('Cannot open DOCX file');
      }

      $xml = $zip->getFromName('word/document.xml');
      $zip->close();

      if ($xml === false) {
        throw new \Exception('Cannot find document.xml in DOCX');
      }

      $text = strip_tags($xml);
      $text = html_entity_decode($text, ENT_QUOTES | ENT_XML1, 'UTF-8');
      $text = preg_replace('/\s+/', ' ', $text);
      $text = trim($text);

      if (empty($text)) {
        throw new \Exception('Extracted text from DOCX is empty');
      }

      return $text;
    } catch (\Exception $e) {
      Log::error('DOCX extraction failed: ' . $e->getMessage());
      throw new \Exception('Failed to extract text from DOCX: ' . $e->getMessage());
    }
  }

  private function extractFromDoc(string $docPath): string
  {
    if (function_exists('shell_exec')) {
      $output = shell_exec("antiword '{$docPath}' 2>/dev/null");
      if ($output && !empty(trim($output))) {
        return $output;
      }
    }

    $content = file_get_contents($docPath);
    if ($content === false) {
      throw new \Exception('Cannot read DOC file');
    }

    $content = preg_replace('/[^\x20-\x7E\x0A\x0D]/', ' ', $content);
    $content = preg_replace('/\s+/', ' ', $content);

    return trim($content);
  }

  /**
   * Extract keywords strictly from job listing keywords JSON
   */
  private function extractJobKeywords(JobListing $jobListing): array
  {
    $keywords = [];

    if (is_array($jobListing->keywords)) {
      $keywords = $jobListing->keywords;
    } elseif (is_string($jobListing->keywords) && trim($jobListing->keywords) !== '') {
      $decoded = json_decode($jobListing->keywords, true);
      if (is_array($decoded)) {
        $keywords = $decoded;
      }
    }

    $keywords = $this->normalizeKeywords($keywords);
    $keywords = array_filter($keywords, function ($keyword) {
      return $keyword !== '';
    });
    $keywords = array_unique($keywords);
    $keywords = array_slice(array_values($keywords), 0, 100);

    Log::info('Extracted job keywords', [
      'job_id' => $jobListing->id,
      'keyword_count' => count($keywords),
      'keywords' => $keywords
    ]);

    return array_values($keywords);
  }

  private function normalizeKeywords(array $keywords): array
  {
    $normalized = [];

    foreach ($keywords as $keyword) {
      $keyword = trim((string)$keyword);
      if ($keyword === '') {
        continue;
      }

      $keyword = strtolower($keyword);
      $keyword = preg_replace('/\s+/', ' ', $keyword);
      $normalized[] = $keyword;
    }

    return $normalized;
  }

  /**
   * Calculate keyword matches (simple exact match)
   */
  private function calculateKeywordMatches(string $resumeText, array $jobKeywords): array
  {
    $resumeText = strtolower($resumeText);
    $matched = [];
    $missing = [];

    foreach ($jobKeywords as $keyword) {
      $keyword = strtolower(trim($keyword));

      if ($keyword === '') {
        continue;
      }

      if (str_contains($keyword, ' ')) {
        if (strpos($resumeText, $keyword) !== false) {
          $matched[] = $keyword;
          continue;
        }
      } else {
        $pattern = '/\b' . preg_quote($keyword, '/') . '\b/u';
        if (preg_match($pattern, $resumeText)) {
          $matched[] = $keyword;
          continue;
        }
      }

      $missing[] = $keyword;
    }

    return [
      'matched' => array_unique($matched),
      'missing' => array_unique($missing)
    ];
  }

  /**
   * Calculate ATS score (simple ratio)
   */
  private function calculateATSScore(array $matches, array $jobKeywords): float
  {
    if (empty($jobKeywords)) {
      return 0;
    }

    $totalKeywords = count($jobKeywords);
    $matchedKeywords = count($matches['matched']);

    return ($matchedKeywords / $totalKeywords) * 100;
  }

  private function generateAnalysis(array $matches, float $score): array
  {
    if ($score >= 80) {
      $level = 'Excellent';
      $message = 'Your resume strongly matches the job requirements!';
      $color = 'green';
    } elseif ($score >= 60) {
      $level = 'Good';
      $message = 'Your resume matches many key requirements. Consider highlighting missing keywords.';
      $color = 'blue';
    } elseif ($score >= 40) {
      $level = 'Fair';
      $message = 'Your resume has some relevant keywords. Consider adding more specific skills.';
      $color = 'yellow';
    } else {
      $level = 'Needs Improvement';
      $message = 'Your resume could be optimized for this position. Add more relevant keywords from the job description.';
      $color = 'red';
    }

    return [
      'level' => $level,
      'message' => $message,
      'color' => $color,
      'matched_count' => count($matches['matched']),
      'missing_count' => count($matches['missing']),
      'top_matched' => array_slice($matches['matched'], 0, 10),
      'top_missing' => array_slice($matches['missing'], 0, 10),
      'suggestions' => $this->generateSuggestions($matches['missing'])
    ];
  }

  private function generateSuggestions(array $missingKeywords): array
  {
    $suggestions = [];

    if (count($missingKeywords) > 0) {
      $suggestions[] = "Highlight these keywords in your resume: " . implode(', ', array_slice($missingKeywords, 0, 5));
    }

    return array_slice($suggestions, 0, 3);
  }

  private function defaultScore(string $error): array
  {
    return [
      'percentage' => 0,
      'matched_keywords' => [],
      'missing_keywords' => [],
      'matched_count' => 0,
      'total_keywords' => 0,
      'extracted_skills' => [],
      'extracted_experience_years' => 0,
      'extracted_education' => 'Not specified',
      'analysis' => [
        'level' => 'Error',
        'message' => $error,
        'color' => 'red',
        'matched_count' => 0,
        'missing_count' => 0,
        'top_matched' => [],
        'top_missing' => [],
        'suggestions' => ['Please ensure your resume is uploaded and in a supported format (PDF, DOC, DOCX)']
      ],
      'calculated_at' => now()->toDateTimeString(),
      'error' => $error
    ];
  }
}
