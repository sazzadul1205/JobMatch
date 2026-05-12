<?php
// database/seeders/ApplicationSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ApplicationSeeder extends Seeder
{
    public function run(): void
    {
        $statuses = ['pending', 'shortlisted', 'rejected', 'hired'];
        $educationLevels = ['SSC', 'HSC', 'Bachelor', 'Master', 'Diploma'];

        $jobListings = DB::table('job_listings')->get();
        // Users table no longer has a `role` column; fetch job seekers via RBAC pivot.
        $jobSeekers = DB::table('users')
            ->join('user_roles', 'users.id', '=', 'user_roles.user_id')
            ->join('roles', 'roles.id', '=', 'user_roles.role_id')
            ->whereIn('roles.slug', ['job-seeker', 'job_seeker'])
            ->where('user_roles.is_active', true)
            ->where(function ($q) {
                $q->whereNull('user_roles.expires_at')
                    ->orWhere('user_roles.expires_at', '>', now());
            })
            ->select('users.*')
            ->distinct()
            ->get();
        $applicantProfiles = DB::table('applicant_profiles')->get();

        // Create a mapping from user_id to profile_id
        $profileMap = [];
        foreach ($applicantProfiles as $profile) {
            $profileMap[$profile->user_id] = $profile->id;
        }

        $applications = [];
        $usedCombinations = [];

        // Get existing combinations to avoid duplicates
        $existingCombinations = DB::table('applications')
            ->select('job_listing_id', 'user_id')
            ->get()
            ->map(fn($item) => $item->job_listing_id . '_' . $item->user_id)
            ->toArray();

        foreach ($existingCombinations as $existing) {
            $usedCombinations[] = $existing;
        }

        foreach ($jobSeekers as $seeker) {
            // Each job seeker applies to 1-5 jobs
            $numApplications = rand(1, 5);
            $availableJobs = $jobListings->shuffle();

            for ($i = 0; $i < $numApplications && $i < count($availableJobs); $i++) {
                $job = $availableJobs[$i];
                $combinationKey = $job->id . '_' . $seeker->id;

                // Prevent duplicate applications
                if (in_array($combinationKey, $usedCombinations)) {
                    continue;
                }

                $usedCombinations[] = $combinationKey;

                $status = $statuses[array_rand($statuses)];
                $createdAt = now()->subDays(rand(0, 60));

                $applications[] = [
                    'user_id' => $seeker->id,
                    'job_listing_id' => $job->id,
                    'applicant_profile_id' => $profileMap[$seeker->id] ?? null,
                    'name' => $seeker->name,
                    'email' => $seeker->email,
                    'phone' => '01' . rand(1, 9) . rand(10000000, 99999999),
                    'education_level' => $educationLevels[array_rand($educationLevels)],
                    'years_of_experience' => rand(0, 15),
                    'expected_salary' => rand(25000, 150000),
                    'ats_score' => json_encode([
                        'overall' => rand(40, 95),
                        'keywords' => rand(30, 100),
                        'experience' => rand(30, 100),
                        'education' => rand(30, 100)
                    ]),
                    'matched_keywords' => json_encode(['PHP', 'Laravel', 'JavaScript']),
                    'missing_keywords' => json_encode(['AWS', 'Docker']),
                    'ats_calculation_status' => 'completed',
                    'ats_last_attempted_at' => $createdAt,
                    'ats_attempt_count' => 1,
                    'status' => $status,
                    'employer_notes' => $status != 'pending' ? 'Review completed' : null,
                    'facebook_link' => rand(0, 1) ? 'https://facebook.com/user' . rand(1, 100) : null,
                    'linkedin_link' => rand(0, 1) ? 'https://linkedin.com/in/user' . rand(1, 100) : null,
                    'created_at' => $createdAt,
                    'updated_at' => $createdAt,
                    'deleted_at' => null,
                ];
            }
        }

        // Batch insert to avoid memory issues
        if (!empty($applications)) {
            foreach (array_chunk($applications, 100) as $chunk) {
                DB::table('applications')->insert($chunk);
            }
        }
    }
}
