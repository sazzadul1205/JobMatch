<?php
// database/seeders/CMS/SectionsTableSeeder.php

namespace Database\Seeders\CMS;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class SectionsTableSeeder extends Seeder
{
  public function run()
  {
    // Truncate table first
    Schema::disableForeignKeyConstraints();
    DB::table('sections')->truncate();
    Schema::enableForeignKeyConstraints();

    $assetBase = '/storage';

    $sections = [
      // ============================================
      // HOME PAGE SECTIONS (page_id = 1)
      // ============================================

      // Home Banner
      [
        'page_id' => 1,
        'section_key' => 'banner',
        'component_name' => 'HomeBanner',
        'data' => json_encode([
          'background' => [
            'src' => $assetBase . '/Banner/64065404ef679e54d2dabd90bba3b1744817c578.webp',
            'alt' => 'Background'
          ],
          'overlay' => [
            'darkOverlay' => 'bg-black/40 lg:bg-black/50',
            'gradient' => 'bg-gradient-to-r from-black/85 via-black/10 to-transparent'
          ],
          'content' => [
            'tagline' => [
              'text' => 'Together, We Create Impact',
              'className' => 'uppercase tracking-[4px] font-semibold'
            ],
            'title' => [
              'text' => 'Be the Light for Someone in Need',
              'className' => 'font-bold leading-tight'
            ],
            'description' => [
              'text' => 'Your kindness has the power to change lives. Join us in bringing hope, support, and brighter futures to those in need. Every donation makes a difference big or small.',
              'className' => 'font-normal leading-tight'
            ]
          ],
          'buttons' => [
            [
              'id' => 1,
              'text' => 'Become a Volunteer',
              'variant' => 'primary',
              'className' => 'bg-[#009BE2] text-white hover:bg-[#009BE2]/80',
              'icon' => true
            ],
            [
              'id' => 2,
              'text' => 'How can I help?',
              'variant' => 'secondary',
              'className' => 'bg-white/90 lg:bg-white text-black hover:bg-white',
              'icon' => true
            ]
          ]
        ]),
        'custom_props' => json_encode([]),
        'order' => 1,
        'is_enabled' => true,
        'created_at' => now(),
        'updated_at' => now(),
      ],

      // Home About Us Section
      [
        'page_id' => 1,
        'section_key' => 'about-us',
        'component_name' => 'AboutUsSection',
        'data' => json_encode([
          'section' => [
            'title' => 'About us',
            'description' => 'A Community based philanthropic and development organization emergence/dedicated to sustainable poverty reduction, entrepreneur\'s promotion and capacity building of the underprivileged directing towards a just society.',
            'button' => [
              'text' => 'More about us',
              'link' => '/about'
            ]
          ],
          'mission' => [
            'title' => 'The mission of our organization',
            'items' => [
              [
                'id' => 1,
                'icon' => $assetBase . '/AboutUs/65af8a95ec6612fa3ef2941b_011-charity-1%201.svg',
                'title' => 'Education for All',
                'description' => 'Charity is dedicated to ensuring that every child has access to quality education.',
                'alt' => 'Education Icon'
              ],
              [
                'id' => 2,
                'icon' => $assetBase . '/AboutUs/65af8a95c570e47bd1123b4e_033-hospital%201.svg',
                'title' => 'Health and Wellness',
                'description' => 'Our commitment to health and wellness extends across borders.',
                'alt' => 'Health Icon'
              ],
              [
                'id' => 3,
                'icon' => $assetBase . '/AboutUs/65af8a95cee257c23ab03ff8_040-shelter%201.svg',
                'title' => 'Disaster Relief',
                'description' => 'In times of crisis, Charity responds swiftly to provide emergency relief.',
                'alt' => 'Disaster Relief Icon'
              ],
              [
                'id' => 4,
                'icon' => $assetBase . '/AboutUs/65af8a958d27ad8d830434f4_022-family-1%201.svg',
                'title' => 'Community Development',
                'description' => 'Charity invests in sustainable community development projects to create.',
                'alt' => 'Community Development Icon'
              ]
            ]
          ],
          'impact' => [
            'title' => 'Impact In Numbers',
            'stats' => [
              ['id' => 1, 'value' => '20', 'suffix' => '+', 'label' => 'Years of Service'],
              ['id' => 2, 'value' => '15', 'suffix' => '+', 'label' => 'Project Program'],
              ['id' => 3, 'value' => '10', 'suffix' => '+', 'label' => 'Award Received']
            ]
          ],
          'image' => [
            'src' => $assetBase . '/AboutUs/8235fc0d0e2c3082be7cb9ba5d6f5502a121d0ff.webp',
            'alt' => 'About Us Image'
          ]
        ]),
        'custom_props' => json_encode([]),
        'order' => 2,
        'is_enabled' => true,
        'created_at' => now(),
        'updated_at' => now(),
      ],

      // Home Our Action Section
      [
        'page_id' => 1,
        'section_key' => 'our-action',
        'component_name' => 'OurActionSection',
        'data' => json_encode([
          'section' => [
            'title' => 'Our Actions for Social Change',
            'description' => 'We turn compassion into action by implementing community-led programs, advocating for social justice, and promoting education, health, and equality'
          ],
          'actions' => [
            ['id' => 1, 'icon' => $assetBase . '/OurActions/fi_1940611.svg', 'title' => 'Education', 'description' => 'We empower communities by investing in sustainable projects, training livelihood programs.', 'alt' => 'Education Icon'],
            ['id' => 2, 'icon' => $assetBase . '/OurActions/fi_14888982.svg', 'title' => 'Microfinance', 'description' => 'We empower communities by investing in sustainable projects, training livelihood programs.', 'alt' => 'Microfinance Icon'],
            ['id' => 3, 'icon' => $assetBase . '/OurActions/fi_3004451.svg', 'title' => 'Health', 'description' => 'Providing nutritious meals and groceries to individuals and families in need.', 'alt' => 'Health Icon'],
            ['id' => 4, 'icon' => $assetBase . '/OurActions/fi_17316107.svg', 'title' => 'Organizational Development', 'description' => 'We empower underprivileged children with the opportunity to learn, grow, and succeed.', 'alt' => 'Organizational Development Icon'],
            ['id' => 5, 'icon' => $assetBase . '/OurActions/fi_6786176.svg', 'title' => 'Climate Change', 'description' => 'From free medical camps to life-saving treatments, we support initiatives that provide critical aid to access to proper.', 'alt' => 'Climate Change Icon'],
            ['id' => 6, 'icon' => $assetBase . '/OurActions/fi_1176562.svg', 'title' => 'Human Rights', 'description' => 'From free medical camps to life-saving treatments, we support initiatives that provide critical aid to access to proper.', 'alt' => 'Human Rights Icon'],
            ['id' => 7, 'icon' => $assetBase . '/OurActions/fi_8992468.svg', 'title' => 'Human Resource', 'description' => 'Bringing clean and safe drinking water to communities, improving sanitation, and preventing waterborne diseases.', 'alt' => 'Human Resource Icon'],
            ['id' => 8, 'icon' => $assetBase . '/OurActions/fi_726211.svg', 'title' => 'Social Enterprises', 'description' => 'We empower communities by investing in sustainable projects, training livelihood programs.', 'alt' => 'Social Enterprises Icon'],
            ['id' => 9, 'icon' => $assetBase . '/OurActions/fi_4994126.svg', 'title' => 'Agriculture Food Security', 'description' => 'Bringing clean and safe drinking water to communities, improving sanitation, and preventing waterborne diseases.', 'alt' => 'Agriculture Food Security Icon']
          ]
        ]),
        'custom_props' => json_encode([]),
        'order' => 3,
        'is_enabled' => true,
        'created_at' => now(),
        'updated_at' => now(),
      ],

      // Home Where We Work Section
      [
        'page_id' => 1,
        'section_key' => 'where-we-work',
        'component_name' => 'WhereWeWorkSection',
        'data' => json_encode([
          'section' => ['title' => 'Where We Work'],
          'stats' => [
            ['id' => 1, 'icon' => $assetBase . '/WhereWeWork/image%206-3.png', 'value' => '450K', 'label' => 'Total Member Reach', 'alt' => 'Member Reach Icon'],
            ['id' => 2, 'icon' => $assetBase . '/WhereWeWork/image%206-2.png', 'value' => '41,382', 'label' => 'Mail Engaged in Divers Livelihoods Options', 'alt' => 'Member Reach Icon'],
            ['id' => 3, 'icon' => $assetBase . '/WhereWeWork/image%206-1.png', 'value' => '35,193', 'label' => 'Women Engaged in Diverse Livelihoods Options', 'alt' => 'Member Reach Icon'],
            ['id' => 4, 'icon' => $assetBase . '/WhereWeWork/image%206.png', 'value' => '35,193', 'label' => 'Women Engaged in Diverse Livelihoods Options', 'alt' => 'Mail Engaged Icon'],
            ['id' => 5, 'icon' => $assetBase . '/WhereWeWork/image%206-1.png', 'value' => '38.0 M', 'label' => 'Digital media Outreach', 'alt' => 'Women Engaged Icon'],
            ['id' => 6, 'icon' => $assetBase . '/WhereWeWork/image%206.png', 'value' => '35,193', 'label' => 'Women Engagement in Diverse Livelihood Options', 'alt' => 'Mail Engaged Icon']
          ],
          'image' => [
            'src' => $assetBase . '/WhereWeWork/image.png',
            'alt' => 'Map Place holder Text',
            'className' => 'w-full h-232.5 object-cover rounded-4xl'
          ]
        ]),
        'custom_props' => json_encode([]),
        'order' => 4,
        'is_enabled' => true,
        'created_at' => now(),
        'updated_at' => now(),
      ],

      // Home Our Programs Section
      [
        'page_id' => 1,
        'section_key' => 'our-programs',
        'component_name' => 'OurProgramsSection',
        'data' => json_encode([
          'section' => [
            'title' => 'Our Programs',
            'description' => 'Transforming lives through sustainable development initiatives and community empowerment programs.',
            'button' => [
              'text' => 'View all Projects and programs',
              'link' => '/projects-programs'
            ]
          ],
          'programs' => [
            [
              'id' => 1,
              'title' => 'Micro-Finance <br /> Program',
              'description' => '<div class="space-y-3"><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#524B48] leading-relaxed">Micro finance Program is the core program of DUS activities implemented in partnership with <strong class="text-[#009BE2]">Palli Karma Sahayak Foundation (PKSF)</strong> since 2000.</p></div>',
              'image' => $assetBase . '/OurPrograms/945e2496664a40b12a1cddd6561e954cdc78e255.webp',
              'bgColor' => 'bg-[#E6F3E7]',
              'link' => '/projects-programs/micro-finance'
            ],
            [
              'id' => 2,
              'title' => 'Climate Change and <br /> Disaster Management',
              'description' => '<div class="space-y-3"><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#524B48] leading-relaxed">DUS operates in highly disaster-prone coastal areas of Bangladesh, working with communities to build <strong class="text-[#009BE2]">resilience against natural disasters</strong>.</p></div>',
              'image' => $assetBase . '/OurPrograms/a03fa6dba9fcdac0a5aedf2d337b118228a03298.webp',
              'bgColor' => 'bg-[#F3EDE6]',
              'link' => '/projects-programs/climate-change'
            ],
            [
              'id' => 3,
              'title' => 'Community Radio',
              'description' => '<div class="space-y-3"><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#524B48] leading-relaxed">Empowering Hatiya Island communities by giving them a <strong class="text-[#009BE2]">voice for change</strong> through community radio.</p></div>',
              'image' => $assetBase . '/OurPrograms/e280b627b1771904c38022aac2566b932e248887.webp',
              'bgColor' => 'bg-[#E8E6F3]',
              'link' => '/projects-programs/community-radio'
            ],
            [
              'id' => 4,
              'title' => 'Research and <br /> Documentation',
              'description' => '<div class="space-y-3"><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#524B48] leading-relaxed">DUS has a strong <strong class="text-[#009BE2]">Research and Documentation Cell</strong> conducting quality research.</p></div>',
              'image' => $assetBase . '/OurPrograms/a496922a3fc00992b6c454822d60bde51dc001e5.webp',
              'bgColor' => 'bg-[#F3E6EA]',
              'link' => '/projects-programs/research-documentation'
            ],
            [
              'id' => 5,
              'title' => 'WATSAN <br /> Program',
              'description' => '<div class="space-y-3"><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#524B48] leading-relaxed">Providing sustainable <strong class="text-[#009BE2]">water and sanitation services</strong> to rural communities.</p></div>',
              'image' => $assetBase . '/OurPrograms/be14c45848898048e7b7832affc4dc713b032e10.webp',
              'bgColor' => 'bg-[#F2F3E6]',
              'link' => '/projects-programs/watsan'
            ]
          ]
        ]),
        'custom_props' => json_encode([]),
        'order' => 5,
        'is_enabled' => true,
        'created_at' => now(),
        'updated_at' => now(),
      ],

      // Home Stories Section
      [
        'page_id' => 1,
        'section_key' => 'stories',
        'component_name' => 'StoriesSection',
        'data' => json_encode([
          'section' => [
            'title' => 'Insights, Stories & Impact',
            'description' => 'Read real stories from the field, community experiences, and thought-provoking perspectives that reflect our mission and impact.'
          ]
        ]),
        'custom_props' => json_encode([]),
        'order' => 6,
        'is_enabled' => true,
        'created_at' => now(),
        'updated_at' => now(),
      ],

      // Home Upcoming Events Section
      [
        'page_id' => 1,
        'section_key' => 'upcoming-events',
        'component_name' => 'UpcomingEventsSection',
        'data' => json_encode([
          'section' => [
            'title' => 'Upcoming Events & Community Actions',
            'description' => 'Read real stories from the field, community experiences, and thought-provoking perspectives that reflect our mission and impact.',
            'button' => [
              'text' => 'Explore All Events',
              'link' => '/events'
            ]
          ],
          'image' => [
            'src' => $assetBase . '/UpcomingEvent/8107b01ed92d05bd5a6861d1ca3a78ccbffc6289.webp',
            'alt' => 'Events Image',
            'className' => 'mt-15 rounded-2xl h-139.25 w-auto'
          ]
        ]),
        'custom_props' => json_encode([]),
        'order' => 7,
        'is_enabled' => true,
        'created_at' => now(),
        'updated_at' => now(),
      ],

      // Home Jobs Section
      [
        'page_id' => 1,
        'section_key' => 'jobs',
        'component_name' => 'JobsSection',
        'data' => json_encode([
          'section' => [
            'title' => 'Join our big family',
            'description' => 'Join us on this journey of kindness, and let\'s make a difference, one act of charity at a time.'
          ],
          'filter' => [
            'placeholder' => 'Browse By',
            'options' => [
              ['value' => '', 'label' => 'Browse By'],
              ['value' => 'all', 'label' => 'All Jobs'],
              ['value' => 'full-time', 'label' => 'Full Time'],
              ['value' => 'part-time', 'label' => 'Part Time'],
              ['value' => 'contract', 'label' => 'Contract'],
              ['value' => 'remote', 'label' => 'Remote'],
              ['value' => 'internship', 'label' => 'Internship']
            ]
          ]
        ]),
        'custom_props' => json_encode([]),
        'order' => 8,
        'is_enabled' => true,
        'created_at' => now(),
        'updated_at' => now(),
      ],

      // Home Program Impact Section
      [
        'page_id' => 1,
        'section_key' => 'program-impact',
        'component_name' => 'ProgramImpactSection',
        'data' => json_encode([
          'section' => [
            'title' => 'Program Impact and SDGs',
            'mainImage' => [
              'images' => [
                $assetBase . '/ProgramImpact/8235fc0d0e2c3082be7cb9ba5d6f5502a121d0ff%20(1).webp',
                $assetBase . '/ProgramImpact/64065404ef679e54d2dabd90bba3b1744817c578.webp',
                $assetBase . '/ProgramImpact/8235fc0d0e2c3082be7cb9ba5d6f5502a121d0ff%20(1).webp',
                $assetBase . '/ProgramImpact/64065404ef679e54d2dabd90bba3b1744817c578.webp'
              ]
            ]
          ],
          'sdgImages' => [
            ['id' => 1, 'src' => $assetBase . '/ProgramImpact/Screenshot_17-5-2026_18732_www.figma.com.webp', 'alt' => 'No Poverty'],
            ['id' => 2, 'src' => $assetBase . '/ProgramImpact/Screenshot_17-5-2026_18742_www.figma.com.webp', 'alt' => 'Zero Hunger'],
            ['id' => 3, 'src' => $assetBase . '/ProgramImpact/Screenshot_17-5-2026_18750_www.figma.com.webp', 'alt' => 'Good Health'],
            ['id' => 4, 'src' => $assetBase . '/ProgramImpact/Screenshot_17-5-2026_1887_www.figma.com.webp', 'alt' => 'Quality Education'],
            ['id' => 5, 'src' => $assetBase . '/ProgramImpact/Screenshot_17-5-2026_18823_www.figma.com.webp', 'alt' => 'Gender Equality'],
            ['id' => 6, 'src' => $assetBase . '/ProgramImpact/Screenshot_17-5-2026_18837_www.figma.com.webp', 'alt' => 'Clean Water'],
            ['id' => 7, 'src' => $assetBase . '/ProgramImpact/Screenshot_17-5-2026_1894_www.figma.com.webp', 'alt' => 'Clean Energy'],
            ['id' => 8, 'src' => $assetBase . '/ProgramImpact/Screenshot_17-5-2026_18913_www.figma.com.webp', 'alt' => 'Decent Work'],
            ['id' => 9, 'src' => $assetBase . '/ProgramImpact/Screenshot_17-5-2026_18920_www.figma.com.webp', 'alt' => 'Industry Innovation'],
            ['id' => 10, 'src' => $assetBase . '/ProgramImpact/Screenshot_17-5-2026_18930_www.figma.com.webp', 'alt' => 'Reduced Inequalities'],
            ['id' => 11, 'src' => $assetBase . '/ProgramImpact/Screenshot_17-5-2026_18939_www.figma.com.webp', 'alt' => 'Sustainable Cities'],
            ['id' => 12, 'src' => $assetBase . '/ProgramImpact/Screenshot_17-5-2026_18949_www.figma.com.webp', 'alt' => 'Responsible Consumption'],
            ['id' => 13, 'src' => $assetBase . '/ProgramImpact/Screenshot_17-5-2026_18108_www.figma.com.webp', 'alt' => 'Climate Action'],
            ['id' => 14, 'src' => $assetBase . '/ProgramImpact/Screenshot_17-5-2026_181017_www.figma.com.webp', 'alt' => 'Life Below Water'],
            ['id' => 15, 'src' => $assetBase . '/ProgramImpact/Screenshot_17-5-2026_181031_www.figma.com.webp', 'alt' => 'Life On Land'],
            ['id' => 16, 'src' => $assetBase . '/ProgramImpact/Screenshot_17-5-2026_181046_www.figma.com.webp', 'alt' => 'Peace Justice'],
            ['id' => 17, 'src' => $assetBase . '/ProgramImpact/Screenshot_17-5-2026_181055_www.figma.com.webp', 'alt' => 'Partnerships'],
            ['id' => 18, 'src' => $assetBase . '/ProgramImpact/Screenshot_17-5-2026_181133_www.figma.com.webp', 'alt' => 'SDG 18']
          ]
        ]),
        'custom_props' => json_encode([]),
        'order' => 9,
        'is_enabled' => true,
        'created_at' => now(),
        'updated_at' => now(),
      ],

      // ============================================
      // ABOUT PAGE SECTIONS (page_id = 2)
      // ============================================

      // About Banner
      [
        'page_id' => 2,
        'section_key' => 'banner',
        'component_name' => 'PageBannerSection',
        'data' => json_encode([
          'background' => [
            'src' => $assetBase . '/AboutUs/9734ab42cfed2d40c8ed08cbc3059b227d9aee8b.jpg',
            'alt' => 'Background'
          ],
          'overlay' => [
            'darkOverlay' => 'bg-black/40 lg:bg-black/50',
            'gradient' => 'bg-gradient-to-r from-black/85 via-black/10 to-transparent'
          ],
          'content' => [
            'title' => [
              'text' => 'About Us',
              'className' => 'font-bold leading-tight'
            ],
            'description' => [
              'text' => 'Our mission is to help all the people in need',
              'className' => 'font-normal leading-tight'
            ]
          ]
        ]),
        'custom_props' => json_encode(['sectionId' => 'about-us-banner']),
        'order' => 1,
        'is_enabled' => true,
        'created_at' => now(),
        'updated_at' => now(),
      ],

      // About Background Section
      [
        'page_id' => 2,
        'section_key' => 'background',
        'component_name' => 'HeroFigureSection',
        'data' => json_encode([
          'section' => [
            'title' => 'Background, Roles and Functions'
          ],
          'content' => [
            'html' => '<div class="space-y-6"><div><h2 class="font-700 text-xl sm:text-2xl mb-4 text-[#080C14]">Background:</h2><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug mb-4">The emergence and existence of Dwip Unnayan Songstha (Island Development Association)- DUS was based upon asserting the victims of The Liberation War in 1971 as well as providing immediate relief support to the worse suffer being affected by the devastating cyclone flown over the coastal areas of Bangladesh in 1970.</p></div></div>'
          ],
          'btn' => [
            'text' => 'Learn More About Functions',
            'link' => '/about/functions'
          ],
          'image' => [
            'src' => $assetBase . '/AboutUs/f465fcbdab4004cd25dba4df06b9f8d5f2648620.jpg',
            'alt' => 'Background',
            'className' => 'w-full h-auto lg:h-full object-cover rounded-2xl sm:rounded-3xl lg:rounded-4xl'
          ]
        ]),
        'custom_props' => json_encode(['layout' => 'text-left', 'sectionId' => 'background']),
        'order' => 2,
        'is_enabled' => true,
        'created_at' => now(),
        'updated_at' => now(),
      ],

      // About Vision & Mission
      [
        'page_id' => 2,
        'section_key' => 'vision-and-mission',
        'component_name' => 'HeroFigureSection',
        'data' => json_encode([
          'section' => [
            'title' => 'Vision, Mission, Goal, Objectives and Core values'
          ],
          'content' => [
            'html' => '<div class="space-y-6"><div><h2 class="font-700 text-xl sm:text-2xl mb-4 text-[#080C14]">Vision</h2><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">DUS dreams the existence of a society free from all sorts of exploitation.</p></div></div>'
          ],
          'btn' => [
            'text' => 'Learn More About Vision, Mission, Goal',
            'link' => '/about/vision-mission'
          ],
          'image' => [
            'src' => $assetBase . '/AboutUs/c9c3585f93806d98cf9e2fbeadccb32a66efb4b5.jpg',
            'alt' => 'Vision and Mission',
            'className' => 'w-full h-auto lg:h-full object-cover rounded-2xl sm:rounded-3xl lg:rounded-4xl'
          ]
        ]),
        'custom_props' => json_encode(['layout' => 'text-right', 'sectionId' => 'vision-and-mission', 'bgColor' => 'bg-[#F5F5F5]']),
        'order' => 3,
        'is_enabled' => true,
        'created_at' => now(),
        'updated_at' => now(),
      ],

      // About Interventional Approaches
      [
        'page_id' => 2,
        'section_key' => 'interventional-approaches',
        'component_name' => 'HeroFigureSection',
        'data' => json_encode([
          'section' => [
            'title' => 'Interventional Approaches and DUS Priorities'
          ],
          'content' => [
            'html' => '<div class="space-y-6"><div><h2 class="font-700 text-xl sm:text-2xl mb-4 text-[#080C14]">Sustainable Poverty Reduction and Human Development:</h2><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug mb-4">The development interventional unit of GoB is each Household.</p></div></div>'
          ],
          'btn' => [
            'text' => 'Learn More About Interventional Approaches',
            'link' => '/about/interventional-approaches'
          ],
          'image' => [
            'src' => $assetBase . '/AboutUs/d3afc7e94d5609f2c2356758f463ee15af0450fe.jpg',
            'alt' => 'Interventional Approaches',
            'className' => 'w-full h-auto lg:h-full object-cover rounded-2xl sm:rounded-3xl lg:rounded-4xl'
          ]
        ]),
        'custom_props' => json_encode(['layout' => 'text-left', 'sectionId' => 'interventional-approaches']),
        'order' => 4,
        'is_enabled' => true,
        'created_at' => now(),
        'updated_at' => now(),
      ],

      // About Legal Section
      [
        'page_id' => 2,
        'section_key' => 'legal',
        'component_name' => 'LegalSection',
        'data' => json_encode([
          'background' => [
            'src' => $assetBase . '/AboutUs/64065404ef679e54d2dabd90bba3b1744817c578.jpg',
            'alt' => 'Background'
          ],
          'overlay' => [
            'darkOverlay' => 'bg-black/40',
          ],
          'textBox' => [
            'title' => 'Legal Status and Org.',
            'titleLine2' => 'Affiliations',
            'buttonText' => 'Learn More Affiliations',
            'buttonLink' => '/about/legal-affiliations'
          ]
        ]),
        'custom_props' => json_encode([]),
        'order' => 5,
        'is_enabled' => true,
        'created_at' => now(),
        'updated_at' => now(),
      ],

      // About Evolutionary Changes
      [
        'page_id' => 2,
        'section_key' => 'evolutionary-changes',
        'component_name' => 'HeroFigureSection',
        'data' => json_encode([
          'section' => [
            'title' => 'Evolutionary Changes and Footings'
          ],
          'content' => [
            'html' => '<div class="space-y-6"><div><h2 class="font-700 text-xl sm:text-2xl mb-4 text-[#080C14]">Year 1972-1985</h2><ul class="list-disc pl-5 space-y-2 mb-4"><li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">DUS was formed by a group of young volunteers</li></ul></div></div>'
          ],
          'btn' => [
            'text' => 'Learn More About 2001 - 2020',
            'link' => '/about/evolutionary-changes'
          ],
          'image' => [
            'src' => $assetBase . '/AboutUs/962bd5ee9dacf1f4261d0592856f5716dcffb725.jpg',
            'alt' => 'Evolutionary Changes',
            'className' => 'w-full h-auto lg:h-full object-cover rounded-2xl sm:rounded-3xl lg:rounded-4xl'
          ]
        ]),
        'custom_props' => json_encode(['layout' => 'text-left', 'sectionId' => 'evolutionary-changes']),
        'order' => 6,
        'is_enabled' => true,
        'created_at' => now(),
        'updated_at' => now(),
      ],

      // About Governance
      [
        'page_id' => 2,
        'section_key' => 'governance',
        'component_name' => 'HeroFigureSection',
        'data' => json_encode([
          'section' => [
            'title' => 'Governance'
          ],
          'content' => [
            'html' => '<div class="space-y-6"><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug mb-4">DUS believes in democratic practice and public-private participation to achieve its goal.</p><div><h2 class="font-700 text-xl sm:text-2xl mb-4 text-[#080C14]">General Body</h2><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">The General Body consists of 31 members.</p></div></div>'
          ],
          'btn' => [
            'text' => 'Learn More About Governance',
            'link' => '/about/governance'
          ],
          'image' => [
            'src' => $assetBase . '/AboutUs/ce88efc81f8b1fe8d4f757eba85f05717acb68e4.jpg',
            'alt' => 'Governance',
            'className' => 'w-full h-auto lg:h-full object-cover rounded-2xl sm:rounded-3xl lg:rounded-4xl'
          ]
        ]),
        'custom_props' => json_encode(['layout' => 'text-right', 'sectionId' => 'governance', 'bgColor' => 'bg-[#F5F5F5]']),
        'order' => 7,
        'is_enabled' => true,
        'created_at' => now(),
        'updated_at' => now(),
      ],

      // About Cards Section
      [
        'page_id' => 2,
        'section_key' => 'cards',
        'component_name' => 'CardsSection',
        'data' => json_encode([
          'section' => [
            'title' => 'Cards Section'
          ],
          'cards' => [
            [
              'id' => 'operational-areas',
              'image' => [
                'src' => $assetBase . '/AboutUs/image.png',
                'alt' => 'Operational Areas',
                'className' => 'mx-auto object-contain'
              ],
              'title' => 'Operational Areas',
              'buttonText' => 'Explore Our Areas of Operation',
              'buttonLink' => '/about/operational-areas',
              'bgColor' => 'bg-[#F5F5F5]',
              'cardBgColor' => 'bg-white'
            ],
            [
              'id' => 'achievements',
              'image' => [
                'src' => $assetBase . '/AboutUs/fcbbf1e10ca75bccf6a608e1de01306d56897811.png',
                'alt' => 'Our Achievements',
                'className' => 'mx-auto object-contain'
              ],
              'title' => 'Our Achievements',
              'buttonText' => 'Explore Our Evolution',
              'buttonLink' => '/about/achievements',
              'bgColor' => 'bg-[#F5F5F5]',
              'cardBgColor' => 'bg-white'
            ]
          ]
        ]),
        'custom_props' => json_encode([]),
        'order' => 8,
        'is_enabled' => true,
        'created_at' => now(),
        'updated_at' => now(),
      ],

      // About Programs Activities
      [
        'page_id' => 2,
        'section_key' => 'programs-activities',
        'component_name' => 'HeroFigureSection',
        'data' => json_encode([
          'section' => [
            'title' => 'Programs/Activities'
          ],
          'content' => [
            'html' => '<div class="space-y-6"><div><h2 class="font-700 text-xl sm:text-2xl mb-4 text-[#080C14]">Micro-Finance Program</h2><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug mb-4">Micro finance Program is the core program of all DUS activities.</p></div></div>'
          ],
          'btn' => [
            'text' => 'Learn More About Programs',
            'link' => '/about/programs-activities'
          ],
          'image' => [
            'src' => $assetBase . '/AboutUs/8235fc0d0e2c3082be7cb9ba5d6f5502a121d0ff.jpg',
            'alt' => 'Programs',
            'className' => 'w-full h-auto lg:h-full object-cover rounded-2xl sm:rounded-3xl lg:rounded-4xl'
          ]
        ]),
        'custom_props' => json_encode(['layout' => 'text-right', 'sectionId' => 'programs-activities', 'bgColor' => 'bg-[#F5F5F5]']),
        'order' => 9,
        'is_enabled' => true,
        'created_at' => now(),
        'updated_at' => now(),
      ],

      // About Training
      [
        'page_id' => 2,
        'section_key' => 'training',
        'component_name' => 'HeroFigureSection',
        'data' => json_encode([
          'section' => [
            'title' => 'Training and Other Facilities'
          ],
          'content' => [
            'html' => '<div class="space-y-6"><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug mb-4">DUS believes that training is a key element of the development approach which focuses on people and their participation.</p></div>'
          ],
          'btn' => [
            'text' => 'Learn More About DUS Facilities',
            'link' => '/about/facilities'
          ],
          'image' => [
            'src' => 'https://placehold.co/730x730',
            'alt' => 'Training Facilities',
            'className' => 'w-full h-auto lg:h-full object-cover rounded-2xl sm:rounded-3xl lg:rounded-4xl'
          ]
        ]),
        'custom_props' => json_encode(['layout' => 'text-left', 'sectionId' => 'training']),
        'order' => 10,
        'is_enabled' => true,
        'created_at' => now(),
        'updated_at' => now(),
      ],

      // About FAQ
      [
        'page_id' => 2,
        'section_key' => 'faq',
        'component_name' => 'FAQSection',
        'data' => json_encode([]), // FAQs will come from faqs table by page_slug
        'custom_props' => json_encode([]),
        'order' => 11,
        'is_enabled' => true,
        'created_at' => now(),
        'updated_at' => now(),
      ],

      // ============================================
      // BLOGS PAGE SECTIONS (page_id = 3)
      // ============================================

      [
        'page_id' => 3,
        'section_key' => 'banner',
        'component_name' => 'PageBannerSection',
        'data' => json_encode([
          'background' => [
            'src' => $assetBase . '/OurPrograms/db1b2b6eae5fc260b4204f8257dadbd5a7aa0af7.png',
            'alt' => 'Background'
          ],
          'overlay' => [
            'darkOverlay' => 'bg-black/40 lg:bg-black/50',
            'gradient' => 'bg-gradient-to-r from-black/85 via-black/10 to-transparent'
          ],
          'content' => [
            'title' => [
              'text' => 'Blog',
              'className' => 'font-bold leading-tight'
            ]
          ]
        ]),
        'custom_props' => json_encode(['sectionId' => 'blogs-banner']),
        'order' => 1,
        'is_enabled' => true,
        'created_at' => now(),
        'updated_at' => now(),
      ],

      [
        'page_id' => 3,
        'section_key' => 'blog-section',
        'component_name' => 'BlogSection',
        'data' => json_encode([]),
        'custom_props' => json_encode([]),
        'order' => 2,
        'is_enabled' => true,
        'created_at' => now(),
        'updated_at' => now(),
      ],

      [
        'page_id' => 3,
        'section_key' => 'faq',
        'component_name' => 'FAQSection',
        'data' => json_encode([]),
        'custom_props' => json_encode([]),
        'order' => 3,
        'is_enabled' => true,
        'created_at' => now(),
        'updated_at' => now(),
      ],

      // ============================================
      // CONTACT PAGE SECTIONS (page_id = 4)
      // ============================================

      [
        'page_id' => 4,
        'section_key' => 'banner',
        'component_name' => 'PageBannerSection',
        'data' => json_encode([
          'background' => [
            'src' => $assetBase . '/OurPrograms/db1b2b6eae5fc260b4204f8257dadbd5a7aa0af7.png',
            'alt' => 'Background'
          ],
          'overlay' => [
            'darkOverlay' => 'bg-black/40 lg:bg-black/50',
            'gradient' => 'bg-gradient-to-r from-black/85 via-black/10 to-transparent'
          ],
          'content' => [
            'title' => [
              'text' => "Let's Get in Touch",
              'className' => 'font-bold leading-tight'
            ],
            'description' => [
              'text' => 'Reach out today and let\'s create meaningful, lasting positive change together worldwide',
              'className' => 'font-normal leading-tight'
            ]
          ]
        ]),
        'custom_props' => json_encode(['sectionId' => 'contact-us-banner']),
        'order' => 1,
        'is_enabled' => true,
        'created_at' => now(),
        'updated_at' => now(),
      ],

      [
        'page_id' => 4,
        'section_key' => 'contact-offices',
        'component_name' => 'ContactOfficeSection',
        'data' => json_encode([]),
        'custom_props' => json_encode([]),
        'order' => 2,
        'is_enabled' => true,
        'created_at' => now(),
        'updated_at' => now(),
      ],

      [
        'page_id' => 4,
        'section_key' => 'contact-reach',
        'component_name' => 'ContactReachSection',
        'data' => json_encode([
          'image' => $assetBase . '/ContactUs/8235fc0d0e2c3082be7cb9ba5d6f5502a121d0ff.jpg'
        ]),
        'custom_props' => json_encode([]),
        'order' => 3,
        'is_enabled' => true,
        'created_at' => now(),
        'updated_at' => now(),
      ],

      [
        'page_id' => 4,
        'section_key' => 'follow-us',
        'component_name' => 'FollowUSSection',
        'data' => json_encode([]),
        'custom_props' => json_encode([]),
        'order' => 4,
        'is_enabled' => true,
        'created_at' => now(),
        'updated_at' => now(),
      ],

      [
        'page_id' => 4,
        'section_key' => 'address',
        'component_name' => 'AddressSection',
        'data' => json_encode([]),
        'custom_props' => json_encode([]),
        'order' => 5,
        'is_enabled' => true,
        'created_at' => now(),
        'updated_at' => now(),
      ],

      [
        'page_id' => 4,
        'section_key' => 'faq',
        'component_name' => 'FAQSection',
        'data' => json_encode([]),
        'custom_props' => json_encode(['bgColor' => 'bg-white']),
        'order' => 6,
        'is_enabled' => true,
        'created_at' => now(),
        'updated_at' => now(),
      ],

      [
        'page_id' => 4,
        'section_key' => 'stories',
        'component_name' => 'StoriesSection',
        'data' => json_encode([]),
        'custom_props' => json_encode([]),
        'order' => 7,
        'is_enabled' => true,
        'created_at' => now(),
        'updated_at' => now(),
      ],

      [
        'page_id' => 4,
        'section_key' => 'upcoming-events',
        'component_name' => 'UpcomingEventsSection',
        'data' => json_encode([]),
        'custom_props' => json_encode([]),
        'order' => 8,
        'is_enabled' => true,
        'created_at' => now(),
        'updated_at' => now(),
      ],

      // ============================================
      // PROJECTS & PROGRAMS PAGE SECTIONS (page_id = 5)
      // ============================================

      [
        'page_id' => 5,
        'section_key' => 'banner',
        'component_name' => 'PageBannerSection',
        'data' => json_encode([
          'background' => [
            'src' => 'https://placehold.co/1920x589',
            'alt' => 'Background'
          ],
          'overlay' => [
            'darkOverlay' => 'bg-black/40 lg:bg-black/50',
            'gradient' => 'bg-gradient-to-r from-black/85 via-black/10 to-transparent'
          ],
          'content' => [
            'title' => [
              'text' => 'Meet Our Charity Projects',
              'className' => 'font-bold leading-tight'
            ]
          ]
        ]),
        'custom_props' => json_encode(['sectionId' => 'projects-programs-banner']),
        'order' => 1,
        'is_enabled' => true,
        'created_at' => now(),
        'updated_at' => now(),
      ],

      [
        'page_id' => 5,
        'section_key' => 'our-programs',
        'component_name' => 'OurProgramsSection',
        'data' => json_encode([]),
        'custom_props' => json_encode([]),
        'order' => 2,
        'is_enabled' => true,
        'created_at' => now(),
        'updated_at' => now(),
      ],

      [
        'page_id' => 5,
        'section_key' => 'faq',
        'component_name' => 'FAQSection',
        'data' => json_encode([]),
        'custom_props' => json_encode([]),
        'order' => 3,
        'is_enabled' => true,
        'created_at' => now(),
        'updated_at' => now(),
      ],
    ];

    DB::table('sections')->insert($sections);

    $this->command->info('SectionsTableSeeder completed. Inserted ' . count($sections) . ' sections.');
  }
}
