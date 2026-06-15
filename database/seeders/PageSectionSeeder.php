<?php
// database/seeders/PageSectionSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PageSectionSeeder extends Seeder
{
  /**
   * Insert page section rows with a consistent column set.
   *
   * Laravel bulk inserts require every row to have the same keys.
   * Some of these seed rows omit custom_props, so we normalize them
   * before inserting to avoid SQLSTATE[21S01] errors.
   */
  private function insertPageSections(array $rows): void
  {
    $normalizedRows = array_map(function (array $row) {
      return array_merge([
        'custom_props' => null,
      ], $row);
    }, $rows);

    DB::table('page_sections')->insert($normalizedRows);
  }

  public function run(): void
  {
    // First, get the page IDs
    $homePage = DB::table('pages')->where('slug', 'home')->first();
    $aboutPage = DB::table('pages')->where('slug', 'about')->first();
    $contactPage = DB::table('pages')->where('slug', 'contact')->first();
    $blogsPage = DB::table('pages')->where('slug', 'blogs')->first();
    $projectsPage = DB::table('pages')->where('slug', 'projects-programs')->first();

    // Get section IDs
    $homeBannerSection = DB::table('sections')->where('component', 'HomeBanner')->first();
    $pageBannerSection = DB::table('sections')->where('component', 'PageBannerSection')->first();
    $aboutUsSection = DB::table('sections')->where('component', 'AboutUsSection')->first();
    $ourActionSection = DB::table('sections')->where('component', 'OurActionSection')->first();
    $whereWeWorkSection = DB::table('sections')->where('component', 'WhereWeWorkSection')->first();
    $ourProgramsSection = DB::table('sections')->where('component', 'OurProgramsSection')->first();
    $storiesSection = DB::table('sections')->where('component', 'StoriesSection')->first();
    $upcomingEventsSection = DB::table('sections')->where('component', 'UpcomingEventsSection')->first();
    $jobsSection = DB::table('sections')->where('component', 'JobsSection')->first();
    $programImpactSection = DB::table('sections')->where('component', 'ProgramImpactSection')->first();
    $heroFigureSection = DB::table('sections')->where('component', 'HeroFigureSection')->first();
    $legalSection = DB::table('sections')->where('component', 'LegalSection')->first();
    $cardsSection = DB::table('sections')->where('component', 'CardsSection')->first();
    $faqSection = DB::table('sections')->where('component', 'FAQSection')->first();
    $followUsSection = DB::table('sections')->where('component', 'FollowUSSection')->first();
    $contactOfficeSection = DB::table('sections')->where('component', 'ContactOfficeSection')->first();
    $contactReachSection = DB::table('sections')->where('component', 'ContactReachSection')->first();
    $addressSection = DB::table('sections')->where('component', 'AddressSection')->first();
    $blogSection = DB::table('sections')->where('component', 'BlogSection')->first();

    // Asset helper for paths (store raw paths, will be converted by controller)
    $assetPath = function ($path) {
      return '/storage/' . ltrim($path, '/');
    };

    // ============================================
    // HOME PAGE SECTIONS
    // ============================================

    $homeSections = [
      // Banner
      [
        'page_id' => $homePage->id,
        'section_id' => $homeBannerSection->id,
        'section_key' => 'banner',
        'order' => 1,
        'prop_name' => 'bannerData',
        'data' => json_encode([
          'background' => [
            'src' => $assetPath('Banner/64065404ef679e54d2dabd90bba3b1744817c578.webp'),
            'alt' => 'Background'
          ],
          'overlay' => [
            'darkOverlay' => 'bg-black/40 lg:bg-black/50',
            'gradient' => 'bg-gradient-to-r from-black/85 via-black/10 to-transparent'
          ],
          'content' => [
            'tagline' => ['text' => 'Together, We Create Impact', 'className' => 'uppercase tracking-[4px] font-semibold'],
            'title' => ['text' => 'Be the Light for Someone in Need', 'className' => 'font-bold leading-tight'],
            'description' => ['text' => 'Your kindness has the power to change lives. Join us in bringing hope, support, and brighter futures to those in need. Every donation makes a difference big or small.', 'className' => 'font-normal leading-tight']
          ],
          'buttons' => [
            ['id' => 1, 'text' => 'Become a Volunteer', 'className' => 'bg-[#009BE2] text-white hover:bg-[#009BE2]/80', 'icon' => true],
            ['id' => 2, 'text' => 'How can I help?', 'className' => 'bg-white/90 lg:bg-white text-black hover:bg-white', 'icon' => true]
          ]
        ]),
        'created_at' => now(),
        'updated_at' => now(),
      ],
      // About Us
      [
        'page_id' => $homePage->id,
        'section_id' => $aboutUsSection->id,
        'section_key' => 'about-us',
        'order' => 2,
        'prop_name' => 'aboutUsData',
        'data' => json_encode([
          'section' => [
            'title' => 'About us',
            'description' => 'A Community based philanthropic and development organization emergence/dedicated to sustainable poverty reduction, entrepreneur\'s promotion and capacity building of the underprivileged directing towards a just society. Interventions, DUS strives to bring about positive change in the quality of life of the poor community of rural Bangladesh.',
            'button' => ['text' => 'More about us', 'link' => '/about']
          ],
          'mission' => [
            'title' => 'The mission of our organization',
            'items' => [
              ['id' => 1, 'icon' => $assetPath('AboutUs/65af8a95ec6612fa3ef2941b_011-charity-1%201.svg'), 'title' => 'Education for All', 'description' => 'Charity is dedicated to ensuring that every child has access to quality education.', 'alt' => 'Education Icon'],
              ['id' => 2, 'icon' => $assetPath('AboutUs/65af8a95c570e47bd1123b4e_033-hospital%201.svg'), 'title' => 'Health and Wellness', 'description' => 'Our commitment to health and wellness extends across borders.', 'alt' => 'Health Icon'],
              ['id' => 3, 'icon' => $assetPath('AboutUs/65af8a95cee257c23ab03ff8_040-shelter%201.svg'), 'title' => 'Disaster Relief', 'description' => 'In times of crisis, Charity responds swiftly to provide emergency relief.', 'alt' => 'Disaster Relief Icon'],
              ['id' => 4, 'icon' => $assetPath('AboutUs/65af8a958d27ad8d830434f4_022-family-1%201.svg'), 'title' => 'Community Development', 'description' => 'Charity invests in sustainable community development projects to create.', 'alt' => 'Community Development Icon']
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
          'image' => ['src' => $assetPath('AboutUs/8235fc0d0e2c3082be7cb9ba5d6f5502a121d0ff.webp'), 'alt' => 'About Us Image']
        ]),
        'created_at' => now(),
        'updated_at' => now(),
      ],
      // Our Action
      [
        'page_id' => $homePage->id,
        'section_id' => $ourActionSection->id,
        'section_key' => 'our-action',
        'order' => 3,
        'prop_name' => 'actionData',
        'data' => json_encode([
          'section' => [
            'title' => 'Our Actions for Social Change',
            'description' => 'We turn compassion into action by implementing community-led programs, advocating for social justice, and promoting education, health, and equality'
          ],
          'actions' => [
            ['id' => 1, 'icon' => $assetPath('OurActions/fi_1940611.svg'), 'title' => 'Education', 'description' => 'We empower communities by investing in sustainable projects, training livelihood programs.', 'alt' => 'Education Icon'],
            ['id' => 2, 'icon' => $assetPath('OurActions/fi_14888982.svg'), 'title' => 'Microfinance', 'description' => 'We empower communities by investing in sustainable projects, training livelihood programs.', 'alt' => 'Microfinance Icon'],
            ['id' => 3, 'icon' => $assetPath('OurActions/fi_3004451.svg'), 'title' => 'Health', 'description' => 'Providing nutritious meals and groceries to individuals and families in need.', 'alt' => 'Health Icon'],
            ['id' => 4, 'icon' => $assetPath('OurActions/fi_17316107.svg'), 'title' => 'Organizational Development', 'description' => 'We empower underprivileged children with the opportunity to learn, grow, and succeed.', 'alt' => 'Organizational Development Icon'],
            ['id' => 5, 'icon' => $assetPath('OurActions/fi_6786176.svg'), 'title' => 'Climate Change', 'description' => 'From free medical camps to life-saving treatments, we support initiatives that provide critical aid to access to proper.', 'alt' => 'Climate Change Icon'],
            ['id' => 6, 'icon' => $assetPath('OurActions/fi_1176562.svg'), 'title' => 'Human Rights', 'description' => 'From free medical camps to life-saving treatments, we support initiatives that provide critical aid to access to proper.', 'alt' => 'Human Rights Icon'],
            ['id' => 7, 'icon' => $assetPath('OurActions/fi_8992468.svg'), 'title' => 'Human Resource', 'description' => 'Bringing clean and safe drinking water to communities, improving sanitation, and preventing waterborne diseases.', 'alt' => 'Human Resource Icon'],
            ['id' => 8, 'icon' => $assetPath('OurActions/fi_726211.svg'), 'title' => 'Social Enterprises', 'description' => 'We empower communities by investing in sustainable projects, training livelihood programs.', 'alt' => 'Social Enterprises Icon'],
            ['id' => 9, 'icon' => $assetPath('OurActions/fi_4994126.svg'), 'title' => 'Agriculture Food Security', 'description' => 'Bringing clean and safe drinking water to communities, improving sanitation, and preventing waterborne diseases.', 'alt' => 'Agriculture Food Security Icon']
          ]
        ]),
        'created_at' => now(),
        'updated_at' => now(),
      ],
      // Where We Work
      [
        'page_id' => $homePage->id,
        'section_id' => $whereWeWorkSection->id,
        'section_key' => 'where-we-work',
        'order' => 4,
        'prop_name' => 'workData',
        'data' => json_encode([
          'section' => ['title' => 'Where We Work'],
          'stats' => [
            ['id' => 1, 'icon' => $assetPath('WhereWeWork/image%206-3.png'), 'value' => '450K', 'label' => 'Total Member Reach', 'alt' => 'Member Reach Icon'],
            ['id' => 2, 'icon' => $assetPath('WhereWeWork/image%206-2.png'), 'value' => '41,382', 'label' => 'Mail Engaged in Divers Livelihoods Options', 'alt' => 'Member Reach Icon'],
            ['id' => 3, 'icon' => $assetPath('WhereWeWork/image%206-1.png'), 'value' => '35,193', 'label' => 'Women Engaged in Diverse Livelihoods Options', 'alt' => 'Member Reach Icon'],
            ['id' => 4, 'icon' => $assetPath('WhereWeWork/image%206.png'), 'value' => '35,193', 'label' => 'Women Engaged in Diverse Livelihoods Options', 'alt' => 'Mail Engaged Icon'],
            ['id' => 5, 'icon' => $assetPath('WhereWeWork/image%206-1.png'), 'value' => '38.0 M', 'label' => 'Digital media Outreach', 'alt' => 'Women Engaged Icon'],
            ['id' => 6, 'icon' => $assetPath('WhereWeWork/image%206.png'), 'value' => '35,193', 'label' => 'Women Engagement in Diverse Livelihood Options', 'alt' => 'Mail Engaged Icon']
          ],
          'image' => ['src' => $assetPath('WhereWeWork/image.png'), 'alt' => 'Map Place holder Text', 'className' => 'w-full h-232.5 object-cover rounded-4xl']
        ]),
        'created_at' => now(),
        'updated_at' => now(),
      ],
      // Our Programs
      [
        'page_id' => $homePage->id,
        'section_id' => $ourProgramsSection->id,
        'section_key' => 'our-programs',
        'order' => 5,
        'prop_name' => 'programsData',
        'data' => json_encode([
          'section' => [
            'title' => 'Our Programs',
            'description' => 'Transforming lives through sustainable development initiatives and community empowerment programs.',
            'button' => ['text' => 'View all Projects and programs', 'link' => '/projects-programs']
          ],
          'programs' => [
            [
              'id' => 1,
              'title' => 'Micro-Finance <br /> Program',
              'description' => '<div class="space-y-3"><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#524B48] leading-relaxed">Micro finance Program is the core program of DUS activities implemented in partnership with <strong class="text-[#009BE2]">Palli Karma Sahayak Foundation (PKSF)</strong> since 2000. It provides collateral free micro-credit to 40K+ group members where 97% are female.</p><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#524B48] leading-relaxed">The program includes savings schemes for poor women with no access to mainstream banks, helping them promote income generating activities and achieve economic empowerment.</p></div>',
              'image' => $assetPath('OurPrograms/945e2496664a40b12a1cddd6561e954cdc78e255.webp'),
              'bgColor' => 'bg-[#E6F3E7]',
              'link' => '/projects-programs/micro-finance'
            ],
            [
              'id' => 2,
              'title' => 'Climate Change and <br /> Disaster Management',
              'description' => '<div class="space-y-3"><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#524B48] leading-relaxed">DUS operates in highly disaster-prone coastal areas of Bangladesh, working with communities to build <strong class="text-[#009BE2]">resilience against natural disasters</strong> like cyclones, floods, and storm surges.</p><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#524B48] leading-relaxed">Moving beyond relief, we focus on institutionalized preparedness, risk reduction, early warning systems, and long-term climate adaptation strategies for vulnerable coastal communities.</p></div>',
              'image' => $assetPath('OurPrograms/a03fa6dba9fcdac0a5aedf2d337b118228a03298.webp'),
              'bgColor' => 'bg-[#F3EDE6]',
              'link' => '/projects-programs/climate-change'
            ],
            [
              'id' => 3,
              'title' => 'Community Radio',
              'description' => '<div class="space-y-3"><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#524B48] leading-relaxed">Empowering Hatiya Island communities by giving them a <strong class="text-[#009BE2]">voice for change</strong> through community radio. Bangladesh is the 2nd country in South Asia with a Community Radio Policy.</p><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#524B48] leading-relaxed">The radio broadcasts agricultural information, health awareness, local news, women empowerment programs, and cultural content, reaching thousands of listeners daily.</p></div>',
              'image' => $assetPath('OurPrograms/e280b627b1771904c38022aac2566b932e248887.webp'),
              'bgColor' => 'bg-[#E8E6F3]',
              'link' => '/projects-programs/community-radio'
            ],
            [
              'id' => 4,
              'title' => 'Research and <br /> Documentation',
              'description' => '<div class="space-y-3"><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#524B48] leading-relaxed">DUS has a strong <strong class="text-[#009BE2]">Research and Documentation Cell</strong> conducting quality research in education, health, livelihood, environment, human rights, and social justice.</p><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#524B48] leading-relaxed">The cell engages in surveys, impact assessments, and documentation of best practices, helping shape effective development interventions and policy advocacy.</p></div>',
              'image' => $assetPath('OurPrograms/a496922a3fc00992b6c454822d60bde51dc001e5.webp'),
              'bgColor' => 'bg-[#F3E6EA]',
              'link' => '/projects-programs/research-documentation'
            ],
            [
              'id' => 5,
              'title' => 'WATSAN <br /> Program',
              'description' => '<div class="space-y-3"><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#524B48] leading-relaxed">Providing sustainable <strong class="text-[#009BE2]">water and sanitation services</strong> to rural communities with support from the Netherland Government, implemented in Nangolia Char and Nalerchar under Hatiya Upazilla.</p><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#524B48] leading-relaxed">Target: 4,605 households with sanitation, 250 deep tube wells for safe water, and hygiene education for 20,000 people.</p></div>',
              'image' => $assetPath('OurPrograms/be14c45848898048e7b7832affc4dc713b032e10.webp'),
              'bgColor' => 'bg-[#F2F3E6]',
              'link' => '/projects-programs/watsan'
            ]
          ]
        ]),
        'created_at' => now(),
        'updated_at' => now(),
      ],
      // Stories
      [
        'page_id' => $homePage->id,
        'section_id' => $storiesSection->id,
        'section_key' => 'stories',
        'order' => 6,
        'prop_name' => 'storiesData',
        'data' => json_encode([
          'section' => [
            'title' => 'Insights, Stories & Impact',
            'description' => 'Read real stories from the field, community experiences, and thought-provoking perspectives that reflect our mission and impact.'
          ],
          'stories' => [
            ['id' => 1, 'image' => $assetPath('Stories/8107b01ed92d05bd5a6861d1ca3a78ccbffc6289.webp'), 'date' => 'June 6, 2023', 'title' => 'Invest in Kindness, Reap a Better Future', 'description' => 'Lorem Ipsum is simply dummy text of the printing and typesetting industry...', 'link' => '/stories/invest-in-kindness'],
            ['id' => 2, 'image' => $assetPath('Stories/b3d758bf8cd7985c857cdbe55b5101b105ee9f75.webp'), 'date' => 'June 6, 2023', 'title' => 'How to Design a Custom Pool That Perfectly Fits Your Charlotte Backyard', 'description' => 'Lorem Ipsum is simply dummy text of the printing and typesetting industry...', 'link' => '/stories/custom-pool-design'],
            ['id' => 3, 'image' => $assetPath('Stories/8235fc0d0e2c3082be7cb9ba5d6f5502a121d0ff%20(1).webp'), 'date' => 'June 6, 2023', 'title' => 'The Benefits of Mindfulness in Daily Life', 'description' => 'Lorem Ipsum is simply dummy text of the printing and typesetting industry...', 'link' => '/stories/mindfulness-benefits'],
            ['id' => 4, 'image' => $assetPath('Stories/3fe55eb9ebcfd7efb80f559a00b8b5a1da0e8c3e.webp'), 'date' => 'July 15, 2023', 'title' => 'Empowering Women Through Microfinance', 'description' => 'Discover how small loans are making a big difference...', 'link' => '/stories/empowering-women'],
            ['id' => 5, 'image' => $assetPath('Stories/de90e922c05aa3585b8f65361c306413c3b3d7be.webp'), 'date' => 'August 2, 2023', 'title' => 'Building Resilient Communities Against Climate Change', 'description' => 'Learn about our initiatives to help coastal communities...', 'link' => '/stories/climate-resilience'],
            ['id' => 6, 'image' => $assetPath('Stories/f465fcbdab4004cd25dba4df06b9f8d5f2648620.webp'), 'date' => 'September 10, 2023', 'title' => 'Providing Clean Water to Remote Villages', 'description' => 'Access to clean water is a basic human right...', 'link' => '/stories/clean-water']
          ]
        ]),
        'created_at' => now(),
        'updated_at' => now(),
      ],
      // Upcoming Events
      [
        'page_id' => $homePage->id,
        'section_id' => $upcomingEventsSection->id,
        'section_key' => 'upcoming-events',
        'order' => 7,
        'prop_name' => 'eventsData',
        'data' => json_encode([
          'section' => [
            'title' => 'Upcoming Events & Community Actions',
            'description' => 'Read real stories from the field, community experiences, and thought-provoking perspectives that reflect our mission and impact.',
            'button' => ['text' => 'Explore All Events', 'link' => '/events']
          ],
          'image' => ['src' => $assetPath('UpcomingEvent/8107b01ed92d05bd5a6861d1ca3a78ccbffc6289.webp'), 'alt' => 'Events Image', 'className' => 'mt-15 rounded-2xl h-139.25 w-auto'],
          'events' => [
            [
              'id' => 1,
              'date' => ['day' => '25', 'month' => 'Apr', 'weekday' => 'THU', 'dayNumber' => '1', 'time' => '10:30AM'],
              'location' => 'International Convention City Bashundhara - ICCB',
              'title' => 'Participate in our community clean-up day and make a difference together',
              'description' => 'Let\'s shape the future of the food industry together! Participate at the 9th Food Bangladesh Int\'l Expo 2026,',
              'link' => '/events/community-cleanup'
            ],
            [
              'id' => 2,
              'date' => ['day' => '28', 'month' => 'Apr', 'weekday' => 'SUN', 'dayNumber' => '2', 'time' => '02:00PM'],
              'location' => 'Dhaka University Campus - Dhaka',
              'title' => 'Education for All: Scholarship Distribution Ceremony',
              'description' => 'Join us as we distribute scholarships to underprivileged students and celebrate their achievements in pursuing quality education.',
              'link' => '/events/scholarship-ceremony'
            ],
            [
              'id' => 3,
              'date' => ['day' => '05', 'month' => 'May', 'weekday' => 'MON', 'dayNumber' => '3', 'time' => '09:00AM'],
              'location' => 'Hatiya Island Community Center - Noakhali',
              'title' => 'Climate Adaptation Workshop for Coastal Communities',
              'description' => 'Learn sustainable farming techniques and disaster preparedness strategies to combat climate change impacts in coastal areas.',
              'link' => '/events/climate-workshop'
            ]
          ]
        ]),
        'created_at' => now(),
        'updated_at' => now(),
      ],
      // Jobs
      [
        'page_id' => $homePage->id,
        'section_id' => $jobsSection->id,
        'section_key' => 'jobs',
        'order' => 8,
        'prop_name' => 'jobsData',
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
          ],
          'jobs' => [
            ['id' => 1, 'type' => 'Full time', 'department' => 'Management', 'location' => 'Dhaka, Bangladesh', 'title' => 'Senior Program Manager - Microfinance', 'description' => 'Lead and oversee microfinance program operations, manage team of field officers, and ensure sustainable financial inclusion for underserved communities.', 'link' => '/jobs/senior-program-manager'],
            ['id' => 2, 'type' => 'Part time', 'department' => 'Development', 'location' => 'Anywhere in Bangladesh', 'title' => 'Program Coordinator - Youth Empowerment', 'description' => 'Develop and deliver workshops, mentorship programs, and educational events for underprivileged youth to build essential life skills.', 'link' => '/jobs/youth-coordinator'],
            ['id' => 3, 'type' => 'Full time', 'department' => 'Climate Action', 'location' => 'Hatiya, Noakhali', 'title' => 'Climate Change Specialist', 'description' => 'Design and implement climate adaptation strategies, conduct risk assessments, and train communities on disaster preparedness.', 'link' => '/jobs/climate-specialist'],
            ['id' => 4, 'type' => 'Contract', 'department' => 'Research', 'location' => 'Remote', 'title' => 'Research Associate - Impact Assessment', 'description' => 'Conduct qualitative and quantitative research, analyze program data, and prepare impact reports for stakeholders.', 'link' => '/jobs/research-associate'],
            ['id' => 5, 'type' => 'Internship', 'department' => 'Media', 'location' => 'Chattogram', 'title' => 'Radio Production Intern', 'description' => 'Assist in content creation, audio production, and community outreach programs for our community radio station.', 'link' => '/jobs/radio-intern']
          ]
        ]),
        'created_at' => now(),
        'updated_at' => now(),
      ],
      // Program Impact
      [
        'page_id' => $homePage->id,
        'section_id' => $programImpactSection->id,
        'section_key' => 'program-impact',
        'order' => 9,
        'prop_name' => 'impactData',
        'data' => json_encode([
          'section' => [
            'title' => 'Program Impact and SDGs',
            'mainImage' => [
              'images' => [
                $assetPath('ProgramImpact/8235fc0d0e2c3082be7cb9ba5d6f5502a121d0ff%20(1).webp'),
                $assetPath('ProgramImpact/64065404ef679e54d2dabd90bba3b1744817c578.webp'),
                $assetPath('ProgramImpact/8235fc0d0e2c3082be7cb9ba5d6f5502a121d0ff%20(1).webp'),
                $assetPath('ProgramImpact/64065404ef679e54d2dabd90bba3b1744817c578.webp')
              ]
            ]
          ],
          'sdgImages' => [
            ['id' => 1, 'src' => $assetPath('ProgramImpact/Screenshot_17-5-2026_18732_www.figma.com.webp'), 'alt' => 'No Poverty'],
            ['id' => 2, 'src' => $assetPath('ProgramImpact/Screenshot_17-5-2026_18742_www.figma.com.webp'), 'alt' => 'Zero Hunger'],
            ['id' => 3, 'src' => $assetPath('ProgramImpact/Screenshot_17-5-2026_18750_www.figma.com.webp'), 'alt' => 'Good Health'],
            ['id' => 4, 'src' => $assetPath('ProgramImpact/Screenshot_17-5-2026_1887_www.figma.com.webp'), 'alt' => 'Quality Education'],
            ['id' => 5, 'src' => $assetPath('ProgramImpact/Screenshot_17-5-2026_18823_www.figma.com.webp'), 'alt' => 'Gender Equality'],
            ['id' => 6, 'src' => $assetPath('ProgramImpact/Screenshot_17-5-2026_18837_www.figma.com.webp'), 'alt' => 'Clean Water'],
            ['id' => 7, 'src' => $assetPath('ProgramImpact/Screenshot_17-5-2026_1894_www.figma.com.webp'), 'alt' => 'Clean Energy'],
            ['id' => 8, 'src' => $assetPath('ProgramImpact/Screenshot_17-5-2026_18913_www.figma.com.webp'), 'alt' => 'Decent Work'],
            ['id' => 9, 'src' => $assetPath('ProgramImpact/Screenshot_17-5-2026_18920_www.figma.com.webp'), 'alt' => 'Industry Innovation'],
            ['id' => 10, 'src' => $assetPath('ProgramImpact/Screenshot_17-5-2026_18930_www.figma.com.webp'), 'alt' => 'Reduced Inequalities'],
            ['id' => 11, 'src' => $assetPath('ProgramImpact/Screenshot_17-5-2026_18939_www.figma.com.webp'), 'alt' => 'Sustainable Cities'],
            ['id' => 12, 'src' => $assetPath('ProgramImpact/Screenshot_17-5-2026_18949_www.figma.com.webp'), 'alt' => 'Responsible Consumption'],
            ['id' => 13, 'src' => $assetPath('ProgramImpact/Screenshot_17-5-2026_18108_www.figma.com.webp'), 'alt' => 'Climate Action'],
            ['id' => 14, 'src' => $assetPath('ProgramImpact/Screenshot_17-5-2026_181017_www.figma.com.webp'), 'alt' => 'Life Below Water'],
            ['id' => 15, 'src' => $assetPath('ProgramImpact/Screenshot_17-5-2026_181031_www.figma.com.webp'), 'alt' => 'Life On Land'],
            ['id' => 16, 'src' => $assetPath('ProgramImpact/Screenshot_17-5-2026_181046_www.figma.com.webp'), 'alt' => 'Peace Justice'],
            ['id' => 17, 'src' => $assetPath('ProgramImpact/Screenshot_17-5-2026_181055_www.figma.com.webp'), 'alt' => 'Partnerships'],
            ['id' => 18, 'src' => $assetPath('ProgramImpact/Screenshot_17-5-2026_181133_www.figma.com.webp'), 'alt' => 'SDG 18']
          ]
        ]),
        'created_at' => now(),
        'updated_at' => now(),
      ],
    ];

    DB::table('page_sections')->insert($homeSections);
    $this->command->info('Home page sections seeded successfully!');

    // ============================================
    // ABOUT PAGE SECTIONS
    // ============================================

    $aboutSections = [
      // Banner
      [
        'page_id' => $aboutPage->id,
        'section_id' => $pageBannerSection->id,
        'section_key' => 'banner',
        'order' => 1,
        'prop_name' => 'bannerData',
        'custom_props' => json_encode(['sectionId' => 'about-us-banner']),
        'data' => json_encode([
          'background' => [
            'src' => $assetPath('AboutUs/9734ab42cfed2d40c8ed08cbc3059b227d9aee8b.jpg'),
            'alt' => 'Background'
          ],
          'overlay' => [
            'darkOverlay' => 'bg-black/40 lg:bg-black/50',
            'gradient' => 'bg-gradient-to-r from-black/85 via-black/10 to-transparent'
          ],
          'content' => [
            'title' => ['text' => 'About Us', 'className' => 'font-bold leading-tight'],
            'description' => ['text' => 'Our mission is to help all the people in need', 'className' => 'font-normal leading-tight']
          ]
        ]),
        'created_at' => now(),
        'updated_at' => now(),
      ],
      // Background
      [
        'page_id' => $aboutPage->id,
        'section_id' => $heroFigureSection->id,
        'section_key' => 'background',
        'order' => 2,
        'prop_name' => 'data',
        'custom_props' => json_encode(['layout' => 'text-left', 'sectionId' => 'background']),
        'data' => json_encode([
          'section' => ['title' => 'Background, Roles and Functions'],
          'content' => [
            'html' => '<div class="space-y-6"><div><h2 class="font-700 text-xl sm:text-2xl mb-4 text-[#080C14]">Background:</h2><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug mb-4">The emergence and existence of Dwip Unnayan Songstha (Island Development Association)- DUS was based upon asserting the victims of The Liberation War in 1971 as well as providing immediate relief support to the worse suffer being affected by the devastating cyclone flown over the coastal areas of Bangladesh in 1970.</p><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug mb-4">DUS, by virtue of its roles, functions and services being visioned and dreamt by the founder and associates, is basically a development and philanthropic organization located at Hatiya Island under Noakhali district in southern Bangladesh. The main focus and concentration of the organization since its inception has been to humanitarian and rehabilitation work for war and cyclone victim affected populations which in the passage of time has turned into integrated socio-economic and sustainable community development services directing towards a just society free from all sorts of exploitation, injustice and deprivation.</p><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Until 1981, DUS has been well-thought-out and recognized as a volunteer initiative for providing aid, relief and rehabilitation related activities and gaining experiences on the said services over last one decade since its inception, the structural based organizational formation took into shape in 1982, announcing its mandate as an association/platform for land development, protection and restoration.</p></div></div>'
          ],
          'btn' => ['text' => 'Learn More About Functions', 'link' => '/about/functions'],
          'image' => ['src' => $assetPath('AboutUs/f465fcbdab4004cd25dba4df06b9f8d5f2648620.jpg'), 'alt' => 'Background', 'className' => 'w-full h-auto lg:h-full object-cover rounded-2xl sm:rounded-3xl lg:rounded-4xl']
        ]),
        'created_at' => now(),
        'updated_at' => now(),
      ],
      // Vision & Mission
      [
        'page_id' => $aboutPage->id,
        'section_id' => $heroFigureSection->id,
        'section_key' => 'vision-and-mission',
        'order' => 3,
        'prop_name' => 'data',
        'custom_props' => json_encode(['layout' => 'text-right', 'sectionId' => 'vision-and-mission', 'bgColor' => 'bg-[#F5F5F5]']),
        'data' => json_encode([
          'section' => ['title' => 'Vision, Mission, Goal, Objectives and Core values'],
          'content' => [
            'html' => '<div class="space-y-6"><div><h2 class="font-700 text-xl sm:text-2xl mb-4 text-[#080C14]">Vision</h2><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">DUS dreams the existence of a society free from all sorts of exploitation where everyone irrespective of class, creed and cast will enjoy equal rights, freedom and justice leading an equitable and gender balanced communities.</p></div><div><h2 class="font-700 text-xl sm:text-2xl mb-4 text-[#080C14]">Mission</h2><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug mb-4">Coastal areas of Bangladesh are regularly stricken by natural disasters. Most of the people living here are almost poor. Due to regular natural disasters occurs here inhabitants are lacking asset and resources and they are deepened in illiterate, malnourished and culturally remain backward. DUS believes that optimizing utilization of hidden humane capacity & power and local resources intensively could gradually alleviate this condition. It perceives to bring down all this scope of development affords in an integrated manner so that sustainable livelihood ventures emerge in the community according to their aspiration.</p><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Initiating, activating, promoting and facilitating the sustainable development of the targeted population through capacity building, resource mobilization, networking, lobbying, need assessment, impact analysis, research, evaluation and policy advocacy in order to ensure and protected equal human rights, freedom, justice in all shape of individual, family and community life in all interventional areas.</p></div></div>'
          ],
          'btn' => ['text' => 'Learn More About Vision, Mission, Goal', 'link' => '/about/vision-mission'],
          'image' => ['src' => $assetPath('AboutUs/c9c3585f93806d98cf9e2fbeadccb32a66efb4b5.jpg'), 'alt' => 'Vision and Mission', 'className' => 'w-full h-auto lg:h-full object-cover rounded-2xl sm:rounded-3xl lg:rounded-4xl']
        ]),
        'created_at' => now(),
        'updated_at' => now(),
      ],
      // Interventional Approaches
      [
        'page_id' => $aboutPage->id,
        'section_id' => $heroFigureSection->id,
        'section_key' => 'interventional-approaches',
        'order' => 4,
        'prop_name' => 'data',
        'custom_props' => json_encode(['layout' => 'text-left', 'sectionId' => 'interventional-approaches']),
        'data' => json_encode([
          'section' => ['title' => 'Interventional Approaches and DUS Priorities'],
          'content' => [
            'html' => '<div class="space-y-6"><div><h2 class="font-700 text-xl sm:text-2xl mb-4 text-[#080C14]">Sustainable Poverty Reduction and Human Development:</h2><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug mb-4">The development interventional unit of GoB is each Household. DUS believes if the member of the HHs are developed then they can play an active role to bring immense changes within their families. As a whole each household take part into the process of socio-economic development of the country.</p><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">This Organization\'s aim to help its member\'s inherent abilities to flourish such a way so that they are endowed with the key to their progress to a sustainable livelihood restoration. With renewed confidence and hope, the poor, then, move ahead and break free from the shackles of multidimensional poverty and indignity and achieve living standards characterized by human freedom and dignity, along with material uplift.</p></div><div><h2 class="font-700 text-xl sm:text-2xl mb-4 text-[#080C14]">Focus on Landless poor</h2><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">DUS concentrates on the settlement of landless poor families who are victims of major riverbank erosion & affected by several natural disasters like tropical cyclone, salinity, tidal surge etc that are living below poverty line in the coastal district of Bangladesh.</p></div><div><h2 class="font-700 text-xl sm:text-2xl mb-4 text-[#080C14]">Empowerment of Women</h2><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Over 87% of our target population/beneficiaries are poor women. DUS believes if women are empowered towards right direction, they can play an active role to bring vital changes within their families as well as in the communities.</p></div></div>'
          ],
          'btn' => ['text' => 'Learn More About Interventional Approaches', 'link' => '/about/interventional-approaches'],
          'image' => ['src' => $assetPath('AboutUs/d3afc7e94d5609f2c2356758f463ee15af0450fe.jpg'), 'alt' => 'Interventional Approaches', 'className' => 'w-full h-auto lg:h-full object-cover rounded-2xl sm:rounded-3xl lg:rounded-4xl']
        ]),
        'created_at' => now(),
        'updated_at' => now(),
      ],
      // Legal
      [
        'page_id' => $aboutPage->id,
        'section_id' => $legalSection->id,
        'section_key' => 'legal',
        'order' => 5,
        'prop_name' => 'legalData',
        'data' => json_encode([
          'background' => ['src' => $assetPath('AboutUs/64065404ef679e54d2dabd90bba3b1744817c578.jpg'), 'alt' => 'Background'],
          'overlay' => ['darkOverlay' => 'bg-black/40'],
          'textBox' => [
            'title' => 'Legal Status and Org.',
            'titleLine2' => 'Affiliations',
            'buttonText' => 'Learn More Affiliations',
            'buttonLink' => '/about/legal-affiliations'
          ]
        ]),
        'created_at' => now(),
        'updated_at' => now(),
      ],
      // Evolutionary Changes
      [
        'page_id' => $aboutPage->id,
        'section_id' => $heroFigureSection->id,
        'section_key' => 'evolutionary-changes',
        'order' => 6,
        'prop_name' => 'data',
        'custom_props' => json_encode(['layout' => 'text-left', 'sectionId' => 'evolutionary-changes']),
        'data' => json_encode([
          'section' => ['title' => 'Evolutionary Changes and Footings'],
          'content' => [
            'html' => '<div class="space-y-6"><div><h2 class="font-700 text-xl sm:text-2xl mb-4 text-[#080C14]">Year 1972-1985</h2><ul class="list-disc pl-5 space-y-2 mb-4"><li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">DUS was formed by a group of young volunteers and started working for the victims of Bangladesh Liberation War of 1971 and devastating 1970 cyclone affected households at Hatiya Island focusing on humanitarian service to mankind</li><li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Relief and rehabilitation program for the victims and initiate disaster management program at local level</li><li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Rehabilitation of 2000 landless river bank eroded farmers in the newly accreted Govt. Khash land</li><li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">DUS turn into an organizational shape and named as Dwip Unnayan Sangstha in 1982</li><li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Community Mobilization and revolving credit support to community started in 1984</li><li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Registered with Ministry of Social Services &amp; Welfare.</li><li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Registered with NGO Affairs Bureau.</li><li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Socio-economic development programs for the poor initiative from 1985</li></ul></div><div><h2 class="font-700 text-xl sm:text-2xl mb-4 text-[#080C14]">Year 1986-2000</h2><ul class="list-disc pl-5 space-y-2"><li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Strengthening Local Govt. bodies through capacity building in good governance, accountancy and resource management supported by IVS/ USAID</li><li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Capacity building of Union Parishad and Upazila Parishad for effective disaster management in four coastal district of Bangladesh supported by CARE-Bangladesh &amp; USAID</li><li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Island fisheries development project implementation supported by DFID.</li><li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Disaster rehabilitation support project implementation supported by AusAid/Oxfam-America/Oxfam-UK, Oxfam-Hong Kong British ODA</li><li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Cyclone shelter Construction supported by CAA Australia</li><li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Housing support for poor supported by British ODA/CARE-Bangladesh/AusAid</li><li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Livestock development for poor supported by DANIDA, CIDA</li><li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Integrated Socio-economic development program supported by Oxfam-UK</li><li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Emergency Relief and Rehabilitation for Cyclone in coastal islands supported by Oxfam-UK, British ODA, CARE-Bangladesh</li><li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Livelihood Rehabilitation for Flood Affected Fisheries Households in Hatiya Island supported by DFID</li><li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Flood 98 Rehabilitation program supported by DFID, Oxfam-GB</li></ul></div></div>'
          ],
          'btn' => ['text' => 'Learn More About 2001 - 2020', 'link' => '/about/evolutionary-changes'],
          'image' => ['src' => $assetPath('AboutUs/962bd5ee9dacf1f4261d0592856f5716dcffb725.jpg'), 'alt' => 'Evolutionary Changes', 'className' => 'w-full h-auto lg:h-full object-cover rounded-2xl sm:rounded-3xl lg:rounded-4xl']
        ]),
        'created_at' => now(),
        'updated_at' => now(),
      ],
      // Governance
      [
        'page_id' => $aboutPage->id,
        'section_id' => $heroFigureSection->id,
        'section_key' => 'governance',
        'order' => 7,
        'prop_name' => 'data',
        'custom_props' => json_encode(['layout' => 'text-right', 'sectionId' => 'governance', 'bgColor' => 'bg-[#F5F5F5]']),
        'data' => json_encode([
          'section' => ['title' => 'Governance'],
          'content' => [
            'html' => '<div class="space-y-6"><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug mb-4">DUS believes in democratic practice and public-private participation to achieve its goal, purpose and objectives and accordingly the internal management system has been framed comprising the following structures:</p><div><h2 class="font-700 text-xl sm:text-2xl mb-4 text-[#080C14]">General Body</h2><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">The General Body consists of 31 members who are the permanent resident of the coastal community. Of them 30% are women. The social and professional status of the members include teachers, lawyers, social workers, freedom fighters and community leaders.</p></div><div><h2 class="font-700 text-xl sm:text-2xl mb-4 text-[#080C14]">Executive Committee</h2><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">DUS has an Executive Committee of 7 members duly elected by the General Body for a period of three years. DUS is represented by its Executive Director who is the Member Secretary of the Executive Committee. ED and his core staff members are appointed by the board. Executive Director is treated as the Chief Executive of the organization. The Executive Director is the overall authority to implement the projects and programs on behalf of the Executive Committee.</p></div></div>'
          ],
          'btn' => ['text' => 'Learn More About Governance', 'link' => '/about/governance'],
          'image' => ['src' => $assetPath('AboutUs/ce88efc81f8b1fe8d4f757eba85f05717acb68e4.jpg'), 'alt' => 'Governance', 'className' => 'w-full h-auto lg:h-full object-cover rounded-2xl sm:rounded-3xl lg:rounded-4xl']
        ]),
        'created_at' => now(),
        'updated_at' => now(),
      ],
      // Cards
      [
        'page_id' => $aboutPage->id,
        'section_id' => $cardsSection->id,
        'section_key' => 'cards',
        'order' => 8,
        'prop_name' => 'cardsData',
        'data' => json_encode([
          'section' => ['title' => 'Cards Section'],
          'cards' => [
            [
              'id' => 'operational-areas',
              'image' => ['src' => $assetPath('AboutUs/image.png'), 'alt' => 'Operational Areas', 'className' => 'mx-auto object-contain'],
              'title' => 'Operational Areas',
              'buttonText' => 'Explore Our Areas of Operation',
              'buttonLink' => '/about/operational-areas',
              'bgColor' => 'bg-[#F5F5F5]',
              'cardBgColor' => 'bg-white'
            ],
            [
              'id' => 'achievements',
              'image' => ['src' => $assetPath('AboutUs/fcbbf1e10ca75bccf6a608e1de01306d56897811.png'), 'alt' => 'Our Achievements', 'className' => 'mx-auto object-contain'],
              'title' => 'Our Achievements',
              'buttonText' => 'Explore Our Evolution',
              'buttonLink' => '/about/achievements',
              'bgColor' => 'bg-[#F5F5F5]',
              'cardBgColor' => 'bg-white'
            ]
          ]
        ]),
        'created_at' => now(),
        'updated_at' => now(),
      ],
      // Programs Activities
      [
        'page_id' => $aboutPage->id,
        'section_id' => $heroFigureSection->id,
        'section_key' => 'programs-activities',
        'order' => 9,
        'prop_name' => 'data',
        'custom_props' => json_encode(['layout' => 'text-right', 'sectionId' => 'programs-activities', 'bgColor' => 'bg-[#F5F5F5]']),
        'data' => json_encode([
          'section' => ['title' => 'Programs/Activities'],
          'content' => [
            'html' => '<div class="space-y-6"><div><h2 class="font-700 text-xl sm:text-2xl mb-4 text-[#080C14]">Micro-Finance Program</h2><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug mb-4">Micro finance Program is the core program of all DUS activities. DUS has been implementing its major program in partnership with Palli Karma Sahayak Foundation (PKSF) since 2000. It provides collateral free micro-credit to its around 40K+ group members where 97 percent are female. Under this program, DUS has savings scheme for poor women who has no access in mainstream banks due to lack of capital and assets.</p><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Most of the targeted beneficiaries of DUS are poor women, marginal farmers and small micro entrepreneurs. Major borrowers are women who used these loan funds to promote various income generating activities for their earnings and employments. As a result, micro finance program has positive impact on poverty reduction especially at grass rote level, income enhancement, consumption, the promotion of rural businesses, education and health and finally the empowerment of women and their employment in rural island communities.</p></div><div><h2 class="font-700 text-xl sm:text-2xl mb-4 text-[#080C14]">Jagoron</h2><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug mb-4">Jagoron is the name of a credit instrument of PKSF to initiate household based enterprise development in Bangladesh. As a Partner Organization of PKSF, DUS is implementing this program which is now comprised with Rural Micro finance and Urban Micro finance. Rural Micro finance is that types of loan which allows rural women to finance their small scale agriculture production at homestead level.</p><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">RMC Loans are allowed as working capital loans to promote poor and disadvantaged households in income earnings. RMC loan range from 10K to 59K to allowed for one year and service charge is 24% (Reducing Balancing Method)/12.0% (Flat Rate Method) per year. The weekly savings of RMC members are 10/= per week.</p></div></div>'
          ],
          'btn' => ['text' => 'Learn More About Programs', 'link' => '/about/programs-activities'],
          'image' => ['src' => $assetPath('AboutUs/8235fc0d0e2c3082be7cb9ba5d6f5502a121d0ff.jpg'), 'alt' => 'Programs', 'className' => 'w-full h-auto lg:h-full object-cover rounded-2xl sm:rounded-3xl lg:rounded-4xl']
        ]),
        'created_at' => now(),
        'updated_at' => now(),
      ],
      // Training
      [
        'page_id' => $aboutPage->id,
        'section_id' => $heroFigureSection->id,
        'section_key' => 'training',
        'order' => 10,
        'prop_name' => 'data',
        'custom_props' => json_encode(['layout' => 'text-left', 'sectionId' => 'training']),
        'data' => json_encode([
          'section' => ['title' => 'Training and Other Facilities'],
          'content' => [
            'html' => '<div class="space-y-6"><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug mb-4">DUS believes that training is a key element of the development approach which focuses on people and their participation. Training has been introduced as an essential element of DUS\'s intervention strategy.</p><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug mb-4">DUS takes up need based training programs, prepares module and training curriculum. The training programs generally involve flip chart, posters, handouts, cards &amp; charts, audiocassettes, videocassettes, original model, curriculum, modules, photographs etc. DUS has already developed a training and communication Unit fully equipped with all possible physical and human resources. DUS is organized different type of training since last two decades:</p><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug mb-4">DUS is organized different type of training for its staffs as well as beneficiaries. DUS always prepare its yearly training plan which is incorporated basic skill development training for staffs, MIS, ToT general, Branch management and Finance management etc.</p><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug mb-4">DUS conducts it\'s skill development training through identification of people who need skill training. This is done by conducting survey to identify marketable skills, developing modules of livelihood skills program, conducting training to the selected people, select graduates of the skill program to receive capital, linking other graduates to employment or credit program, following up the graduates to see whether they are able to achieve sustainable livelihood. The skills training programs include tree nursery management, sustainable agriculture, poultry and cattle rearing etc.</p><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Leadership development training is a very important intervention of DUS. Leadership development training is intended for the group members under different project interventions. The training programs focus financial management of community fund, conflict management, and bottom-up planning for sustainable rural livelihoods.</p></div>'
          ],
          'btn' => ['text' => 'Learn More About DUS Facilities', 'link' => '/about/facilities'],
          'image' => ['src' => 'https://placehold.co/730x730', 'alt' => 'Training Facilities', 'className' => 'w-full h-auto lg:h-full object-cover rounded-2xl sm:rounded-3xl lg:rounded-4xl']
        ]),
        'created_at' => now(),
        'updated_at' => now(),
      ],
      // FAQ
      [
        'page_id' => $aboutPage->id,
        'section_id' => $faqSection->id,
        'section_key' => 'faq',
        'order' => 11,
        'prop_name' => 'faqData',
        'data' => json_encode([
          'section' => [
            'title' => 'Key Questions Answered About Our Us',
            'subtitle' => 'Explore our Frequently Asked Questions for answers about our charity\'s mission, projects, and how to help.'
          ],
          'faqs' => [
            ['id' => 1, 'question' => 'What is the mission of your charity?', 'answer' => 'Our mission is to help communities through sustainable development...'],
            ['id' => 2, 'question' => 'Who benefits from your programs?', 'answer' => 'Our programs benefit underprivileged communities, women and children...'],
            ['id' => 3, 'question' => 'Can I make a recurring donation?', 'answer' => 'Yes, you can make recurring donations monthly, quarterly, or annually.'],
            ['id' => 4, 'question' => 'Can I visit the projects I support?', 'answer' => 'Yes, we welcome donors to visit our project sites.'],
            ['id' => 5, 'question' => 'How can I get involved?', 'answer' => 'You can get involved by donating, volunteering, or sponsoring a child.'],
            ['id' => 6, 'question' => 'How can I make a donation?', 'answer' => 'You can make a donation online through our secure payment portal.'],
            ['id' => 7, 'question' => 'How do you maintain accountability?', 'answer' => 'We maintain transparency through regular audits and annual reports.'],
            ['id' => 8, 'question' => 'Are donations tax-deductible?', 'answer' => 'Yes, donations to DUS are tax-deductible under applicable tax laws.']
          ]
        ]),
        'created_at' => now(),
        'updated_at' => now(),
      ],
    ];

    $this->insertPageSections($aboutSections);
    $this->command->info('About page sections seeded successfully!');

    // ============================================
    // CONTACT PAGE SECTIONS
    // ============================================

    $contactSections = [
      // Banner
      [
        'page_id' => $contactPage->id,
        'section_id' => $pageBannerSection->id,
        'section_key' => 'banner',
        'order' => 1,
        'prop_name' => 'bannerData',
        'custom_props' => json_encode(['sectionId' => 'contact-us-banner']),
        'data' => json_encode([
          'background' => ['src' => $assetPath('OurPrograms/db1b2b6eae5fc260b4204f8257dadbd5a7aa0af7.png'), 'alt' => 'Background'],
          'overlay' => ['darkOverlay' => 'bg-black/40 lg:bg-black/50', 'gradient' => 'bg-gradient-to-r from-black/85 via-black/10 to-transparent'],
          'content' => [
            'title' => ['text' => "Let's Get in Touch", 'className' => 'font-bold leading-tight'],
            'description' => ['text' => 'Reach out today and let\'s create meaningful, lasting positive change together worldwide', 'className' => 'font-normal leading-tight']
          ]
        ]),
        'created_at' => now(),
        'updated_at' => now(),
      ],
      // Contact Offices
      [
        'page_id' => $contactPage->id,
        'section_id' => $contactOfficeSection->id,
        'section_key' => 'contact-offices',
        'order' => 2,
        'prop_name' => 'offices',
        'data' => json_encode([
          [
            'title' => 'Head Office',
            'address' => '24/5 Mollika, Prominent Housing, 3 Pisciculture Road, Mohammadpur, Dhaka -1207.',
            'phones' => ['+880 1761-493412', '+880 1781 732352'],
            'emails' => ['dusdhaka@gmail.com', 'dus.eddus@gmail.com']
          ],
          [
            'title' => 'Regional Office',
            'address' => 'Delower Commission Road, Sonapur, Sadar, Noakhali',
            'phones' => ['+880 1761-493411', '+880 1761-493414'],
            'emails' => ['dusreg@gmail.com']
          ],
          [
            'title' => 'Foundation Office',
            'address' => 'DUS Centre, Sayedia Bazar, Hatiya, Noakhali',
            'phones' => ['+880 1761-493418', '+880 1673-011347'],
            'emails' => ['dusreg@gmail.com']
          ]
        ]),
        'created_at' => now(),
        'updated_at' => now(),
      ],
      // Contact Reach
      [
        'page_id' => $contactPage->id,
        'section_id' => $contactReachSection->id,
        'section_key' => 'contact-reach',
        'order' => 3,
        'prop_name' => 'image',
        'data' => json_encode($assetPath('ContactUs/8235fc0d0e2c3082be7cb9ba5d6f5502a121d0ff.jpg')),
        'created_at' => now(),
        'updated_at' => now(),
      ],
      // Follow Us
      [
        'page_id' => $contactPage->id,
        'section_id' => $followUsSection->id,
        'section_key' => 'follow-us',
        'order' => 4,
        'prop_name' => 'socialItems',
        'data' => json_encode([
          ['icon' => 'facebook', 'label' => 'Facebook', 'url' => '#'],
          ['icon' => 'instagram', 'label' => 'Instagram', 'url' => '#'],
          ['icon' => 'linkedin', 'label' => 'LinkedIn', 'url' => '#'],
          ['icon' => 'youtube', 'label' => 'YouTube', 'url' => '#'],
          ['icon' => 'twitter', 'label' => 'X', 'url' => '#']
        ]),
        'created_at' => now(),
        'updated_at' => now(),
      ],
      // Address
      [
        'page_id' => $contactPage->id,
        'section_id' => $addressSection->id,
        'section_key' => 'address',
        'order' => 5,
        'prop_name' => 'officesLocation',
        'data' => json_encode([
          [
            'id' => 'head-office',
            'label' => 'Head Office',
            'address' => '24/5 Mollika, Prominent Housing, 3 Pisciculture Road, Mohammadpur, Dhaka -1207.',
            'mapUrl' => 'https://www.google.com/maps?q=23.7570,90.3620&output=embed',
            'coordinates' => ['lat' => 23.7570, 'lng' => 90.3620]
          ],
          [
            'id' => 'regional-office',
            'label' => 'Regional Office',
            'address' => 'Delower Commission Road, Sonapur, Sadar, Noakhali',
            'mapUrl' => 'https://www.google.com/maps?q=22.8256,91.1039&output=embed',
            'coordinates' => ['lat' => 22.8256, 'lng' => 91.1039]
          ],
          [
            'id' => 'foundation-office',
            'label' => 'Foundation Office',
            'address' => 'DUS Centre, Sayedia Bazar, Hatiya, Noakhali',
            'mapUrl' => 'https://www.google.com/maps?q=22.4082,91.0909&output=embed',
            'coordinates' => ['lat' => 22.4082, 'lng' => 91.0909]
          ]
        ]),
        'created_at' => now(),
        'updated_at' => now(),
      ],
      // FAQ
      [
        'page_id' => $contactPage->id,
        'section_id' => $faqSection->id,
        'section_key' => 'faq',
        'order' => 6,
        'prop_name' => 'faqData',
        'custom_props' => json_encode(['bgColor' => 'bg-white']),
        'data' => json_encode([
          'section' => [
            'title' => 'Key Questions Answered',
            'subtitle' => 'Find answers to common questions about our organization'
          ],
          'faqs' => [
            ['id' => 1, 'question' => 'What is your mission?', 'answer' => 'Our mission is to help communities...'],
            ['id' => 2, 'question' => 'How can I contact you?', 'answer' => 'You can contact us via email or phone...'],
            // Add more FAQs
          ]
        ]),
        'created_at' => now(),
        'updated_at' => now(),
      ],
      // Stories
      [
        'page_id' => $contactPage->id,
        'section_id' => $storiesSection->id,
        'section_key' => 'stories',
        'order' => 7,
        'prop_name' => 'storiesData',
        'data' => json_encode([
          'section' => [
            'title' => 'Insights, Stories & Impact',
            'description' => 'Read real stories from the field...'
          ],
          'stories' => [
            ['id' => 1, 'image' => $assetPath('Stories/8107b01ed92d05bd5a6861d1ca3a78ccbffc6289.webp'), 'date' => 'June 6, 2023', 'title' => 'Invest in Kindness', 'description' => 'Lorem Ipsum...', 'link' => '/stories/invest-in-kindness']
          ]
        ]),
        'created_at' => now(),
        'updated_at' => now(),
      ],
      // Upcoming Events
      [
        'page_id' => $contactPage->id,
        'section_id' => $upcomingEventsSection->id,
        'section_key' => 'upcoming-events',
        'order' => 8,
        'prop_name' => 'eventsData',
        'data' => json_encode([
          'section' => [
            'title' => 'Upcoming Events',
            'description' => 'Join us at our upcoming events',
            'button' => ['text' => 'View All Events', 'link' => '/events']
          ],
          'image' => ['src' => $assetPath('UpcomingEvent/8107b01ed92d05bd5a6861d1ca3a78ccbffc6289.webp'), 'alt' => 'Events'],
          'events' => []
        ]),
        'created_at' => now(),
        'updated_at' => now(),
      ],
    ];

    $this->insertPageSections($contactSections);
    $this->command->info('Contact page sections seeded successfully!');

    // ============================================
    // BLOGS PAGE SECTIONS
    // ============================================

    $blogsSections = [
      // Banner
      [
        'page_id' => $blogsPage->id,
        'section_id' => $pageBannerSection->id,
        'section_key' => 'banner',
        'order' => 1,
        'prop_name' => 'bannerData',
        'custom_props' => json_encode(['sectionId' => 'blogs-banner']),
        'data' => json_encode([
          'background' => ['src' => $assetPath('OurPrograms/db1b2b6eae5fc260b4204f8257dadbd5a7aa0af7.png'), 'alt' => 'Background'],
          'overlay' => ['darkOverlay' => 'bg-black/40 lg:bg-black/50', 'gradient' => 'bg-gradient-to-r from-black/85 via-black/10 to-transparent'],
          'content' => ['title' => ['text' => 'Blog', 'className' => 'font-bold leading-tight']]
        ]),
        'created_at' => now(),
        'updated_at' => now(),
      ],
      // Blog Section (Multi-prop - no prop_name)
      [
        'page_id' => $blogsPage->id,
        'section_id' => $blogSection->id,
        'section_key' => 'blog-section',
        'order' => 2,
        'prop_name' => null,
        'data' => json_encode([
          'mainBlog' => [
            'id' => 1,
            'date' => 'June 6, 2023',
            'title' => 'Invest in Kindness, Reap a Better Future',
            'description' => 'Micro finance Program is the core program...',
            'image' => 'https://placehold.co/750x450',
            'slug' => 'invest-in-kindness-reap-a-better-future',
            'tags' => ['Kindness', 'Future', 'Investment'],
            'createdBy' => 'Admin',
            'timerRead' => '5 min read'
          ],
          'blogPosts' => [
            ['id' => 2, 'date' => 'June 5, 2023', 'title' => 'How Technology is Changing Education', 'description' => 'Lorem Ipsum...', 'image' => 'https://placehold.co/420x250', 'slug' => 'how-technology-is-changing-education', 'tags' => ['Technology'], 'createdBy' => 'Admin', 'timerRead' => '4 min read'],
            ['id' => 3, 'date' => 'June 4, 2023', 'title' => 'Sustainable Living: Small Changes, Big Impact', 'description' => 'Lorem Ipsum...', 'image' => 'https://placehold.co/420x250', 'slug' => 'sustainable-living', 'tags' => ['Sustainability'], 'createdBy' => 'Admin', 'timerRead' => '6 min read'],
            ['id' => 4, 'date' => 'June 3, 2023', 'title' => 'The Future of Remote Work', 'description' => 'Lorem Ipsum...', 'image' => 'https://placehold.co/420x250', 'slug' => 'future-of-remote-work', 'tags' => ['Work'], 'createdBy' => 'Admin', 'timerRead' => '5 min read']
          ]
        ]),
        'created_at' => now(),
        'updated_at' => now(),
      ],
      // FAQ
      [
        'page_id' => $blogsPage->id,
        'section_id' => $faqSection->id,
        'section_key' => 'faq',
        'order' => 3,
        'prop_name' => 'faqData',
        'data' => json_encode([
          'section' => ['title' => 'Frequently Asked Questions', 'subtitle' => 'Find answers to common questions'],
          'faqs' => [
            ['id' => 1, 'question' => 'What is your mission?', 'answer' => 'Our mission is to help communities...']
          ]
        ]),
        'created_at' => now(),
        'updated_at' => now(),
      ],
    ];

    $this->insertPageSections($blogsSections);
    $this->command->info('Blogs page sections seeded successfully!');

    // ============================================
    // PROJECTS & PROGRAMS PAGE SECTIONS
    // ============================================

    $projectsSections = [
      // Banner
      [
        'page_id' => $projectsPage->id,
        'section_id' => $pageBannerSection->id,
        'section_key' => 'banner',
        'order' => 1,
        'prop_name' => 'bannerData',
        'custom_props' => json_encode(['sectionId' => 'projects-programs-banner']),
        'data' => json_encode([
          'background' => ['src' => 'https://placehold.co/1920x589', 'alt' => 'Background'],
          'overlay' => ['darkOverlay' => 'bg-black/40 lg:bg-black/50', 'gradient' => 'bg-gradient-to-r from-black/85 via-black/10 to-transparent'],
          'content' => ['title' => ['text' => 'Meet Our Charity Projects', 'className' => 'font-bold leading-tight']]
        ]),
        'created_at' => now(),
        'updated_at' => now(),
      ],
      // Our Programs
      [
        'page_id' => $projectsPage->id,
        'section_id' => $ourProgramsSection->id,
        'section_key' => 'our-programs',
        'order' => 2,
        'prop_name' => 'programsData',
        'data' => json_encode([
          'programs' => [
            [
              'id' => 1,
              'title' => 'Micro-Finance <br /> Program',
              'description' => '<div class="space-y-4"><p>Micro finance Program is the core program...</p><div class="bg-white/50 rounded-lg p-4"><h4>Key Achievements:</h4><ul><li>40,000+ active group members</li><li>97% female beneficiaries</li></ul></div></div>',
              'image' => $assetPath('OurPrograms/945e2496664a40b12a1cddd6561e954cdc78e255.webp'),
              'bgColor' => 'bg-[#E6F3E7]',
              'link' => '/projects-programs/micro-finance'
            ]
          ]
        ]),
        'created_at' => now(),
        'updated_at' => now(),
      ],
      // FAQ
      [
        'page_id' => $projectsPage->id,
        'section_id' => $faqSection->id,
        'section_key' => 'faq',
        'order' => 3,
        'prop_name' => 'faqData',
        'data' => json_encode([
          'section' => ['title' => 'Frequently Asked Questions', 'subtitle' => 'Learn more about our programs'],
          'faqs' => [
            ['id' => 1, 'question' => 'How can I participate?', 'answer' => 'You can participate by volunteering or donating...'],
            ['id' => 2, 'question' => 'Who is eligible?', 'answer' => 'Our programs serve underprivileged communities...']
          ]
        ]),
        'created_at' => now(),
        'updated_at' => now(),
      ],
    ];

    $this->insertPageSections($projectsSections);
    $this->command->info('Projects & Programs page sections seeded successfully!');

    $this->command->info('All page sections seeded successfully! 🎉');
  }
}
