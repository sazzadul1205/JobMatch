<?php
// database/seeders/CMS/SocialLinksTableSeeder.php

namespace Database\Seeders\CMS;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class SocialLinksTableSeeder extends Seeder
{
    public function run()
    {
        // Truncate table first
        Schema::disableForeignKeyConstraints();
        DB::table('social_links')->truncate();
        Schema::enableForeignKeyConstraints();

        $socialLinks = [
            [
                'id' => 1,
                'platform' => 'facebook',
                'icon_name' => 'FaFacebook',
                'url' => 'https://facebook.com/dus',
                'hover_color' => 'hover:text-blue-400',
                'order' => 1,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 2,
                'platform' => 'instagram',
                'icon_name' => 'FaInstagram',
                'url' => 'https://instagram.com/dus',
                'hover_color' => 'hover:text-pink-400',
                'order' => 2,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 3,
                'platform' => 'linkedin',
                'icon_name' => 'FaLinkedin',
                'url' => 'https://linkedin.com/company/dus',
                'hover_color' => 'hover:text-blue-500',
                'order' => 3,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 4,
                'platform' => 'youtube',
                'icon_name' => 'FaYoutube',
                'url' => 'https://youtube.com/@dus',
                'hover_color' => 'hover:text-red-600',
                'order' => 4,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 5,
                'platform' => 'twitter',
                'icon_name' => 'FaXTwitter',
                'url' => 'https://twitter.com/dus',
                'hover_color' => 'hover:text-gray-400',
                'order' => 5,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('social_links')->insert($socialLinks);

        $this->command->info('SocialLinksTableSeeder completed. Inserted ' . count($socialLinks) . ' social links.');
    }
}
