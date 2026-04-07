<?php
// database/seeders/EducationHistorySeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EducationHistorySeeder extends Seeder
{
    public function run(): void
    {
        $institutions = [
            'University of Dhaka',
            'BUET',
            'Jahangirnagar University',
            'Rajshahi University',
            'Chittagong University',
            'North South University',
            'BRAC University',
            'AIUB',
            'EWU',
            'IUB',
            'UAP',
            'DIU',
            'NUB',
            'Southeast University',
            'University of Asia Pacific'
        ];

        $degrees = [
            'BSc in CSE',
            'BSc in EEE',
            'BBA',
            'MBA',
            'BA in English',
            'BSS in Economics',
            'MSc in Data Science',
            'Diploma in Engineering',
            'HSC',
            'SSC',
            'Bachelor of Arts',
            'Master of Commerce'
        ];

        $profiles = DB::table('applicant_profiles')->get();

        $educationHistories = [];

        foreach ($profiles as $profile) {
            $numEducation = rand(1, 3);

            for ($i = 0; $i < $numEducation; $i++) {
                $educationHistories[] = [
                    'applicant_profile_id' => $profile->id,
                    'institution_name' => $institutions[array_rand($institutions)],
                    'degree' => $degrees[array_rand($degrees)],
                    'passing_year' => rand(2010, 2024),
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        DB::table('education_histories')->insert($educationHistories);
    }
}
