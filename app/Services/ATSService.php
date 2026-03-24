<?php
// app/Services/ATSService.php

namespace App\Services;

use App\Models\Application;
use App\Models\JobListing;
use Smalot\PdfParser\Parser;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class ATSService
{
  /**
   * Calculate ATS score for an application
   */
  public function calculateScore(Application $application, JobListing $jobListing): array
  {
    try {
      // Extract text from resume
      $resumeText = $this->extractResumeText($application->resume_path);

      if (empty($resumeText)) {
        return $this->defaultScore('Unable to extract text from resume');
      }

      // Get job keywords from job listing
      $jobKeywords = $this->extractJobKeywords($jobListing);

      // Calculate matches
      $matches = $this->calculateKeywordMatches($resumeText, $jobKeywords);

      // Calculate ATS score
      $score = $this->calculateATSScore($matches, $jobKeywords);

      // Extract skills, experience, and education from resume
      $extractedSkills = $this->extractSkills($resumeText);
      $extractedExperience = $this->extractExperienceYears($resumeText);
      $extractedEducation = $this->extractEducation($resumeText);

      return [
        'total' => $score,
        'percentage' => round($score, 2),
        'matched_keywords' => $matches['matched'],
        'missing_keywords' => $matches['missing'],
        'matched_count' => count($matches['matched']),
        'total_keywords' => count($jobKeywords),
        'extracted_skills' => $extractedSkills,
        'extracted_experience_years' => $extractedExperience,
        'extracted_education' => $extractedEducation,
        'analysis_details' => $this->generateAnalysis($matches, $score)
      ];
    } catch (\Exception $e) {
      Log::error('ATS Score Calculation Error: ' . $e->getMessage(), [
        'application_id' => $application->id,
        'job_listing_id' => $jobListing->id
      ]);

      return $this->defaultScore('Error calculating score: ' . $e->getMessage());
    }
  }

  /**
   * Extract text from PDF resume
   */
  private function extractResumeText(string $resumePath): string
  {
    $fullPath = Storage::disk('public')->path($resumePath);

    if (!file_exists($fullPath)) {
      throw new \Exception('Resume file not found');
    }

    $extension = pathinfo($fullPath, PATHINFO_EXTENSION);

    if (strtolower($extension) === 'pdf') {
      return $this->extractFromPDF($fullPath);
    } elseif (in_array(strtolower($extension), ['doc', 'docx'])) {
      return $this->extractFromWord($fullPath);
    }

    throw new \Exception('Unsupported file format');
  }

  /**
   * Extract text from PDF
   */
  private function extractFromPDF(string $pdfPath): string
  {
    $parser = new Parser();
    $pdf = $parser->parseFile($pdfPath);
    return $pdf->getText();
  }

  /**
   * Extract text from Word document
   */
  private function extractFromWord(string $wordPath): string
  {
    $docxText = $this->extractFromDocx($wordPath);
    if (!empty($docxText)) {
      return $docxText;
    }
    return file_get_contents($wordPath);
  }

  /**
   * Extract text from a DOCX file
   */
  private function extractFromDocx(string $wordPath): string
  {
    if (!class_exists('ZipArchive')) {
      return '';
    }

    $zip = new \ZipArchive();
    if ($zip->open($wordPath) !== true) {
      return '';
    }

    $xml = $zip->getFromName('word/document.xml');
    $zip->close();

    if ($xml === false) {
      return '';
    }

    $text = strip_tags($xml);
    $text = html_entity_decode($text, ENT_QUOTES | ENT_XML1, 'UTF-8');

    return trim($text);
  }

  /**
   * Extract keywords from job listing
   */
  private function extractJobKeywords(JobListing $jobListing): array
  {
    $keywords = [];

    // Stored keywords (if provided by employer)
    if (!empty($jobListing->keywords) && is_array($jobListing->keywords)) {
      $keywords = array_merge($keywords, $jobListing->keywords);
    }

    // Structured fields
    $keywords[] = $jobListing->job_type;
    $keywords[] = $jobListing->category;
    $keywords[] = $jobListing->experience_level;

    // Extract keywords from title/description/requirements
    $keywords = array_merge($keywords, $this->extractWords($jobListing->title));
    $keywords = array_merge($keywords, $this->extractWords($jobListing->description));
    $keywords = array_merge($keywords, $this->extractWords($jobListing->requirements));

    // Remove duplicates and clean
    $keywords = array_unique($keywords);
    $keywords = $this->cleanKeywords($keywords);

    return array_values($keywords);
  }

  /**
   * Extract individual words from text
   */
  private function extractWords(string $text): array
  {
    // Convert to lowercase
    $text = strtolower($text);

    // Remove special characters
    $text = preg_replace('/[^\w\s]/', ' ', $text);

    // Split into words
    $words = preg_split('/\s+/', $text);

    // Remove empty values
    $words = array_filter($words, function ($word) {
      return !empty($word);
    });

    return $words;
  }

  /**
   * Calculate keyword matches
   */
  private function calculateKeywordMatches(string $resumeText, array $jobKeywords): array
  {
    $resumeText = strtolower($resumeText);
    $matched = [];
    $missing = [];

    foreach ($jobKeywords as $keyword) {
      $keyword = strtolower(trim($keyword));

      // Check if keyword exists in resume text
      if (strpos($resumeText, $keyword) !== false) {
        $matched[] = $keyword;
      } else {
        $missing[] = $keyword;
      }
    }

    return [
      'matched' => array_unique($matched),
      'missing' => array_unique($missing)
    ];
  }

  /**
   * Calculate ATS score
   */
  private function calculateATSScore(array $matches, array $jobKeywords): float
  {
    if (empty($jobKeywords)) {
      return 0;
    }

    $totalKeywords = count($jobKeywords);
    $matchedKeywords = count($matches['matched']);

    // Simple percentage score
    return ($matchedKeywords / $totalKeywords) * 100;
  }

  /**
   * Clean and normalize keywords
   */
  private function cleanKeywords(array $keywords): array
  {
    $cleaned = [];

    foreach ($keywords as $keyword) {
      $keyword = trim($keyword);
      $keyword = strtolower($keyword);

      // Remove very short keywords (less than 2 characters)
      if (strlen($keyword) < 2) {
        continue;
      }

      // Remove common stop words
      $stopWords = $this->getStopWords();
      if (in_array($keyword, $stopWords)) {
        continue;
      }

      $cleaned[] = $keyword;
    }

    return array_values(array_unique($cleaned));
  }

  /**
   * Extract skills from resume text
   */
  private function extractSkills(string $resumeText): array
  {
    // Common technical and professional skills
    $commonSkills = [
      'php',
      'laravel',
      'python',
      'javascript',
      'react',
      'vue',
      'angular',
      'java',
      'c++',
      'c#',
      'ruby',
      'rails',
      'node.js',
      'express',
      'mongodb',
      'mysql',
      'postgresql',
      'redis',
      'docker',
      'kubernetes',
      'aws',
      'azure',
      'git',
      'agile',
      'scrum',
      'leadership',
      'management',
      'communication',
      'problem solving',
      'teamwork',
      'project management',
      'html',
      'css',
      'sass',
      'typescript',
      'jquery',
      'bootstrap',
      'tailwind',
      'api',
      'rest',
      'graphql',
      'machine learning',
      'ai',
      'data analysis',
      'excel',
      'sql'
    ];

    $extractedSkills = [];
    $resumeLower = strtolower($resumeText);

    foreach ($commonSkills as $skill) {
      if (strpos($resumeLower, $skill) !== false) {
        $extractedSkills[] = $skill;
      }
    }

    return array_values(array_unique($extractedSkills));
  }

  /**
   * Extract years of experience from resume text
   */
  private function extractExperienceYears(string $resumeText): int
  {
    $patterns = [
      '/(\d+)\+?\s*years?\s+experience/',
      '/experience\s+of\s+(\d+)\+?\s*years?/',
      '/(\d+)\+?\s*years?\s+of\s+experience/',
    ];

    $years = 0;
    foreach ($patterns as $pattern) {
      if (preg_match($pattern, strtolower($resumeText), $matches)) {
        $years = max($years, (int)$matches[1]);
      }
    }

    return $years;
  }

  /**
   * Extract education from resume text
   */
  private function extractEducation(string $resumeText): string
  {
    $educationPatterns = [
      '/bachelor\s+of\s+(\w+)/i',
      '/master\s+of\s+(\w+)/i',
      '/ph\.?d\.?\s+in\s+(\w+)/i',
      '/b\.?s\.?\s+in\s+(\w+)/i',
      '/m\.?s\.?\s+in\s+(\w+)/i',
      '/b\.?a\.?\s+in\s+(\w+)/i',
      '/m\.?a\.?\s+in\s+(\w+)/i',
    ];

    $education = '';
    foreach ($educationPatterns as $pattern) {
      if (preg_match($pattern, $resumeText, $matches)) {
        $education = $matches[0];
        break;
      }
    }

    // Check for degree abbreviations
    if (empty($education)) {
      $degrees = ['bachelor', 'master', 'phd', 'bs', 'ms', 'ba', 'ma', 'mba'];
      foreach ($degrees as $degree) {
        if (stripos($resumeText, $degree) !== false) {
          $education = strtoupper($degree);
          break;
        }
      }
    }

    return $education ?: 'Not specified';
  }

  /**
   * Generate detailed analysis
   */
  private function generateAnalysis(array $matches, float $score): array
  {
    $analysis = [];

    if ($score >= 80) {
      $analysis['level'] = 'Excellent';
      $analysis['message'] = 'Your resume strongly matches the job requirements!';
    } elseif ($score >= 60) {
      $analysis['level'] = 'Good';
      $analysis['message'] = 'Your resume matches many key requirements. Consider highlighting missing keywords.';
    } elseif ($score >= 40) {
      $analysis['level'] = 'Fair';
      $analysis['message'] = 'Your resume has some relevant keywords. Consider adding more specific skills.';
    } else {
      $analysis['level'] = 'Needs Improvement';
      $analysis['message'] = 'Your resume could be optimized for this position. Add more relevant keywords.';
    }

    $analysis['matched_count'] = count($matches['matched']);
    $analysis['missing_count'] = count($matches['missing']);
    $analysis['top_matched'] = array_slice($matches['matched'], 0, 5);
    $analysis['critical_missing'] = array_slice($matches['missing'], 0, 5);

    return $analysis;
  }

  /**
   * Get default score for errors
   */
  private function defaultScore(string $error): array
  {
    return [
      'total' => 0,
      'percentage' => 0,
      'matched_keywords' => [],
      'missing_keywords' => [],
      'matched_count' => 0,
      'total_keywords' => 0,
      'extracted_skills' => [],
      'extracted_experience_years' => 0,
      'extracted_education' => 'Not specified',
      'analysis_details' => [
        'level' => 'Error',
        'message' => $error,
        'matched_count' => 0,
        'missing_count' => 0,
        'top_matched' => [],
        'critical_missing' => []
      ]
    ];
  }

  /**
   * Get stop words to ignore
   */
  private function getStopWords(): array
  {
    return [
      'a',
      'an',
      'and',
      'are',
      'as',
      'at',
      'be',
      'but',
      'by',
      'for',
      'from',
      'has',
      'have',
      'in',
      'is',
      'it',
      'its',
      'of',
      'on',
      'or',
      'the',
      'to',
      'was',
      'we',
      'will',
      'with'
    ];
  }
}
