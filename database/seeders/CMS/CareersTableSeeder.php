<?php
// database/seeders/CMS/CareersTableSeeder.php

namespace Database\Seeders\CMS;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CareersTableSeeder extends Seeder
{
    public function run()
    {
        // Truncate table first
        Schema::disableForeignKeyConstraints();
        DB::table('careers')->truncate();
        Schema::enableForeignKeyConstraints();

        $careers = [
            [
                'id' => 1,
                'title' => 'Senior Program Manager - Microfinance',
                'type' => 'Full time',
                'department' => 'Management',
                'location' => 'Dhaka, Bangladesh',
                'description' => 'Lead and oversee microfinance program operations, manage team of field officers, and ensure sustainable financial inclusion for underserved communities. The ideal candidate will have at least 5 years of experience in microfinance management and strong leadership skills.',
                'link' => '/jobs/senior-program-manager',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 2,
                'title' => 'Program Coordinator - Youth Empowerment',
                'type' => 'Part time',
                'department' => 'Development',
                'location' => 'Anywhere in Bangladesh',
                'description' => 'Develop and deliver workshops, mentorship programs, and educational events for underprivileged youth to build essential life skills. Requires experience in youth development and strong communication skills.',
                'link' => '/jobs/youth-coordinator',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 3,
                'title' => 'Climate Change Specialist',
                'type' => 'Full time',
                'department' => 'Climate Action',
                'location' => 'Hatiya, Noakhali',
                'description' => 'Design and implement climate adaptation strategies, conduct risk assessments, and train communities on disaster preparedness. Experience in climate resilience projects in coastal areas required.',
                'link' => '/jobs/climate-specialist',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 4,
                'title' => 'Research Associate - Impact Assessment',
                'type' => 'Contract',
                'department' => 'Research',
                'location' => 'Remote',
                'description' => 'Conduct qualitative and quantitative research, analyze program data, and prepare impact reports for stakeholders. Master\'s degree in Social Sciences or related field required.',
                'link' => '/jobs/research-associate',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 5,
                'title' => 'Radio Production Intern',
                'type' => 'Internship',
                'department' => 'Media',
                'location' => 'Chattogram',
                'description' => 'Assist in content creation, audio production, and community outreach programs for our community radio station. Fresh graduates with passion for community media encouraged to apply.',
                'link' => '/jobs/radio-intern',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 6,
                'title' => 'Finance and Accounts Officer',
                'type' => 'Full time',
                'department' => 'Finance',
                'location' => 'Dhaka, Bangladesh',
                'description' => 'Manage day-to-day accounting operations, prepare financial reports, handle donor reporting, and ensure compliance with NGO financial regulations. CA/CMA partially qualified or BBA/MBA in Accounting.',
                'link' => '/jobs/finance-officer',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 7,
                'title' => 'Monitoring & Evaluation Officer',
                'type' => 'Full time',
                'department' => 'M&E',
                'location' => 'Noakhali',
                'description' => 'Develop M&E frameworks, conduct field monitoring visits, collect and analyze data, and prepare progress reports for donors. Experience with logical framework and data analysis software required.',
                'link' => '/jobs/me-officer',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 8,
                'title' => 'Community Health Worker',
                'type' => 'Part time',
                'department' => 'Health',
                'location' => 'Hatiya Island',
                'description' => 'Conduct health awareness sessions, assist in medical camps, provide basic health education to rural communities, and maintain health records. Training will be provided.',
                'link' => '/jobs/health-worker',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 9,
                'title' => 'ICT Trainer',
                'type' => 'Contract',
                'department' => 'ICT',
                'location' => 'Noakhali',
                'description' => 'Train community members in basic computer skills, digital literacy, and mobile banking. Should have excellent communication skills and patience to work with rural populations.',
                'link' => '/jobs/ict-trainer',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 10,
                'title' => 'Administrative Assistant',
                'type' => 'Full time',
                'department' => 'Administration',
                'location' => 'Dhaka, Bangladesh',
                'description' => 'Provide administrative support, maintain office files, coordinate meetings, handle correspondence, and assist with procurement. Proficiency in MS Office required.',
                'link' => '/jobs/admin-assistant',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('careers')->insert($careers);

        $this->command->info('CareersTableSeeder completed. Inserted ' . count($careers) . ' careers.');
    }
}
