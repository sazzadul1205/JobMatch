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

      // Extract keywords from resume
      $resumeKeywords = $this->extractKeywordsFromText($resumeText);

      // Calculate matches
      $matches = $this->calculateKeywordMatches($resumeKeywords, $jobKeywords);

      // Calculate ATS score
      $score = $this->calculateATSScore($matches, $jobKeywords);

      // Extract skills and experience from resume
      $extractedData = $this->extractResumeData($resumeText);

      return [
        'total' => $score,
        'percentage' => round($score, 2),
        'matched_keywords' => $matches['matched'],
        'missing_keywords' => $matches['missing'],
        'matched_count' => count($matches['matched']),
        'total_keywords' => count($jobKeywords),
        'extracted_skills' => $extractedData['skills'],
        'extracted_experience_years' => $extractedData['experience_years'],
        'extracted_education' => $extractedData['education'],
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

    // Check file extension
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
    // For Word documents, you might need additional packages
    // This is a basic implementation
    // Try to parse DOCX content if possible
    $docxText = $this->extractFromDocx($wordPath);
    if (!empty($docxText)) {
      return $docxText;
    }

    // Fallback: try to read as text
    return file_get_contents($wordPath);
  }

  /**
   * Extract text from a DOCX file using ZipArchive.
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

    // Strip XML tags and decode entities
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

    // Get stored keywords if available
    if (!empty($jobListing->keywords) && is_array($jobListing->keywords)) {
      $keywords = array_merge($keywords, $jobListing->keywords);
    }

    // Extract keywords from job title
    $keywords = array_merge($keywords, $this->extractPhrases($jobListing->title));

    // Extract keywords from description
    $keywords = array_merge($keywords, $this->extractPhrases($jobListing->description));

    // Extract keywords from requirements
    $keywords = array_merge($keywords, $this->extractPhrases($jobListing->requirements));

    // Remove duplicates and clean
    $keywords = array_unique($keywords);
    $keywords = $this->cleanKeywords($keywords);

    // Prioritize important keywords
    return $this->prioritizeKeywords($keywords);
  }

  /**
   * Extract keywords from text
   */
  private function extractKeywordsFromText(string $text): array
  {
    // Convert to lowercase
    $text = strtolower($text);

    // Remove special characters
    $text = preg_replace('/[^\w\s]/', ' ', $text);

    // Split into words
    $words = preg_split('/\s+/', $text);

    // Remove common stop words
    $stopWords = $this->getStopWords();
    $words = array_filter($words, function ($word) use ($stopWords) {
      return strlen($word) > 2 && !in_array($word, $stopWords);
    });

    // Extract phrases (2-3 word combinations)
    $phrases = $this->extractPhrases($text);

    // Combine single words and phrases
    $keywords = array_merge($words, $phrases);

    // Remove duplicates and clean
    $keywords = array_unique($keywords);

    return array_values($keywords);
  }

  /**
   * Extract meaningful phrases from text
   */
  private function extractPhrases(string $text): array
  {
    $phrases = [];
    $text = strtolower($text);

    // Define technical skill patterns to look for
    $skillPatterns = [
      '/\b(?:php|python|java|javascript|react|vue|angular|node\.?js|laravel|symfony|django|flask|ruby on rails|mysql|postgresql|mongodb|aws|azure|docker|kubernetes)\b/i',
      '/\b(?:frontend|backend|fullstack|full-stack|devops|machine learning|artificial intelligence|data science|cloud computing)\b/i',
      '/\b(?:agile|scrum|kanban|jira|git|github|gitlab|ci/cd)\b/i',
      '/\b(?:leadership|project management|team management|communication|problem solving)\b/i'
    ];

    // Extract skills using patterns
    foreach ($skillPatterns as $pattern) {
      preg_match_all($pattern, $text, $matches);
      foreach ($matches[0] as $match) {
        $phrases[] = strtolower(trim($match));
      }
    }

    // Extract 2-word phrases
    preg_match_all('/\b[a-z]+(?:\s+[a-z]+){1}\b/', $text, $twoWordMatches);
    foreach ($twoWordMatches[0] as $phrase) {
      if (strlen($phrase) > 5 && !in_array($phrase, $this->getStopWords())) {
        $phrases[] = $phrase;
      }
    }

    // Extract 3-word phrases (for technologies like "machine learning")
    preg_match_all('/\b[a-z]+(?:\s+[a-z]+){2}\b/', $text, $threeWordMatches);
    foreach ($threeWordMatches[0] as $phrase) {
      $importantPhrases = ['machine learning', 'artificial intelligence', 'deep learning', 'data science'];
      if (in_array($phrase, $importantPhrases)) {
        $phrases[] = $phrase;
      }
    }

    return array_unique($phrases);
  }

  /**
   * Calculate keyword matches
   */
  private function calculateKeywordMatches(array $resumeKeywords, array $jobKeywords): array
  {
    $matched = [];
    $missing = [];

    foreach ($jobKeywords as $jobKeyword) {
      $found = false;

      foreach ($resumeKeywords as $resumeKeyword) {
        // Check for exact match or partial match
        if ($this->keywordMatch($jobKeyword, $resumeKeyword)) {
          $matched[] = $jobKeyword;
          $found = true;
          break;
        }
      }

      if (!$found) {
        $missing[] = $jobKeyword;
      }
    }

    return [
      'matched' => array_unique($matched),
      'missing' => array_unique($missing)
    ];
  }

  /**
   * Check if keywords match
   */
  private function keywordMatch(string $jobKeyword, string $resumeKeyword): bool
  {
    $jobKeyword = strtolower(trim($jobKeyword));
    $resumeKeyword = strtolower(trim($resumeKeyword));

    // Exact match
    if ($jobKeyword === $resumeKeyword) {
      return true;
    }

    // Contains match (for longer phrases)
    if (strpos($resumeKeyword, $jobKeyword) !== false) {
      return true;
    }

    // Partial match with word boundaries
    $jobWords = explode(' ', $jobKeyword);
    $resumeWords = explode(' ', $resumeKeyword);

    $matchCount = 0;
    foreach ($jobWords as $jobWord) {
      foreach ($resumeWords as $resumeWord) {
        if (strlen($jobWord) > 3 && strpos($resumeWord, $jobWord) !== false) {
          $matchCount++;
          break;
        }
      }
    }

    // If 70% of words match, consider it a match
    return $matchCount >= (count($jobWords) * 0.7);
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

    // Base score: percentage of keywords matched
    $baseScore = ($matchedKeywords / $totalKeywords) * 100;

    // Bonus for matching important keywords
    $bonus = $this->calculateKeywordImportanceBonus($matches['matched'], $jobKeywords);

    // Ensure score doesn't exceed 100
    return min(100, $baseScore + $bonus);
  }

  /**
   * Calculate bonus for matching important keywords
   */
  private function calculateKeywordImportanceBonus(array $matchedKeywords, array $allKeywords): float
  {
    // Define important keywords categories
    $importantKeywords = [
      'php',
      'python',
      'java',
      'javascript',
      'react',
      'vue',
      'angular',
      'laravel',
      'symfony',
      'django',
      'flask',
      'aws',
      'docker',
      'kubernetes',
      'leadership',
      'management',
      'senior',
      'architecture'
    ];

    $importantMatches = array_intersect($matchedKeywords, $importantKeywords);
    $bonus = (count($importantMatches) / max(1, count($importantKeywords))) * 15;

    return min(15, $bonus);
  }

  /**
   * Extract additional resume data
   */
  private function extractResumeData(string $text): array
  {
    $text = strtolower($text);

    // Extract skills (common tech skills)
    $skills = $this->extractSkills($text);

    // Extract experience years
    $experienceYears = $this->extractExperienceYears($text);

    // Extract education
    $education = $this->extractEducation($text);

    return [
      'skills' => $skills,
      'experience_years' => $experienceYears,
      'education' => $education
    ];
  }

  /**
   * Extract skills from text
   */
  private function extractSkills(string $text): array
  {
    $commonSkills = [
      'php',
      'python',
      'java',
      'javascript',
      'typescript',
      'react',
      'vue',
      'angular',
      'node.js',
      'express.js',
      'laravel',
      'symfony',
      'django',
      'flask',
      'ruby on rails',
      'mysql',
      'postgresql',
      'mongodb',
      'redis',
      'aws',
      'azure',
      'google cloud',
      'docker',
      'kubernetes',
      'jenkins',
      'git',
      'github',
      'gitlab',
      'ci/cd',
      'html',
      'css',
      'sass',
      'tailwind',
      'bootstrap',
      'jquery',
      'ajax',
      'rest api',
      'graphql',
      'soap',
      'microservices',
      'serverless',
      'agile',
      'scrum',
      'kanban',
      'jira',
      'confluence',
      'trello',
      'machine learning',
      'artificial intelligence',
      'data science',
      'big data',
      'leadership',
      'project management',
      'communication',
      'problem solving'
    ];

    $foundSkills = [];

    foreach ($commonSkills as $skill) {
      if (strpos($text, $skill) !== false) {
        $foundSkills[] = $skill;
      }
    }

    return array_slice($foundSkills, 0, 15); // Limit to top 15 skills
  }

  /**
   * Extract years of experience
   */
  private function extractExperienceYears(string $text): ?int
  {
    // Patterns for experience
    $patterns = [
      '/(\d+)\+?\s*years?\s+of\s+experience/i',
      '/experience\s+(\d+)\+?\s*years?/i',
      '/(\d+)\+?\s*years?\s+experience/i',
      '/(\d+)\+?\s*yrs?\s+exp/i'
    ];

    foreach ($patterns as $pattern) {
      if (preg_match($pattern, $text, $matches)) {
        return (int)$matches[1];
      }
    }

    // Try to calculate from work history dates
    if (preg_match_all('/(\d{4})\s*-\s*(\d{4}|present)/i', $text, $dateMatches)) {
      $totalYears = 0;
      foreach ($dateMatches[0] as $index => $match) {
        $start = (int)$dateMatches[1][$index];
        $end = $dateMatches[2][$index] === 'present' ? date('Y') : (int)$dateMatches[2][$index];
        if ($start && $end && $end > $start) {
          $totalYears += ($end - $start);
        }
      }
      return $totalYears > 0 ? $totalYears : null;
    }

    return null;
  }

  /**
   * Extract education information
   */
  private function extractEducation(string $text): array
  {
    $education = [];
    $degrees = [
      'bachelor',
      'master',
      'phd',
      'doctorate',
      'associate',
      'bsc',
      'msc',
      'mba',
      'btech',
      'mtech',
      'bca',
      'mca'
    ];

    foreach ($degrees as $degree) {
      if (strpos($text, $degree) !== false) {
        $education[] = $degree;
      }
    }

    return array_unique($education);
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

      // Remove very short keywords
      if (strlen($keyword) < 3 && !in_array($keyword, ['php', 'aws', 'api', 'ui', 'ux'])) {
        continue;
      }

      // Remove common words
      $commonWords = ['the', 'and', 'for', 'with', 'that', 'this', 'are', 'will', 'can', 'should'];
      if (in_array($keyword, $commonWords)) {
        continue;
      }

      $cleaned[] = $keyword;
    }

    return array_values(array_unique($cleaned));
  }

  /**
   * Prioritize keywords based on importance
   */
  private function prioritizeKeywords(array $keywords): array
  {
    $priorityKeywords = [];
    $normalKeywords = [];

    $highPriority = [
      'php',
      'python',
      'java',
      'javascript',
      'react',
      'laravel',
      'aws',
      'docker',
      'leadership',
      'management',
      'senior',
      'architecture',
      'devops'
    ];

    foreach ($keywords as $keyword) {
      if (in_array($keyword, $highPriority)) {
        $priorityKeywords[] = $keyword;
      } else {
        $normalKeywords[] = $keyword;
      }
    }

    // Return priority keywords first, then normal keywords
    return array_merge($priorityKeywords, $normalKeywords);
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
      'extracted_experience_years' => null,
      'extracted_education' => [],
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
      'the',
      'and',
      'for',
      'with',
      'that',
      'this',
      'are',
      'will',
      'can',
      'should',
      'would',
      'could',
      'have',
      'has',
      'had',
      'was',
      'were',
      'been',
      'being',
      'is',
      'am',
      'are',
      'be',
      'to',
      'of',
      'in',
      'on',
      'at',
      'by',
      'from',
      'as',
      'or',
      'but',
      'not',
      'such',
      'only',
      'just',
      'very',
      'more',
      'most',
      'some',
      'any'
    ];
  }
}
