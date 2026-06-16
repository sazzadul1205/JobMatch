<?php
// database/seeders/CMS/StoriesTableSeeder.php

namespace Database\Seeders\CMS;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class StoriesTableSeeder extends Seeder
{
    public function run()
    {
        // Truncate table first
        Schema::disableForeignKeyConstraints();
        DB::table('stories')->truncate();
        Schema::enableForeignKeyConstraints();

        $assetBase = '/storage';

        $stories = [
            [
                'id' => 1,
                'title' => 'Invest in Kindness, Reap a Better Future',
                'description' => 'Micro finance Program is the core program of all DUS activities. DUS has been implementing its major program in partnership with Palli Karma Sahayak Foundation (PKSF) since 2000. It provides collateral free micro-credit to its around 40K+ group members where 97 percent are female.',
                'image' => $assetBase . '/Stories/8107b01ed92d05bd5a6861d1ca3a78ccbffc6289.webp',
                'date' => 'June 6, 2023',
                'link' => '/stories/invest-in-kindness',
                'order' => 1,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 2,
                'title' => 'How to Design a Custom Pool That Perfectly Fits Your Charlotte Backyard',
                'description' => 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s.',
                'image' => $assetBase . '/Stories/b3d758bf8cd7985c857cdbe55b5101b105ee9f75.webp',
                'date' => 'June 6, 2023',
                'link' => '/stories/custom-pool-design',
                'order' => 2,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 3,
                'title' => 'The Benefits of Mindfulness in Daily Life',
                'description' => 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s.',
                'image' => $assetBase . '/Stories/8235fc0d0e2c3082be7cb9ba5d6f5502a121d0ff%20(1).webp',
                'date' => 'June 6, 2023',
                'link' => '/stories/mindfulness-benefits',
                'order' => 3,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 4,
                'title' => 'Empowering Women Through Microfinance',
                'description' => 'Discover how small loans are making a big difference in the lives of rural women in coastal Bangladesh. Through our microfinance program, women are starting businesses, sending children to school, and building better futures.',
                'image' => $assetBase . '/Stories/3fe55eb9ebcfd7efb80f559a00b8b5a1da0e8c3e.webp',
                'date' => 'July 15, 2023',
                'link' => '/stories/empowering-women',
                'order' => 4,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 5,
                'title' => 'Building Resilient Communities Against Climate Change',
                'description' => 'Learn about our initiatives to help coastal communities adapt to climate change through early warning systems, cyclone shelters, and climate-resilient agriculture practices.',
                'image' => $assetBase . '/Stories/de90e922c05aa3585b8f65361c306413c3b3d7be.webp',
                'date' => 'August 2, 2023',
                'link' => '/stories/climate-resilience',
                'order' => 5,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 6,
                'title' => 'Providing Clean Water to Remote Villages',
                'description' => 'Access to clean water is a basic human right. Our WATSAN program has installed 250 deep tube wells and provided sanitation facilities to 4,605 households in coastal communities.',
                'image' => $assetBase . '/Stories/f465fcbdab4004cd25dba4df06b9f8d5f2648620.webp',
                'date' => 'September 10, 2023',
                'link' => '/stories/clean-water',
                'order' => 6,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('stories')->insert($stories);

        $this->command->info('StoriesTableSeeder completed. Inserted ' . count($stories) . ' stories.');
    }
}
