<?php
// database/seeders/CMS/FooterLinksTableSeeder.php

namespace Database\Seeders\CMS;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class FooterLinksTableSeeder extends Seeder
{
    public function run()
    {
        // Truncate table first
        Schema::disableForeignKeyConstraints();
        DB::table('footer_links')->truncate();
        Schema::enableForeignKeyConstraints();

        $footerLinks = [
            // Quick Links (category: quick_links)
            [
                'id' => 1,
                'category' => 'quick_links',
                'name' => 'About Us',
                'url' => '/about',
                'order' => 1,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 2,
                'category' => 'quick_links',
                'name' => 'Community Radio',
                'url' => '/projects-programs/community-radio',
                'order' => 2,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 3,
                'category' => 'quick_links',
                'name' => 'Evaluation',
                'url' => '/evaluation',
                'order' => 3,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 4,
                'category' => 'quick_links',
                'name' => 'Working Area',
                'url' => '/about/operational-areas',
                'order' => 4,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 5,
                'category' => 'quick_links',
                'name' => 'Publication',
                'url' => '/publication',
                'order' => 5,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 6,
                'category' => 'quick_links',
                'name' => 'Mission & Visions',
                'url' => '/about/vision-mission',
                'order' => 6,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 7,
                'category' => 'quick_links',
                'name' => 'Blogs',
                'url' => '/blogs',
                'order' => 7,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 8,
                'category' => 'quick_links',
                'name' => 'Contact Us',
                'url' => '/contact',
                'order' => 8,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Programs Links (category: programs)
            [
                'id' => 9,
                'category' => 'programs',
                'name' => 'Micro-Finance Program',
                'url' => '/projects-programs/micro-finance',
                'order' => 1,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 10,
                'category' => 'programs',
                'name' => 'Disaster Management',
                'url' => '/projects-programs/climate-change',
                'order' => 2,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 11,
                'category' => 'programs',
                'name' => 'Community Radio',
                'url' => '/projects-programs/community-radio',
                'order' => 3,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 12,
                'category' => 'programs',
                'name' => 'Education',
                'url' => '/projects-programs/dwip-education',
                'order' => 4,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 13,
                'category' => 'programs',
                'name' => 'ICT for Development',
                'url' => '/projects-programs/information-and-communication-technology',
                'order' => 5,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 14,
                'category' => 'programs',
                'name' => 'Health Program',
                'url' => '/programs/health',
                'order' => 6,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 15,
                'category' => 'programs',
                'name' => 'Livelihood',
                'url' => '/projects-programs/livelihood-restoration-project',
                'order' => 7,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 16,
                'category' => 'programs',
                'name' => 'Member Facilities',
                'url' => '/projects-programs/group-member-insurance-savings-scheme',
                'order' => 8,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 17,
                'category' => 'programs',
                'name' => 'Social Development',
                'url' => '/projects-programs/social-development-program',
                'order' => 9,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 18,
                'category' => 'programs',
                'name' => 'Legal Support',
                'url' => '/projects-programs/legal-and-human-rights',
                'order' => 10,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 19,
                'category' => 'programs',
                'name' => 'Agriculture',
                'url' => '/programs/agriculture',
                'order' => 11,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 20,
                'category' => 'programs',
                'name' => 'Water and Sanitation',
                'url' => '/projects-programs/watsan-program',
                'order' => 12,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 21,
                'category' => 'programs',
                'name' => 'Research and Documentation',
                'url' => '/projects-programs/research-and-documentation',
                'order' => 13,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 22,
                'category' => 'programs',
                'name' => 'Training Facilities',
                'url' => '/projects-programs/training-and-other-facilities',
                'order' => 14,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 23,
                'category' => 'programs',
                'name' => 'Tourism',
                'url' => '/projects-programs/tourism-and-hospitality',
                'order' => 15,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('footer_links')->insert($footerLinks);

        $this->command->info('FooterLinksTableSeeder completed. Inserted ' . count($footerLinks) . ' footer links.');
    }
}
