<?php
// database/seeders/AchievementSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AchievementSeeder extends Seeder
{
    public function run(): void
    {
        $achievementNames = [
            'Best Employee Award',
            'Excellence in Programming',
            'Top Performer',
            'Innovation Award',
            'Leadership Excellence',
            'Customer Satisfaction Award',
            'Project of the Year',
            'Team Player Award',
            'Rising Star',
            'Certification Completed'
        ];

        $achievementDetails = [
            'Recognized for outstanding performance in the annual review.',
            'Achieved highest customer satisfaction rating.',
            'Successfully delivered complex project ahead of schedule.',
            'Completed professional certification with distinction.',
            'Led team to achieve record-breaking sales.',
            'Published research paper in international journal.',
            'Won hackathon competition among 100+ teams.',
            'Implemented cost-saving solution saving company 20% budget.'
        ];

        $profiles = DB::table('applicant_profiles')->get();

        $achievements = [];

        foreach ($profiles as $profile) {
            $numAchievements = rand(0, 3);

            for ($i = 0; $i < $numAchievements; $i++) {
                $achievements[] = [
                    'applicant_profile_id' => $profile->id,
                    'achievement_name' => $achievementNames[array_rand($achievementNames)],
                    'achievement_details' => $achievementDetails[array_rand($achievementDetails)],
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        DB::table('achievements')->insert($achievements);
    }
}
