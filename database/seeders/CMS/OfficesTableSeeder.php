<?php
// database/seeders/CMS/OfficesTableSeeder.php

namespace Database\Seeders\CMS;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class OfficesTableSeeder extends Seeder
{
    public function run()
    {
        // Truncate table first
        Schema::disableForeignKeyConstraints();
        DB::table('offices')->truncate();
        Schema::enableForeignKeyConstraints();

        $offices = [
            [
                'id' => 1,
                'title' => 'Head Office',
                'address' => '24/5 Mollika, Prominent Housing, 3 Pisciculture Road, Mohammadpur, Dhaka - 1207.',
                'phones' => json_encode(['+880 1761-493412', '+880 1781 732352']),
                'emails' => json_encode(['dusdhaka@gmail.com', 'dus.eddus@gmail.com']),
                'map_url' => 'https://www.google.com/maps?q=23.7570,90.3620&output=embed',
                'coordinates' => json_encode(['lat' => 23.7570, 'lng' => 90.3620]),
                'order' => 1,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 2,
                'title' => 'Regional Office',
                'address' => 'Delower Commission Road, Sonapur, Sadar, Noakhali',
                'phones' => json_encode(['+880 1761-493411', '+880 1761-493414']),
                'emails' => json_encode(['dusreg@gmail.com']),
                'map_url' => 'https://www.google.com/maps?q=22.8256,91.1039&output=embed',
                'coordinates' => json_encode(['lat' => 22.8256, 'lng' => 91.1039]),
                'order' => 2,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 3,
                'title' => 'Foundation Office',
                'address' => 'DUS Centre, Sayedia Bazar, Hatiya, Noakhali',
                'phones' => json_encode(['+880 1761-493418', '+880 1673-011347']),
                'emails' => json_encode(['dusreg@gmail.com']),
                'map_url' => 'https://www.google.com/maps?q=22.4082,91.0909&output=embed',
                'coordinates' => json_encode(['lat' => 22.4082, 'lng' => 91.0909]),
                'order' => 3,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('offices')->insert($offices);

        $this->command->info('OfficesTableSeeder completed. Inserted ' . count($offices) . ' offices.');
    }
}
