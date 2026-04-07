<?php
// database/seeders/JobViewSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class JobViewSeeder extends Seeder
{
    public function run(): void
    {
        $jobListings = DB::table('job_listings')->get();
        $users = DB::table('users')->get();

        $ipAddresses = [
            '103.120.200.1',
            '103.120.200.2',
            '103.120.200.3',
            '103.120.200.4',
            '203.112.78.1',
            '203.112.78.2',
            '203.112.78.3',
            '203.112.78.4',
            '114.130.64.1',
            '114.130.64.2',
            '114.130.64.3'
        ];

        $jobViews = [];
        $usedCombinations = [];

        foreach ($jobListings as $job) {
            // Each job gets 5-50 views
            $numViews = rand(5, 50);

            for ($i = 0; $i < $numViews; $i++) {
                $user = rand(0, 1) ? $users->random() : null;
                $ipAddress = $ipAddresses[array_rand($ipAddresses)];

                $combinationKey = $job->id . '_' . ($user->id ?? 'null') . '_' . $ipAddress;

                if (in_array($combinationKey, $usedCombinations) && rand(0, 3) > 0) {
                    continue;
                }

                $usedCombinations[] = $combinationKey;

                $jobViews[] = [
                    'job_listing_id' => $job->id,
                    'user_id' => $user->id ?? null,
                    'ip_address' => $ipAddress,
                    'created_at' => now()->subDays(rand(0, 60))->subHours(rand(0, 23)),
                    'updated_at' => now(),
                ];
            }
        }

        DB::table('job_views')->insert($jobViews);

        // Update job listings view counts
        $viewCounts = DB::table('job_views')
            ->select('job_listing_id', DB::raw('COUNT(*) as count'))
            ->groupBy('job_listing_id')
            ->get();

        foreach ($viewCounts as $viewCount) {
            DB::table('job_listings')
                ->where('id', $viewCount->job_listing_id)
                ->update(['views_count' => $viewCount->count]);
        }
    }
}
