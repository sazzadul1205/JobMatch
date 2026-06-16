<?php
// database/seeders/CMS/NavbarLinksTableSeeder.php

namespace Database\Seeders\CMS;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class NavbarLinksTableSeeder extends Seeder
{
    public function run()
    {
        // Truncate table first
        Schema::disableForeignKeyConstraints();
        DB::table('navbar_links')->truncate();
        Schema::enableForeignKeyConstraints();

        $navbarLinks = [
            [
                'id' => 1,
                'name' => 'Home',
                'href' => '/',
                'order' => 1,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 2,
                'name' => 'About',
                'href' => '/about',
                'order' => 2,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 3,
                'name' => 'Projects & Programs',
                'href' => '/projects-programs',
                'order' => 3,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 4,
                'name' => 'Blogs',
                'href' => '/blogs',
                'order' => 4,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 5,
                'name' => 'Contact Us',
                'href' => '/contact',
                'order' => 5,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('navbar_links')->insert($navbarLinks);

        $this->command->info('NavbarLinksTableSeeder completed. Inserted ' . count($navbarLinks) . ' navbar links.');
    }
}
