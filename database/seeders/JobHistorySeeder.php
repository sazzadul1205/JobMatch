<?php
// database/seeders/JobHistorySeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class JobHistorySeeder extends Seeder
{
    public function run(): void
    {
        $companies = [
            'Tech Corp',
            'Software Ltd',
            'Digital Agency',
            'IT Solutions',
            'E-commerce Hub',
            'Startup Inc',
            'Global Services',
            'Creative Studio',
            'Data Systems',
            'Cloud Networks',
            'Web Solutions BD',
            'App Developers'
        ];

        $positions = [
            'Junior Developer',
            'Software Engineer',
            'Senior Developer',
            'Team Lead',
            'Project Coordinator',
            'System Analyst',
            'Technical Support',
            'QA Engineer'
        ];

        $profiles = DB::table('applicant_profiles')->get();

        $jobHistories = [];

        foreach ($profiles as $profile) {
            $numJobs = rand(1, 4);

            for ($i = 0; $i < $numJobs; $i++) {
                $startingYear = rand(2015, 2023);
                $isCurrent = ($i == $numJobs - 1 && rand(0, 1) == 1);
                $endingYear = $isCurrent ? null : ($startingYear + rand(1, 3));

                $jobHistories[] = [
                    'applicant_profile_id' => $profile->id,
                    'company_name' => $companies[array_rand($companies)],
                    'position' => $positions[array_rand($positions)],
                    'starting_year' => $startingYear,
                    'ending_year' => $endingYear,
                    'is_current' => $isCurrent,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        DB::table('job_histories')->insert($jobHistories);
    }
}
