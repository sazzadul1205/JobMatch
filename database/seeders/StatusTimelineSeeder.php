<?php
// database/seeders/StatusTimelineSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class StatusTimelineSeeder extends Seeder
{
    public function run(): void
    {
        $applications = DB::table('applications')->get();
        $statusOrder = ['pending', 'shortlisted', 'rejected', 'hired'];

        $timelines = [];

        foreach ($applications as $application) {
            $currentStatus = $application->status;
            $statusIndex = array_search($currentStatus, $statusOrder);

            $createdAt = $application->created_at;

            // Add initial status entry
            $timelines[] = [
                'application_id' => $application->id,
                'status' => 'pending',
                'notes' => 'Application submitted successfully',
                'created_at' => $createdAt,
                'updated_at' => $createdAt,
            ];

            // If status is beyond pending, add timeline entries
            if ($statusIndex > 0) {
                $currentTime = strtotime($createdAt);

                for ($i = 1; $i <= $statusIndex; $i++) {
                    $currentTime += rand(86400, 604800); // Add 1-7 days
                    $statusTime = date('Y-m-d H:i:s', $currentTime);

                    $notes = '';
                    switch ($statusOrder[$i]) {
                        case 'shortlisted':
                            $notes = 'Candidate has been shortlisted for interview';
                            break;
                        case 'rejected':
                            $notes = 'Application was not selected for further process';
                            break;
                        case 'hired':
                            $notes = 'Candidate has been hired for the position';
                            break;
                    }

                    $timelines[] = [
                        'application_id' => $application->id,
                        'status' => $statusOrder[$i],
                        'notes' => $notes,
                        'created_at' => $statusTime,
                        'updated_at' => $statusTime,
                    ];
                }
            }
        }

        DB::table('status_timelines')->insert($timelines);
    }
}
