<?php
// database/seeders/SectionSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SectionSeeder extends Seeder
{
  public function run(): void
  {
    $sections = [
      [
        'name' => 'Home Banner',
        'component' => 'HomeBanner',
        'description' => 'Main banner for home page with background, overlay, content and buttons',
        'default_props' => json_encode(['bgColor' => '', 'height' => 'h-125 md:h-280']),
        'is_active' => true,
        'created_at' => now(),
        'updated_at' => now(),
      ],
      [
        'name' => 'Page Banner',
        'component' => 'PageBannerSection',
        'description' => 'Standard page banner with background and title',
        'default_props' => json_encode(['height' => 'h-125 md:h-147.25']),
        'is_active' => true,
        'created_at' => now(),
        'updated_at' => now(),
      ],
      [
        'name' => 'About Us',
        'component' => 'AboutUsSection',
        'description' => 'About us section with mission, vision and impact stats',
        'default_props' => null,
        'is_active' => true,
        'created_at' => now(),
        'updated_at' => now(),
      ],
      [
        'name' => 'Our Actions',
        'component' => 'OurActionSection',
        'description' => 'Grid of actions/programs the organization does',
        'default_props' => null,
        'is_active' => true,
        'created_at' => now(),
        'updated_at' => now(),
      ],
      [
        'name' => 'Where We Work',
        'component' => 'WhereWeWorkSection',
        'description' => 'Statistics and map of operational areas',
        'default_props' => null,
        'is_active' => true,
        'created_at' => now(),
        'updated_at' => now(),
      ],
      [
        'name' => 'Our Programs',
        'component' => 'OurProgramsSection',
        'description' => 'List of programs with sticky scrolling effect',
        'default_props' => null,
        'is_active' => true,
        'created_at' => now(),
        'updated_at' => now(),
      ],
      [
        'name' => 'Stories',
        'component' => 'StoriesSection',
        'description' => 'Horizontal scrollable stories/cards',
        'default_props' => null,
        'is_active' => true,
        'created_at' => now(),
        'updated_at' => now(),
      ],
      [
        'name' => 'Upcoming Events',
        'component' => 'UpcomingEventsSection',
        'description' => 'List of upcoming events',
        'default_props' => null,
        'is_active' => true,
        'created_at' => now(),
        'updated_at' => now(),
      ],
      [
        'name' => 'Jobs',
        'component' => 'JobsSection',
        'description' => 'Job listings with filters',
        'default_props' => null,
        'is_active' => true,
        'created_at' => now(),
        'updated_at' => now(),
      ],
      [
        'name' => 'Program Impact',
        'component' => 'ProgramImpactSection',
        'description' => 'Carousel and SDG images',
        'default_props' => null,
        'is_active' => true,
        'created_at' => now(),
        'updated_at' => now(),
      ],
      [
        'name' => 'Hero Figure',
        'component' => 'HeroFigureSection',
        'description' => 'Hero section with text and image (left or right layout)',
        'default_props' => json_encode(['layout' => 'text-left']),
        'is_active' => true,
        'created_at' => now(),
        'updated_at' => now(),
      ],
      [
        'name' => 'Legal',
        'component' => 'LegalSection',
        'description' => 'Legal status and affiliations banner',
        'default_props' => null,
        'is_active' => true,
        'created_at' => now(),
        'updated_at' => now(),
      ],
      [
        'name' => 'Cards',
        'component' => 'CardsSection',
        'description' => 'Two column cards section',
        'default_props' => null,
        'is_active' => true,
        'created_at' => now(),
        'updated_at' => now(),
      ],
      [
        'name' => 'FAQ',
        'component' => 'FAQSection',
        'description' => 'Frequently asked questions accordion',
        'default_props' => null,
        'is_active' => true,
        'created_at' => now(),
        'updated_at' => now(),
      ],
      [
        'name' => 'Follow Us',
        'component' => 'FollowUSSection',
        'description' => 'Social media follow links',
        'default_props' => null,
        'is_active' => true,
        'created_at' => now(),
        'updated_at' => now(),
      ],
      [
        'name' => 'Contact Offices',
        'component' => 'ContactOfficeSection',
        'description' => 'Office contact information cards',
        'default_props' => null,
        'is_active' => true,
        'created_at' => now(),
        'updated_at' => now(),
      ],
      [
        'name' => 'Contact Reach',
        'component' => 'ContactReachSection',
        'description' => 'Contact form with image',
        'default_props' => null,
        'is_active' => true,
        'created_at' => now(),
        'updated_at' => now(),
      ],
      [
        'name' => 'Address',
        'component' => 'AddressSection',
        'description' => 'Office locations with map tabs',
        'default_props' => null,
        'is_active' => true,
        'created_at' => now(),
        'updated_at' => now(),
      ],
      [
        'name' => 'Blog Section',
        'component' => 'BlogSection',
        'description' => 'Blog posts listing with main featured blog',
        'default_props' => null,
        'is_active' => true,
        'created_at' => now(),
        'updated_at' => now(),
      ],
    ];

    DB::table('sections')->insert($sections);
  }
}
