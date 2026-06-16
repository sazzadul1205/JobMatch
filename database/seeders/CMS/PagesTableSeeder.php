<?php
// database/seeders/CMS/PagesTableSeeder.php

namespace Database\Seeders\CMS;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class PagesTableSeeder extends Seeder
{
    public function run()
    {
        // Truncate table first (disable foreign key checks)
        Schema::disableForeignKeyConstraints();
        DB::table('pages')->truncate();
        Schema::enableForeignKeyConstraints();

        $pages = [
            // Main pages (parent_id = NULL)
            [
                'id' => 1,
                'parent_id' => null,
                'slug' => 'home',
                'title' => 'Home',
                'meta_description' => 'Dwip Unnayan Society (DUS) - Empowering coastal communities through sustainable development, microfinance, education, and disaster management.',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 2,
                'parent_id' => null,
                'slug' => 'about',
                'title' => 'About Us',
                'meta_description' => 'Learn about Dwip Unnayan Society (DUS) - our vision, mission, background, governance, and achievements in coastal Bangladesh.',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 3,
                'parent_id' => null,
                'slug' => 'blogs',
                'title' => 'Blogs',
                'meta_description' => 'Read latest stories, insights, and updates from Dwip Unnayan Society about our work in coastal communities.',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 4,
                'parent_id' => null,
                'slug' => 'contact',
                'title' => 'Contact Us',
                'meta_description' => 'Get in touch with Dwip Unnayan Society. Find our office addresses, phone numbers, emails, and send us a message.',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 5,
                'parent_id' => null,
                'slug' => 'projects-programs',
                'title' => 'Projects & Programs',
                'meta_description' => 'Explore Dwip Unnayan Society\'s programs including Micro-Finance, Climate Change Adaptation, Community Radio, Education, and WATSAN.',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // About subpages (parent_id = 2)
            [
                'id' => 6,
                'parent_id' => 2,
                'slug' => 'about/vision-mission',
                'title' => 'Vision, Mission, Goal, Objectives and Core values',
                'meta_description' => 'Discover DUS\'s vision for a society free from exploitation, our mission to empower coastal communities, and our core values.',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 7,
                'parent_id' => 2,
                'slug' => 'about/functions',
                'title' => 'Background, Roles and Functions',
                'meta_description' => 'Learn about DUS\'s background, evolution from volunteer initiative to registered organization, and our roles in coastal development.',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 8,
                'parent_id' => 2,
                'slug' => 'about/legal-affiliations',
                'title' => 'Legal Status and Organizational Affiliations',
                'meta_description' => 'DUS legal registration status and organizational affiliations with PKSF, CUP, ALRD, CGG, BNNRC, and Disaster Forum Bangladesh.',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 9,
                'parent_id' => 2,
                'slug' => 'about/interventional-approaches',
                'title' => 'Interventional Approaches and DUS Priorities',
                'meta_description' => 'DUS priorities: Sustainable Poverty Reduction, Landless Poor Focus, and Women Empowerment in coastal Bangladesh.',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 10,
                'parent_id' => 2,
                'slug' => 'about/evolutionary-changes',
                'title' => 'Evolutionary Changes and Footings',
                'meta_description' => 'Timeline of DUS evolution from 1972 to present - relief work, organizational formation, and major projects.',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 11,
                'parent_id' => 2,
                'slug' => 'about/governance',
                'title' => 'Governance Structure',
                'meta_description' => 'DUS governance structure including General Body (31 members) and Executive Committee (7 members) with democratic practices.',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 12,
                'parent_id' => 2,
                'slug' => 'about/operational-areas',
                'title' => 'Operational Areas of DUS',
                'meta_description' => 'DUS operates in Hatiya Island, Subarnachar, Companyganj, and Noakhali Sadar - reaching 50+ villages and 40,000+ households.',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 13,
                'parent_id' => 2,
                'slug' => 'about/achievements',
                'title' => 'Our Achievements',
                'meta_description' => 'DUS achievements: 40,000+ micro-credit members, 97% women beneficiaries, Community Radio establishment, and climate adaptation programs.',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 14,
                'parent_id' => 2,
                'slug' => 'about/programs-activities',
                'title' => 'Programs & Activities',
                'meta_description' => 'DUS core programs: Micro-Finance Program and Jagoron credit instrument for rural enterprise development.',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 15,
                'parent_id' => 2,
                'slug' => 'about/facilities',
                'title' => 'Training and Other Facilities',
                'meta_description' => 'DUS Training and Communication Unit offering skill development, leadership training, and vocational programs for coastal communities.',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('pages')->insert($pages);

        $this->command->info('PagesTableSeeder completed. Inserted ' . count($pages) . ' pages.');
    }
}
