<?php
// app/Services/ATSService.php

namespace App\Services;

use App\Models\Application;
use App\Models\JobListing;
use Smalot\PdfParser\Parser;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use ZipArchive;

class ATSService
{
  /**
   * Calculate ATS score for an application
   */
  public function calculateScore(Application $application, JobListing $jobListing): array
  {
    try {
      // Get the actual resume path (either custom or from profile)
      $resumePath = $application->getActualResumePath();

      if (!$resumePath) {
        Log::warning('No resume found for application', [
          'application_id' => $application->id
        ]);
        return $this->defaultScore('No resume found for this application');
      }

      // Extract text from resume
      $resumeText = $this->extractResumeText($resumePath);

      if (empty($resumeText)) {
        return $this->defaultScore('Unable to extract text from resume');
      }

      // Get job keywords from job listing
      $jobKeywords = $this->extractJobKeywords($jobListing);

      if (empty($jobKeywords)) {
        Log::warning('No keywords found for job listing', [
          'job_listing_id' => $jobListing->id
        ]);
        return $this->defaultScore('No keywords defined for this job');
      }

      // Calculate matches
      $matches = $this->calculateKeywordMatches($resumeText, $jobKeywords);

      // Calculate ATS score
      $score = $this->calculateATSScore($matches, $jobKeywords);

      // Extract additional information
      $extractedSkills = $this->extractSkills($resumeText);
      $extractedExperience = $this->extractExperienceYears($resumeText);
      $extractedEducation = $this->extractEducation($resumeText);

      return [
        'percentage' => round($score, 2),
        'matched_keywords' => $matches['matched'],
        'missing_keywords' => $matches['missing'],
        'matched_count' => count($matches['matched']),
        'total_keywords' => count($jobKeywords),
        'extracted_skills' => $extractedSkills,
        'extracted_experience_years' => $extractedExperience,
        'extracted_education' => $extractedEducation,
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
    // Handle both full paths and storage paths
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

  /**
   * Extract text from PDF
   */
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

      // Try alternative method using command line if available
      if (function_exists('shell_exec')) {
        $output = shell_exec("pdftotext '{$pdfPath}' - 2>/dev/null");
        if ($output && !empty(trim($output))) {
          return $output;
        }
      }

      throw new \Exception('Failed to extract text from PDF: ' . $e->getMessage());
    }
  }

  /**
   * Extract text from DOCX file
   */
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

      // Remove XML tags
      $text = strip_tags($xml);

      // Decode HTML entities
      $text = html_entity_decode($text, ENT_QUOTES | ENT_XML1, 'UTF-8');

      // Clean up whitespace
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

  /**
   * Extract text from DOC file (legacy)
   */
  private function extractFromDoc(string $docPath): string
  {
    // For older .doc files, try using antiword if available
    if (function_exists('shell_exec')) {
      $output = shell_exec("antiword '{$docPath}' 2>/dev/null");
      if ($output && !empty(trim($output))) {
        return $output;
      }
    }

    // Fallback: try to read as text
    $content = file_get_contents($docPath);
    if ($content === false) {
      throw new \Exception('Cannot read DOC file');
    }

    // Remove non-ASCII characters
    $content = preg_replace('/[^\x20-\x7E\x0A\x0D]/', ' ', $content);
    $content = preg_replace('/\s+/', ' ', $content);

    return trim($content);
  }

  /**
   * Extract keywords from job listing
   */
  private function extractJobKeywords(JobListing $jobListing): array
  {
    $keywords = [];

    // 1. Use stored keywords if available
    if (!empty($jobListing->keywords) && is_array($jobListing->keywords)) {
      $keywords = array_merge($keywords, $jobListing->keywords);
    }

    // 2. Extract from skills array
    if (!empty($jobListing->skills) && is_array($jobListing->skills)) {
      $keywords = array_merge($keywords, $jobListing->skills);
    }

    // 3. Add job type
    if ($jobListing->job_type) {
      $keywords[] = $jobListing->job_type;
    }

    // 4. Add experience level
    if ($jobListing->experience_level) {
      $keywords[] = $jobListing->experience_level;
    }

    // 5. Extract from title
    if ($jobListing->title) {
      $keywords = array_merge($keywords, $this->extractRelevantWords($jobListing->title));
    }

    // 6. Extract from description
    if ($jobListing->description) {
      $descriptionText = strip_tags($jobListing->description);
      $keywords = array_merge($keywords, $this->extractRelevantWords($descriptionText));
    }

    // 7. Extract from requirements
    if ($jobListing->requirements) {
      $requirementsText = strip_tags($jobListing->requirements);
      $keywords = array_merge($keywords, $this->extractRelevantWords($requirementsText));
    }

    // 8. Extract from responsibilities
    if (!empty($jobListing->responsibilities) && is_array($jobListing->responsibilities)) {
      foreach ($jobListing->responsibilities as $responsibility) {
        $keywords = array_merge($keywords, $this->extractRelevantWords($responsibility));
      }
    }

    // Clean and normalize keywords
    $keywords = $this->normalizeKeywords($keywords);

    // Remove duplicates and sort
    $keywords = array_unique($keywords);
    sort($keywords);

    // Limit to most relevant keywords (max 50)
    $keywords = array_slice($keywords, 0, 50);

    Log::info('Extracted job keywords', [
      'job_id' => $jobListing->id,
      'keyword_count' => count($keywords),
      'keywords' => $keywords
    ]);

    return array_values($keywords);
  }

  /**
   * Extract relevant words from text (not common stop words)
   */
  private function extractRelevantWords(string $text): array
  {
    // Convert to lowercase
    $text = strtolower($text);

    // Remove special characters and keep only alphanumeric and spaces
    $text = preg_replace('/[^\p{L}\p{N}\s]/u', ' ', $text);

    // Split into words
    $words = preg_split('/\s+/', $text, -1, PREG_SPLIT_NO_EMPTY);

    // Filter words
    $stopWords = $this->getStopWords();
    $filtered = array_filter($words, function ($word) use ($stopWords) {
      // Keep words with length >= 3
      if (strlen($word) < 3) {
        return false;
      }

      // Remove stop words
      if (in_array($word, $stopWords)) {
        return false;
      }

      // Remove numeric-only words
      if (is_numeric($word)) {
        return false;
      }

      return true;
    });

    return array_values($filtered);
  }

  /**
   * Normalize keywords (pluralization, common variations)
   */
  private function normalizeKeywords(array $keywords): array
  {
    $normalized = [];

    foreach ($keywords as $keyword) {
      $keyword = trim($keyword);
      $keyword = strtolower($keyword);

      // Remove common suffixes for normalization
      $keyword = preg_replace('/(ing|ed|s)$/', '', $keyword);

      // Handle common programming language variations
      $variations = [
        'javascript' => ['js', 'javascript', 'ecmascript'],
        'typescript' => ['ts', 'typescript'],
        'react' => ['reactjs', 'react.js', 'react js'],
        'vue' => ['vuejs', 'vue.js', 'vue js'],
        'angular' => ['angularjs', 'angular.js', 'angular js'],
        'node' => ['nodejs', 'node.js', 'node js'],
        'python' => ['python3', 'python 3'],
        'c++' => ['cpp', 'cplusplus'],
        'c#' => ['csharp', 'c sharp'],
      ];

      // Check if keyword is a variation
      $found = false;
      foreach ($variations as $standard => $variants) {
        if (in_array($keyword, $variants)) {
          $normalized[] = $standard;
          $found = true;
          break;
        }
      }

      if (!$found) {
        $normalized[] = $keyword;
      }
    }

    return $normalized;
  }

  /**
   * Calculate keyword matches with improved matching
   */
  private function calculateKeywordMatches(string $resumeText, array $jobKeywords): array
  {
    $resumeText = strtolower($resumeText);
    $matched = [];
    $missing = [];
    $partialMatches = [];

    foreach ($jobKeywords as $keyword) {
      $keyword = strtolower(trim($keyword));

      // Exact match
      if (strpos($resumeText, $keyword) !== false) {
        $matched[] = $keyword;
        continue;
      }

      // Partial match (keyword contains multiple words)
      $keywordWords = explode(' ', $keyword);
      if (count($keywordWords) > 1) {
        $allWordsFound = true;
        foreach ($keywordWords as $word) {
          if (strlen($word) > 2 && strpos($resumeText, $word) === false) {
            $allWordsFound = false;
            break;
          }
        }
        if ($allWordsFound) {
          $matched[] = $keyword;
          continue;
        }
      }

      // Check for similar words (Levenshtein distance for short words)
      if (strlen($keyword) >= 4 && strlen($keyword) <= 10) {
        $resumeWords = explode(' ', $resumeText);
        foreach ($resumeWords as $resumeWord) {
          if (levenshtein($keyword, $resumeWord) <= 2) {
            $partialMatches[] = $keyword;
            continue 2;
          }
        }
      }

      $missing[] = $keyword;
    }

    // Add partial matches to matched with lower weight
    $matched = array_merge($matched, $partialMatches);

    return [
      'matched' => array_unique($matched),
      'missing' => array_unique($missing)
    ];
  }

  /**
   * Calculate ATS score with weighted scoring
   */
  private function calculateATSScore(array $matches, array $jobKeywords): float
  {
    if (empty($jobKeywords)) {
      return 0;
    }

    $totalKeywords = count($jobKeywords);
    $matchedKeywords = count($matches['matched']);

    // Base percentage
    $baseScore = ($matchedKeywords / $totalKeywords) * 100;

    // Apply weights for important keywords (optional)
    $importantKeywords = ['experience', 'skills', 'education', 'degree', 'certification'];
    $importantMatches = 0;

    foreach ($matches['matched'] as $matched) {
      foreach ($importantKeywords as $important) {
        if (strpos($matched, $important) !== false) {
          $importantMatches++;
          break;
        }
      }
    }

    // Boost score by up to 10% for important keyword matches
    $boost = min(10, ($importantMatches / max(1, count($importantKeywords))) * 10);

    $finalScore = min(100, $baseScore + $boost);

    return $finalScore;
  }

  /**
   * Extract skills from resume text
   */
  private function extractSkills(string $resumeText): array
  {
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
      'data analysis',
      'excel',
      'sql',
      'nosql',
      'firebase',
      'heroku',
      'nginx',
      'apache',
      'linux',
      'windows',
      'macos',
      'ios',
      'android',
      'flutter',
      'react native',
      'swift',
      'kotlin',
      'go',
      'rust',
      'perl',
      'shell script'
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
      '/(\d+)\+?\s*years?\s+of\s+experience/i',
      '/(\d+)\+?\s*years?\s+experience/i',
      '/experience\s+of\s+(\d+)\+?\s*years?/i',
      '/(\d+)\+?\s*years?\s+in\s+/i',
      '/total\s+experience\s+(\d+)\+?\s*years?/i',
      '/(\d+)\+?\s*yrs?\s+experience/i',
    ];

    $years = 0;
    foreach ($patterns as $pattern) {
      if (preg_match($pattern, $resumeText, $matches)) {
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
      '/bachelor(\'s)?\s+of\s+(\w+)/i',
      '/master(\'s)?\s+of\s+(\w+)/i',
      '/ph\.?d\.?\s+in\s+(\w+)/i',
      '/b\.?s\.?\s+in\s+(\w+)/i',
      '/m\.?s\.?\s+in\s+(\w+)/i',
      '/b\.?a\.?\s+in\s+(\w+)/i',
      '/m\.?a\.?\s+in\s+(\w+)/i',
      '/mba\s+in\s+(\w+)/i',
    ];

    foreach ($educationPatterns as $pattern) {
      if (preg_match($pattern, $resumeText, $matches)) {
        return $matches[0];
      }
    }

    // Check for degree abbreviations
    $degrees = ['bachelor', 'master', 'phd', 'bs', 'ms', 'ba', 'ma', 'mba'];
    foreach ($degrees as $degree) {
      if (stripos($resumeText, $degree) !== false) {
        return strtoupper($degree);
      }
    }

    return 'Not specified';
  }

  /**
   * Generate detailed analysis
   */
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

  /**
   * Generate improvement suggestions
   */
  private function generateSuggestions(array $missingKeywords): array
  {
    $suggestions = [];

    $categories = [
      'technical' => ['react', 'vue', 'angular', 'node', 'python', 'java', 'php'],
      'soft_skills' => ['leadership', 'communication', 'teamwork', 'problem solving'],
      'tools' => ['git', 'docker', 'aws', 'jenkins', 'jira'],
      'methodologies' => ['agile', 'scrum', 'kanban', 'devops']
    ];

    foreach ($categories as $category => $skills) {
      $relevant = array_intersect($missingKeywords, $skills);
      if (!empty($relevant)) {
        $suggestions[] = "Consider adding {$category} skills: " . implode(', ', array_slice($relevant, 0, 3));
      }
    }

    if (count($missingKeywords) > 0) {
      $suggestions[] = "Highlight these keywords in your resume: " . implode(', ', array_slice($missingKeywords, 0, 5));
    }

    return array_slice($suggestions, 0, 3);
  }

  /**
   * Get default score for errors
   */
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
      'with',
      'i',
      'you',
      'he',
      'she',
      'it',
      'they',
      'them',
      'their',
      'our',
      'your',
      'this',
      'that',
      'these',
      'those',
      'am',
      'do',
      'does',
      'did',
      'doing',
      'can',
      'could',
      'would',
      'should',
      'may',
      'might',
      'must',
      'up',
      'down',
      'off',
      'over',
      'under',
      'again',
      'further',
      'then',
      'once',
      'here',
      'there',
      'all',
      'any',
      'both',
      'each',
      'few',
      'more',
      'most',
      'other',
      'some',
      'such',
      'no',
      'nor',
      'not',
      'only',
      'own',
      'same',
      'so',
      'than',
      'too',
      'very',
      'just',
      'but',
      'get',
      'make'
    ];
  }
}
