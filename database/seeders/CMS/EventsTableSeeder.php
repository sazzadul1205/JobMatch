<?php
// database/seeders/CMS/EventsTableSeeder.php

namespace Database\Seeders\CMS;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class EventsTableSeeder extends Seeder
{
    public function run()
    {
        // Truncate table first
        Schema::disableForeignKeyConstraints();
        DB::table('events')->truncate();
        Schema::enableForeignKeyConstraints();

        $assetBase = '/storage';

        $events = [
            [
                'id' => 1,
                'title' => 'Participate in our community clean-up day and make a difference together',
                'description' => "Let's shape the future of the food industry together! Participate at the 9th Food Bangladesh Int'l Expo 2026, where we will showcase sustainable food practices and community-led initiatives. Join us to learn about food security, nutrition, and how you can contribute to ending hunger in coastal communities.",
                'location' => 'International Convention City Bashundhara - ICCB',
                'date_day' => 25,
                'date_month' => 'Apr',
                'date_weekday' => 'THU',
                'date_day_number' => 1,
                'date_time' => '10:30AM',
                'link' => '/events/community-cleanup',
                'image' => $assetBase . '/UpcomingEvent/8107b01ed92d05bd5a6861d1ca3a78ccbffc6289.webp',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 2,
                'title' => 'Education for All: Scholarship Distribution Ceremony',
                'description' => 'Join us as we distribute scholarships to underprivileged students and celebrate their achievements in pursuing quality education. This year, we are awarding 500 scholarships to meritorious students from coastal communities. The ceremony will feature speeches from education experts and success stories from past scholarship recipients.',
                'location' => 'Dhaka University Campus - Dhaka',
                'date_day' => 28,
                'date_month' => 'Apr',
                'date_weekday' => 'SUN',
                'date_day_number' => 2,
                'date_time' => '02:00PM',
                'link' => '/events/scholarship-ceremony',
                'image' => null,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 3,
                'title' => 'Climate Adaptation Workshop for Coastal Communities',
                'description' => 'Learn sustainable farming techniques and disaster preparedness strategies to combat climate change impacts in coastal areas. This hands-on workshop will cover climate-resilient agriculture, early warning systems, cyclone shelter management, and livelihood diversification. Open to farmers, community leaders, and NGO workers.',
                'location' => 'Hatiya Island Community Center - Noakhali',
                'date_day' => 5,
                'date_month' => 'May',
                'date_weekday' => 'MON',
                'date_day_number' => 3,
                'date_time' => '09:00AM',
                'link' => '/events/climate-workshop',
                'image' => null,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 4,
                'title' => 'Women Entrepreneurship Fair 2026',
                'description' => 'A platform for women entrepreneurs from coastal regions to showcase their products, network with buyers, and learn about business development. The fair will feature handicrafts, food products, agricultural goods, and success stories of women who have transformed their lives through microfinance and entrepreneurship training.',
                'location' => 'Noakhali Sadar Auditorium - Noakhali',
                'date_day' => 12,
                'date_month' => 'May',
                'date_weekday' => 'MON',
                'date_day_number' => 4,
                'date_time' => '10:00AM',
                'link' => '/events/women-entrepreneurship-fair',
                'image' => null,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 5,
                'title' => 'Community Radio Broadcasting Training',
                'description' => 'Training program for youth and community members interested in radio production, journalism, and content creation. Participants will learn script writing, voice recording, editing, and community engagement strategies. Certificate will be provided upon completion.',
                'location' => 'DUS Community Radio Station - Hatiya',
                'date_day' => 18,
                'date_month' => 'May',
                'date_weekday' => 'WED',
                'date_day_number' => 5,
                'date_time' => '09:00AM',
                'link' => '/events/radio-training',
                'image' => null,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 6,
                'title' => 'Health Camp: Free Medical Checkup',
                'description' => 'Free medical camp offering general health checkups, eye examinations, dental care, and medicine distribution for underprivileged communities. Special focus on maternal and child health, nutrition counseling, and vaccination updates. All services are free of cost.',
                'location' => 'DUS Foundation Office - Hatiya',
                'date_day' => 25,
                'date_month' => 'May',
                'date_weekday' => 'WED',
                'date_day_number' => 6,
                'date_time' => '09:00AM',
                'link' => '/events/health-camp',
                'image' => null,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 7,
                'title' => 'International Day of Climate Action: Tree Plantation Drive',
                'description' => 'Join us for a massive tree plantation drive across coastal areas to combat climate change and restore mangrove forests. We aim to plant 10,000 trees in one day. Volunteers, students, and community members are all welcome. Saplings and tools will be provided.',
                'location' => 'Multiple Locations - Hatiya Island',
                'date_day' => 5,
                'date_month' => 'Jun',
                'date_weekday' => 'THU',
                'date_day_number' => 7,
                'date_time' => '08:00AM',
                'link' => '/events/tree-plantation',
                'image' => null,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('events')->insert($events);

        $this->command->info('EventsTableSeeder completed. Inserted ' . count($events) . ' events.');
    }
}
