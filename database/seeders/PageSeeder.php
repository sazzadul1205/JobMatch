<?php
// database/seeders/PageSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PageSeeder extends Seeder
{
  public function run(): void
  {
    $pages = [
      // Top-level pages
      [
        'parent_id' => null,
        'slug' => 'home',
        'name' => 'Home',
        'title' => 'Home | DUS - Dwip Unnayan Society',
        'description' => 'Empowering communities through sustainable development',
        'template' => 'dynamic',
        'page_type' => 'regular',
        'is_published' => true,
        'created_at' => now(),
        'updated_at' => now(),
      ],
      [
        'parent_id' => null,
        'slug' => 'about',
        'name' => 'About Us',
        'title' => 'About Us | DUS - Dwip Unnayan Society',
        'description' => 'Learn about our mission, vision, and impact',
        'template' => 'dynamic',
        'page_type' => 'regular',
        'is_published' => true,
        'created_at' => now(),
        'updated_at' => now(),
      ],
      [
        'parent_id' => null,
        'slug' => 'contact',
        'name' => 'Contact Us',
        'title' => 'Contact Us | DUS - Dwip Unnayan Society',
        'description' => 'Get in touch with us',
        'template' => 'dynamic',
        'page_type' => 'regular',
        'is_published' => true,
        'created_at' => now(),
        'updated_at' => now(),
      ],
      [
        'parent_id' => null,
        'slug' => 'blogs',
        'name' => 'Blogs',
        'title' => 'Blogs | DUS - Dwip Unnayan Society',
        'description' => 'Latest news and stories',
        'template' => 'dynamic',
        'page_type' => 'blog',
        'is_published' => true,
        'created_at' => now(),
        'updated_at' => now(),
      ],
      [
        'parent_id' => null,
        'slug' => 'projects-programs',
        'name' => 'Projects & Programs',
        'title' => 'Projects & Programs | DUS - Dwip Unnayan Society',
        'description' => 'Our development programs and initiatives',
        'template' => 'dynamic',
        'page_type' => 'regular',
        'is_published' => true,
        'created_at' => now(),
        'updated_at' => now(),
      ],
    ];

    DB::table('pages')->insert($pages);

    $this->command->info('Pages seeded successfully!');
  }
}
