<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        // Run the database seeds
        $this->call([
            LocationSeeder::class,
            JobCategorySeeder::class,
            UserSeeder::class,
            ApplicantProfileSeeder::class,
            JobHistorySeeder::class,
            EducationHistorySeeder::class,
            AchievementSeeder::class,
            JobListingSeeder::class,
            JobListingLocationSeeder::class,
            ApplicationSeeder::class,
            StatusTimelineSeeder::class,
            JobViewSeeder::class,
        ]);

        // Clean public storage uploads after migrate:fresh --seed
        Storage::disk('public')->deleteDirectory('cvs');
        Storage::disk('public')->deleteDirectory('profile_photos');
        Storage::disk('public')->deleteDirectory('applicant-cvs');
        Storage::disk('public')->deleteDirectory('applicant-photos');

        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);
    }
}
