<?php
// database/seeders/JobListingLocationSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class JobListingLocationSeeder extends Seeder
{
    public function run(): void
    {
        $jobListings = DB::table('job_listings')->get();
        $locations = DB::table('locations')->get();

        $pivotRecords = [];

        foreach ($jobListings as $job) {
            // Each job gets 1-3 locations
            $numLocations = rand(1, 3);
            $assignedLocations = [];

            for ($i = 0; $i < $numLocations; $i++) {
                $location = $locations->random();

                // Avoid duplicate locations for same job
                if (!in_array($location->id, $assignedLocations)) {
                    $assignedLocations[] = $location->id;

                    $pivotRecords[] = [
                        'job_listing_id' => $job->id,
                        'location_id' => $location->id,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
            }
        }

        DB::table('job_listing_location')->insert($pivotRecords);
    }
}
