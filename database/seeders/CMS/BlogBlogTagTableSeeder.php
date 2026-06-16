<?php
// database/seeders/CMS/BlogBlogTagTableSeeder.php

namespace Database\Seeders\CMS;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class BlogBlogTagTableSeeder extends Seeder
{
    public function run()
    {
        // Truncate table first
        Schema::disableForeignKeyConstraints();
        DB::table('blog_blog_tag')->truncate();
        Schema::enableForeignKeyConstraints();

        // Map blogs to tags
        // blog_id => [tag_ids]
        $blogTagRelations = [
            // Blog 1: Invest in Kindness
            1 => [1, 2, 3], // Kindness, Future, Investment

            // Blog 2: Technology in Education
            2 => [4, 5, 6], // Technology, Education, Innovation

            // Blog 3: Sustainable Living
            3 => [7, 8, 9], // Sustainability, Environment, Lifestyle

            // Blog 4: Future of Remote Work
            4 => [10, 4, 2], // Work, Technology, Future

            // Blog 5: Mental Health
            5 => [11, 12, 13], // Health, Wellness, Workplace

            // Blog 6: Renewable Energy
            6 => [14, 6, 7], // Energy, Innovation, Sustainability

            // Blog 7: Personal Brand
            7 => [15, 16, 17], // Branding, Marketing, Career

            // Blog 8: Communication
            8 => [18, 19, 20], // Communication, Skills, Leadership

            // Blog 9: Financial Planning
            9 => [21, 22, 17], // Finance, Planning, Career

            // Blog 10: Tech is Changing World
            10 => [4, 6, 2], // Technology, Innovation, Future
        ];

        $pivotData = [];
        $id = 1;

        foreach ($blogTagRelations as $blogId => $tagIds) {
            foreach ($tagIds as $tagId) {
                $pivotData[] = [
                    'blog_id' => $blogId,
                    'tag_id' => $tagId,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
                $id++;
            }
        }

        DB::table('blog_blog_tag')->insert($pivotData);

        $this->command->info('BlogBlogTagTableSeeder completed. Inserted ' . count($pivotData) . ' blog-tag relationships.');
    }
}
