<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // ==========================================
        // STEP 1: CMS SEEDERS (Frontend Content)
        // These must run first as they create the base
        // sections, pages, and shared components
        // ==========================================

        // 1.1 Sections master list
        $this->call(SectionSeeder::class);

        // 1.2 Shared components (TopBar, Navbar, Footer)
        $this->call(SharedComponentSeeder::class);

        // 1.3 Pages (home, about, contact, blogs, projects-programs)
        $this->call(PageSeeder::class);

        // 1.4 Page sections (content for each page)
        $this->call(PageSectionSeeder::class);

        // ==========================================
        // STEP 2: Base data (no dependencies)
        // ==========================================
        $this->call([
            LocationSeeder::class,
            JobCategorySeeder::class,
        ]);

        // ==========================================
        // STEP 3: Create users (no RBAC yet)
        // ==========================================
        $this->call(UserSeeder::class);

        // ==========================================
        // STEP 4: Assign roles to users (RBAC FIRST!)
        // This must run BEFORE any seeder that needs role information
        // ==========================================
        $this->call(RBACSeeder::class);

        // ==========================================
        // STEP 5: Create profiles (after roles are assigned)
        // ==========================================
        $this->call(ApplicantProfileSeeder::class);

        // ==========================================
        // STEP 6: Create job listings
        // ==========================================
        $this->call(JobListingSeeder::class);
        $this->call(JobListingLocationSeeder::class);

        // ==========================================
        // STEP 7: Create user history/data
        // ==========================================
        $this->call(JobHistorySeeder::class);
        $this->call(EducationHistorySeeder::class);
        $this->call(AchievementSeeder::class);

        // ==========================================
        // STEP 8: Create applications (needs roles to identify job seekers)
        // ==========================================
        $this->call(ApplicationSeeder::class);
        $this->call(StatusTimelineSeeder::class);
        $this->call(JobViewSeeder::class);

        // ==========================================
        // STEP 9: Clean storage directories
        // ==========================================
        Storage::disk('public')->deleteDirectory('cvs');
        Storage::disk('public')->deleteDirectory('profile_photos');
        Storage::disk('public')->deleteDirectory('applicant-cvs');
        Storage::disk('public')->deleteDirectory('applicant-photos');

        // ==========================================
        // STEP 10: Create test user
        // ==========================================
        User::updateOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        $this->command->info('');
        $this->command->info('========================================');
        $this->command->info('🎉 ALL SEEDERS COMPLETED SUCCESSFULLY!');
        $this->command->info('========================================');
        $this->command->info('');
        $this->command->info('CMS Data Seeded:');
        $this->command->info('  - Sections: ✓');
        $this->command->info('  - Shared Components (TopBar, Navbar, Footer): ✓');
        $this->command->info('  - Pages: ✓');
        $this->command->info('  - Page Sections: ✓');
        $this->command->info('');
        $this->command->info('Job Portal Data Seeded:');
        $this->command->info('  - Locations & Categories: ✓');
        $this->command->info('  - Users & Roles: ✓');
        $this->command->info('  - Job Listings: ✓');
        $this->command->info('  - Applications: ✓');
        $this->command->info('========================================');
    }
}
