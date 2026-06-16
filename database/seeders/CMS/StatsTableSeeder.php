<?php
// database/seeders/CMS/StatsTableSeeder.php

namespace Database\Seeders\CMS;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class StatsTableSeeder extends Seeder
{
    public function run()
    {
        // Truncate table first
        Schema::disableForeignKeyConstraints();
        DB::table('stats')->truncate();
        Schema::enableForeignKeyConstraints();

        $assetBase = '/storage';

        $stats = [
            // Stats for Home page (page_slug: home) - Impact In Numbers
            [
                'page_slug' => 'home',
                'value' => '20',
                'suffix' => '+',
                'label' => 'Years of Service',
                'icon' => null,
                'order' => 1,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'page_slug' => 'home',
                'value' => '15',
                'suffix' => '+',
                'label' => 'Project Program',
                'icon' => null,
                'order' => 2,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'page_slug' => 'home',
                'value' => '10',
                'suffix' => '+',
                'label' => 'Award Received',
                'icon' => null,
                'order' => 3,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Stats for Where We Work section (also on home page)
            [
                'page_slug' => 'home',
                'value' => '450K',
                'suffix' => null,
                'label' => 'Total Member Reach',
                'icon' => $assetBase . '/WhereWeWork/image%206-3.png',
                'order' => 4,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'page_slug' => 'home',
                'value' => '41,382',
                'suffix' => null,
                'label' => 'Mail Engaged in Divers Livelihoods Options',
                'icon' => $assetBase . '/WhereWeWork/image%206-2.png',
                'order' => 5,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'page_slug' => 'home',
                'value' => '35,193',
                'suffix' => null,
                'label' => 'Women Engaged in Diverse Livelihoods Options',
                'icon' => $assetBase . '/WhereWeWork/image%206-1.png',
                'order' => 6,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'page_slug' => 'home',
                'value' => '38.0 M',
                'suffix' => null,
                'label' => 'Digital Media Outreach',
                'icon' => $assetBase . '/WhereWeWork/image%206-1.png',
                'order' => 7,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Stats for About page (page_slug: about)
            [
                'page_slug' => 'about',
                'value' => '40,000',
                'suffix' => '+',
                'label' => 'Active Group Members',
                'icon' => null,
                'order' => 1,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'page_slug' => 'about',
                'value' => '97',
                'suffix' => '%',
                'label' => 'Female Beneficiaries',
                'icon' => null,
                'order' => 2,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'page_slug' => 'about',
                'value' => '50',
                'suffix' => '+',
                'label' => 'Villages Covered',
                'icon' => null,
                'order' => 3,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'page_slug' => 'about',
                'value' => '31',
                'suffix' => null,
                'label' => 'General Body Members',
                'icon' => null,
                'order' => 4,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'page_slug' => 'about',
                'value' => '30',
                'suffix' => '%',
                'label' => 'Women in General Body',
                'icon' => null,
                'order' => 5,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'page_slug' => 'about',
                'value' => '7',
                'suffix' => null,
                'label' => 'Executive Committee Members',
                'icon' => null,
                'order' => 6,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('stats')->insert($stats);

        $this->command->info('StatsTableSeeder completed. Inserted ' . count($stats) . ' statistics.');
    }
}
