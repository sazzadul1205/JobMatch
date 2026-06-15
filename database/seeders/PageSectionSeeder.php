<?php
// database/seeders/PageSectionSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PageSectionSeeder extends Seeder
{
  /**
   * Insert page section rows with a consistent column set.
   */
  private function insertPageSections(array $rows): void
  {
    $normalizedRows = array_map(function (array $row) {
      return array_merge([
        'custom_props' => null,
        'prop_name' => null,
      ], $row);
    }, $rows);

    DB::table('page_sections')->insert($normalizedRows);
  }

  private function assetPath(string $path): string
  {
    return '/storage/' . ltrim($path, '/');
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
    $sections = DB::table('sections')->get()->keyBy('component');

    $homeBannerSection = $sections['HomeBanner'] ?? null;
    $pageBannerSection = $sections['PageBannerSection'] ?? null;
    $aboutUsSection = $sections['AboutUsSection'] ?? null;
    $ourActionSection = $sections['OurActionSection'] ?? null;
    $whereWeWorkSection = $sections['WhereWeWorkSection'] ?? null;
    $ourProgramsSection = $sections['OurProgramsSection'] ?? null;
    $storiesSection = $sections['StoriesSection'] ?? null;
    $upcomingEventsSection = $sections['UpcomingEventsSection'] ?? null;
    $jobsSection = $sections['JobsSection'] ?? null;
    $programImpactSection = $sections['ProgramImpactSection'] ?? null;
    $heroFigureSection = $sections['HeroFigureSection'] ?? null;
    $legalSection = $sections['LegalSection'] ?? null;
    $cardsSection = $sections['CardsSection'] ?? null;
    $faqSection = $sections['FAQSection'] ?? null;
    $followUsSection = $sections['FollowUSSection'] ?? null;
    $contactOfficeSection = $sections['ContactOfficeSection'] ?? null;
    $contactReachSection = $sections['ContactReachSection'] ?? null;
    $addressSection = $sections['AddressSection'] ?? null;
    $blogSection = $sections['BlogSection'] ?? null;

    $asset = [$this, 'assetPath'];

    // ============================================
    // HOME PAGE SECTIONS
    // ============================================

    $homeSections = [
      // Banner
      [
        'page_id' => $homePage->id,
        'section_id' => $homeBannerSection->id ?? null,
        'section_key' => 'banner',
        'order' => 1,
        'is_special_component' => true,
        'prop_name' => 'bannerData',
        'data' => json_encode([
          'background' => [
            'src' => $asset('Banner/64065404ef679e54d2dabd90bba3b1744817c578.webp'),
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
        'section_id' => $aboutUsSection->id ?? null,
        'section_key' => 'about-us',
        'order' => 2,
        'is_special_component' => true,
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
              ['id' => 1, 'icon' => $asset('AboutUs/65af8a95ec6612fa3ef2941b_011-charity-1%201.svg'), 'title' => 'Education for All', 'description' => 'Charity is dedicated to ensuring that every child has access to quality education.', 'alt' => 'Education Icon'],
              ['id' => 2, 'icon' => $asset('AboutUs/65af8a95c570e47bd1123b4e_033-hospital%201.svg'), 'title' => 'Health and Wellness', 'description' => 'Our commitment to health and wellness extends across borders.', 'alt' => 'Health Icon'],
              ['id' => 3, 'icon' => $asset('AboutUs/65af8a95cee257c23ab03ff8_040-shelter%201.svg'), 'title' => 'Disaster Relief', 'description' => 'In times of crisis, Charity responds swiftly to provide emergency relief.', 'alt' => 'Disaster Relief Icon'],
              ['id' => 4, 'icon' => $asset('AboutUs/65af8a958d27ad8d830434f4_022-family-1%201.svg'), 'title' => 'Community Development', 'description' => 'Charity invests in sustainable community development projects to create.', 'alt' => 'Community Development Icon']
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
          'image' => ['src' => $asset('AboutUs/8235fc0d0e2c3082be7cb9ba5d6f5502a121d0ff.webp'), 'alt' => 'About Us Image']
        ]),
        'created_at' => now(),
        'updated_at' => now(),
      ],
      // Our Action
      [
        'page_id' => $homePage->id,
        'section_id' => $ourActionSection->id ?? null,
        'section_key' => 'our-action',
        'order' => 3,
        'is_special_component' => true,
        'prop_name' => 'ourActionData',
        'data' => json_encode([
          'section' => [
            'title' => 'Our Actions for Social Change',
            'description' => 'We turn compassion into action by implementing community-led programs, advocating for social justice, and promoting education, health and equality'
          ],
          'actions' => [
            ['id' => 1, 'icon' => $asset('OurActions/fi_1940611.svg'), 'title' => 'Education', 'description' => 'We empower communities by investing in sustainable projects, training livelihood programs.', 'alt' => 'Education Icon'],
            ['id' => 2, 'icon' => $asset('OurActions/fi_14888982.svg'), 'title' => 'Microfinance', 'description' => 'We empower communities by investing in sustainable projects, training livelihood programs.', 'alt' => 'Microfinance Icon'],
            ['id' => 3, 'icon' => $asset('OurActions/fi_3004451.svg'), 'title' => 'Health', 'description' => 'Providing nutritious meals and groceries to individuals and families in need.', 'alt' => 'Health Icon'],
            ['id' => 4, 'icon' => $asset('OurActions/fi_17316107.svg'), 'title' => 'Organizational Development', 'description' => 'We empower underprivileged children with the opportunity to learn, grow, and succeed.', 'alt' => 'Organizational Development Icon'],
            ['id' => 5, 'icon' => $asset('OurActions/fi_6786176.svg'), 'title' => 'Climate Change', 'description' => 'From free medical camps to life-saving treatments, we support initiatives that provide critical aid to access to proper.', 'alt' => 'Climate Change Icon'],
            ['id' => 6, 'icon' => $asset('OurActions/fi_1176562.svg'), 'title' => 'Human Rights', 'description' => 'From free medical camps to life-saving treatments, we support initiatives that provide critical aid to access to proper.', 'alt' => 'Human Rights Icon'],
            ['id' => 7, 'icon' => $asset('OurActions/fi_8992468.svg'), 'title' => 'Human Resource', 'description' => 'Bringing clean and safe drinking water to communities, improving sanitation, and preventing waterborne diseases.', 'alt' => 'Human Resource Icon'],
            ['id' => 8, 'icon' => $asset('OurActions/fi_726211.svg'), 'title' => 'Social Enterprises', 'description' => 'We empower communities by investing in sustainable projects, training livelihood programs.', 'alt' => 'Social Enterprises Icon'],
            ['id' => 9, 'icon' => $asset('OurActions/fi_4994126.svg'), 'title' => 'Agriculture Food Security', 'description' => 'Bringing clean and safe drinking water to communities, improving sanitation, and preventing waterborne diseases.', 'alt' => 'Agriculture Food Security Icon']
          ]
        ]),
        'created_at' => now(),
        'updated_at' => now(),
      ],
      // Where We Work
      [
        'page_id' => $homePage->id,
        'section_id' => $whereWeWorkSection->id ?? null,
        'section_key' => 'where-we-work',
        'order' => 4,
        'is_special_component' => true,
        'prop_name' => 'whereWeWorkData',
        'data' => json_encode([
          'section' => ['title' => 'Where We Work'],
          'stats' => [
            ['id' => 1, 'icon' => $asset('WhereWeWork/image%206-3.png'), 'value' => '450K', 'label' => 'Total Member Reach', 'alt' => 'Member Reach Icon'],
            ['id' => 2, 'icon' => $asset('WhereWeWork/image%206-2.png'), 'value' => '41,382', 'label' => 'Mail Engaged in Divers Livelihoods Options', 'alt' => 'Member Reach Icon'],
            ['id' => 3, 'icon' => $asset('WhereWeWork/image%206-1.png'), 'value' => '35,193', 'label' => 'Women Engaged in Diverse Livelihoods Options', 'alt' => 'Member Reach Icon'],
            ['id' => 4, 'icon' => $asset('WhereWeWork/image%206.png'), 'value' => '35,193', 'label' => 'Women Engaged in Diverse Livelihoods Options', 'alt' => 'Mail Engaged Icon'],
            ['id' => 5, 'icon' => $asset('WhereWeWork/image%206-1.png'), 'value' => '38.0 M', 'label' => 'Digital media Outreach', 'alt' => 'Women Engaged Icon'],
            ['id' => 6, 'icon' => $asset('WhereWeWork/image%206.png'), 'value' => '35,193', 'label' => 'Women Engagement in Diverse Livelihood Options', 'alt' => 'Mail Engaged Icon']
          ],
          'image' => ['src' => $asset('WhereWeWork/image.png'), 'alt' => 'Map Place holder Text', 'className' => 'w-full h-232.5 object-cover rounded-4xl']
        ]),
        'created_at' => now(),
        'updated_at' => now(),
      ],
      // Our Programs
      [
        'page_id' => $homePage->id,
        'section_id' => $ourProgramsSection->id ?? null,
        'section_key' => 'our-programs',
        'order' => 5,
        'is_special_component' => true,
        'prop_name' => 'ourProgramsData',
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
              'image' => $asset('OurPrograms/945e2496664a40b12a1cddd6561e954cdc78e255.webp'),
              'bgColor' => 'bg-[#E6F3E7]',
              'link' => '/projects-programs/micro-finance'
            ],
            [
              'id' => 2,
              'title' => 'Climate Change and <br /> Disaster Management',
              'description' => '<div class="space-y-3"><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#524B48] leading-relaxed">DUS operates in highly disaster-prone coastal areas of Bangladesh, working with communities to build <strong class="text-[#009BE2]">resilience against natural disasters</strong> like cyclones, floods, and storm surges.</p><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#524B48] leading-relaxed">Moving beyond relief, we focus on institutionalized preparedness, risk reduction, early warning systems, and long-term climate adaptation strategies for vulnerable coastal communities.</p></div>',
              'image' => $asset('OurPrograms/a03fa6dba9fcdac0a5aedf2d337b118228a03298.webp'),
              'bgColor' => 'bg-[#F3EDE6]',
              'link' => '/projects-programs/climate-change'
            ],
            [
              'id' => 3,
              'title' => 'Community Radio',
              'description' => '<div class="space-y-3"><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#524B48] leading-relaxed">Empowering Hatiya Island communities by giving them a <strong class="text-[#009BE2]">voice for change</strong> through community radio. Bangladesh is the 2nd country in South Asia with a Community Radio Policy.</p><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#524B48] leading-relaxed">The radio broadcasts agricultural information, health awareness, local news, women empowerment programs, and cultural content, reaching thousands of listeners daily.</p></div>',
              'image' => $asset('OurPrograms/e280b627b1771904c38022aac2566b932e248887.webp'),
              'bgColor' => 'bg-[#E8E6F3]',
              'link' => '/projects-programs/community-radio'
            ],
            [
              'id' => 4,
              'title' => 'Research and <br /> Documentation',
              'description' => '<div class="space-y-3"><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#524B48] leading-relaxed">DUS has a strong <strong class="text-[#009BE2]">Research and Documentation Cell</strong> conducting quality research in education, health, livelihood, environment, human rights, and social justice.</p><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#524B48] leading-relaxed">The cell engages in surveys, impact assessments, and documentation of best practices, helping shape effective development interventions and policy advocacy.</p></div>',
              'image' => $asset('OurPrograms/a496922a3fc00992b6c454822d60bde51dc001e5.webp'),
              'bgColor' => 'bg-[#F3E6EA]',
              'link' => '/projects-programs/research-documentation'
            ],
            [
              'id' => 5,
              'title' => 'WATSAN <br /> Program',
              'description' => '<div class="space-y-3"><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#524B48] leading-relaxed">Providing sustainable <strong class="text-[#009BE2]">water and sanitation services</strong> to rural communities with support from the Netherland Government, implemented in Nangolia Char and Nalerchar under Hatiya Upazilla.</p><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#524B48] leading-relaxed">Target: 4,605 households with sanitation, 250 deep tube wells for safe water, and hygiene education for 20,000 people.</p></div>',
              'image' => $asset('OurPrograms/be14c45848898048e7b7832affc4dc713b032e10.webp'),
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
        'section_id' => $storiesSection->id ?? null,
        'section_key' => 'stories',
        'order' => 6,
        'is_special_component' => true,
        'prop_name' => 'storiesData',
        'data' => json_encode([
          'section' => [
            'title' => 'Insights, Stories & Impact',
            'description' => 'Read real stories from the field, community experiences, and thought-provoking perspectives that reflect our mission and impact.'
          ],
          'stories' => [
            ['id' => 1, 'image' => $asset('Stories/8107b01ed92d05bd5a6861d1ca3a78ccbffc6289.webp'), 'date' => 'June 6, 2023', 'title' => 'Invest in Kindness, Reap a Better Future', 'description' => 'Lorem Ipsum is simply dummy text of the printing and typesetting industry...', 'link' => '/stories/invest-in-kindness'],
            ['id' => 2, 'image' => $asset('Stories/b3d758bf8cd7985c857cdbe55b5101b105ee9f75.webp'), 'date' => 'June 6, 2023', 'title' => 'How to Design a Custom Pool That Perfectly Fits Your Charlotte Backyard', 'description' => 'Lorem Ipsum is simply dummy text of the printing and typesetting industry...', 'link' => '/stories/custom-pool-design'],
            ['id' => 3, 'image' => $asset('Stories/8235fc0d0e2c3082be7cb9ba5d6f5502a121d0ff%20(1).webp'), 'date' => 'June 6, 2023', 'title' => 'The Benefits of Mindfulness in Daily Life', 'description' => 'Lorem Ipsum is simply dummy text of the printing and typesetting industry...', 'link' => '/stories/mindfulness-benefits'],
            ['id' => 4, 'image' => $asset('Stories/3fe55eb9ebcfd7efb80f559a00b8b5a1da0e8c3e.webp'), 'date' => 'July 15, 2023', 'title' => 'Empowering Women Through Microfinance', 'description' => 'Discover how small loans are making a big difference...', 'link' => '/stories/empowering-women'],
            ['id' => 5, 'image' => $asset('Stories/de90e922c05aa3585b8f65361c306413c3b3d7be.webp'), 'date' => 'August 2, 2023', 'title' => 'Building Resilient Communities Against Climate Change', 'description' => 'Learn about our initiatives to help coastal communities...', 'link' => '/stories/climate-resilience'],
            ['id' => 6, 'image' => $asset('Stories/f465fcbdab4004cd25dba4df06b9f8d5f2648620.webp'), 'date' => 'September 10, 2023', 'title' => 'Providing Clean Water to Remote Villages', 'description' => 'Access to clean water is a basic human right...', 'link' => '/stories/clean-water']
          ]
        ]),
        'created_at' => now(),
        'updated_at' => now(),
      ],
      // Upcoming Events
      [
        'page_id' => $homePage->id,
        'section_id' => $upcomingEventsSection->id ?? null,
        'section_key' => 'upcoming-events',
        'order' => 7,
        'is_special_component' => true,
        'prop_name' => 'upcomingEventsData',
        'data' => json_encode([
          'section' => [
            'title' => 'Upcoming Events & Community Actions',
            'description' => 'Read real stories from the field, community experiences, and thought-provoking perspectives that reflect our mission and impact.',
            'button' => ['text' => 'Explore All Events', 'link' => '/events']
          ],
          'image' => ['src' => $asset('UpcomingEvent/8107b01ed92d05bd5a6861d1ca3a78ccbffc6289.webp'), 'alt' => 'Events Image', 'className' => 'mt-15 rounded-2xl h-139.25 w-auto'],
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
        'section_id' => $jobsSection->id ?? null,
        'section_key' => 'jobs',
        'order' => 8,
        'is_special_component' => true,
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
        'section_id' => $programImpactSection->id ?? null,
        'section_key' => 'program-impact',
        'order' => 9,
        'is_special_component' => true,
        'prop_name' => 'programImpactData',
        'data' => json_encode([
          'section' => [
            'title' => 'Program Impact and SDGs',
            'mainImage' => [
              'images' => [
                $asset('ProgramImpact/8235fc0d0e2c3082be7cb9ba5d6f5502a121d0ff%20(1).webp'),
                $asset('ProgramImpact/64065404ef679e54d2dabd90bba3b1744817c578.webp'),
                $asset('ProgramImpact/8235fc0d0e2c3082be7cb9ba5d6f5502a121d0ff%20(1).webp'),
                $asset('ProgramImpact/64065404ef679e54d2dabd90bba3b1744817c578.webp')
              ]
            ]
          ],
          'sdgImages' => [
            ['id' => 1, 'src' => $asset('ProgramImpact/Screenshot_17-5-2026_18732_www.figma.com.webp'), 'alt' => 'No Poverty'],
            ['id' => 2, 'src' => $asset('ProgramImpact/Screenshot_17-5-2026_18742_www.figma.com.webp'), 'alt' => 'Zero Hunger'],
            ['id' => 3, 'src' => $asset('ProgramImpact/Screenshot_17-5-2026_18750_www.figma.com.webp'), 'alt' => 'Good Health'],
            ['id' => 4, 'src' => $asset('ProgramImpact/Screenshot_17-5-2026_1887_www.figma.com.webp'), 'alt' => 'Quality Education'],
            ['id' => 5, 'src' => $asset('ProgramImpact/Screenshot_17-5-2026_18823_www.figma.com.webp'), 'alt' => 'Gender Equality'],
            ['id' => 6, 'src' => $asset('ProgramImpact/Screenshot_17-5-2026_18837_www.figma.com.webp'), 'alt' => 'Clean Water'],
            ['id' => 7, 'src' => $asset('ProgramImpact/Screenshot_17-5-2026_1894_www.figma.com.webp'), 'alt' => 'Clean Energy'],
            ['id' => 8, 'src' => $asset('ProgramImpact/Screenshot_17-5-2026_18913_www.figma.com.webp'), 'alt' => 'Decent Work'],
            ['id' => 9, 'src' => $asset('ProgramImpact/Screenshot_17-5-2026_18920_www.figma.com.webp'), 'alt' => 'Industry Innovation'],
            ['id' => 10, 'src' => $asset('ProgramImpact/Screenshot_17-5-2026_18930_www.figma.com.webp'), 'alt' => 'Reduced Inequalities'],
            ['id' => 11, 'src' => $asset('ProgramImpact/Screenshot_17-5-2026_18939_www.figma.com.webp'), 'alt' => 'Sustainable Cities'],
            ['id' => 12, 'src' => $asset('ProgramImpact/Screenshot_17-5-2026_18949_www.figma.com.webp'), 'alt' => 'Responsible Consumption'],
            ['id' => 13, 'src' => $asset('ProgramImpact/Screenshot_17-5-2026_18108_www.figma.com.webp'), 'alt' => 'Climate Action'],
            ['id' => 14, 'src' => $asset('ProgramImpact/Screenshot_17-5-2026_181017_www.figma.com.webp'), 'alt' => 'Life Below Water'],
            ['id' => 15, 'src' => $asset('ProgramImpact/Screenshot_17-5-2026_181031_www.figma.com.webp'), 'alt' => 'Life On Land'],
            ['id' => 16, 'src' => $asset('ProgramImpact/Screenshot_17-5-2026_181046_www.figma.com.webp'), 'alt' => 'Peace Justice'],
            ['id' => 17, 'src' => $asset('ProgramImpact/Screenshot_17-5-2026_181055_www.figma.com.webp'), 'alt' => 'Partnerships'],
            ['id' => 18, 'src' => $asset('ProgramImpact/Screenshot_17-5-2026_181133_www.figma.com.webp'), 'alt' => 'SDG 18']
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
        'section_id' => $pageBannerSection->id ?? null,
        'section_key' => 'banner',
        'order' => 1,
        'is_special_component' => true,
        'prop_name' => 'bannerData',
        'custom_props' => json_encode(['sectionId' => 'about-us-banner']),
        'data' => json_encode([
          'background' => ['src' => $asset('AboutUs/9734ab42cfed2d40c8ed08cbc3059b227d9aee8b.jpg'), 'alt' => 'Background'],
          'overlay' => ['darkOverlay' => 'bg-black/40 lg:bg-black/50', 'gradient' => 'bg-gradient-to-r from-black/85 via-black/10 to-transparent'],
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
        'section_id' => $heroFigureSection->id ?? null,
        'section_key' => 'background',
        'order' => 2,
        'is_special_component' => true,
        'prop_name' => 'backgroundData',
        'custom_props' => json_encode(['layout' => 'text-left', 'sectionId' => 'background']),
        'data' => json_encode([
          'section' => ['title' => 'Background, Roles and Functions'],
          'content' => [
            'html' => '<div class="space-y-6"><div><h2 class="font-700 text-xl sm:text-2xl mb-4 text-[#080C14]">Background:</h2><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug mb-4">The emergence and existence of Dwip Unnayan Songstha (Island Development Association)- DUS was based upon asserting the victims of The Liberation War in 1971 as well as providing immediate relief support to the worse suffer being affected by the devastating cyclone flown over the coastal areas of Bangladesh in 1970.</p><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug mb-4">DUS, by virtue of its roles, functions and services being visioned and dreamt by the founder and associates, is basically a development and philanthropic organization located at Hatiya Island under Noakhali district in southern Bangladesh. The main focus and concentration of the organization since its inception has been to humanitarian and rehabilitation work for war and cyclone victim affected populations which in the passage of time has turned into integrated socio-economic and sustainable community development services directing towards a just society free from all sorts of exploitation, injustice and deprivation.</p><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Until 1981, DUS has been well-thought-out and recognized as a volunteer initiative for providing aid, relief and rehabilitation related activities and gaining experiences on the said services over last one decade since its inception, the structural based organizational formation took into shape in 1982, announcing its mandate as an association/platform for land development, protection and restoration.</p></div></div>'
          ],
          'btn' => ['text' => 'Learn More About Functions', 'link' => '/about/functions'],
          'image' => ['src' => $asset('AboutUs/f465fcbdab4004cd25dba4df06b9f8d5f2648620.jpg'), 'alt' => 'Background', 'className' => 'w-full h-auto lg:h-full object-cover rounded-2xl sm:rounded-3xl lg:rounded-4xl']
        ]),
        'created_at' => now(),
        'updated_at' => now(),
      ],
      // Vision & Mission
      [
        'page_id' => $aboutPage->id,
        'section_id' => $heroFigureSection->id ?? null,
        'section_key' => 'vision-and-mission',
        'order' => 3,
        'is_special_component' => true,
        'prop_name' => 'visionAndMissionData',
        'custom_props' => json_encode(['layout' => 'text-right', 'sectionId' => 'vision-and-mission', 'bgColor' => 'bg-[#F5F5F5]']),
        'data' => json_encode([
          'section' => ['title' => 'Vision, Mission, Goal, Objectives and Core values'],
          'content' => [
            'html' => '<div class="space-y-6"><div><h2 class="font-700 text-xl sm:text-2xl mb-4 text-[#080C14]">Vision</h2><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">DUS dreams the existence of a society free from all sorts of exploitation where everyone irrespective of class, creed and cast will enjoy equal rights, freedom and justice leading an equitable and gender balanced communities.</p></div><div><h2 class="font-700 text-xl sm:text-2xl mb-4 text-[#080C14]">Mission</h2><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug mb-4">Coastal areas of Bangladesh are regularly stricken by natural disasters. Most of the people living here are almost poor. Due to regular natural disasters occurs here inhabitants are lacking asset and resources and they are deepened in illiterate, malnourished and culturally remain backward. DUS believes that optimizing utilization of hidden humane capacity & power and local resources intensively could gradually alleviate this condition. It perceives to bring down all this scope of development affords in an integrated manner so that sustainable livelihood ventures emerge in the community according to their aspiration.</p><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Initiating, activating, promoting and facilitating the sustainable development of the targeted population through capacity building, resource mobilization, networking, lobbying, need assessment, impact analysis, research, evaluation and policy advocacy in order to ensure and protected equal human rights, freedom, justice in all shape of individual, family and community life in all interventional areas.</p></div></div>'
          ],
          'btn' => ['text' => 'Learn More About Vision, Mission, Goal', 'link' => '/about/vision-mission'],
          'image' => ['src' => $asset('AboutUs/c9c3585f93806d98cf9e2fbeadccb32a66efb4b5.jpg'), 'alt' => 'Vision and Mission', 'className' => 'w-full h-auto lg:h-full object-cover rounded-2xl sm:rounded-3xl lg:rounded-4xl']
        ]),
        'created_at' => now(),
        'updated_at' => now(),
      ],
      // Interventional Approaches
      [
        'page_id' => $aboutPage->id,
        'section_id' => $heroFigureSection->id ?? null,
        'section_key' => 'interventional-approaches',
        'order' => 4,
        'is_special_component' => true,
        'prop_name' => 'interventionalData',
        'custom_props' => json_encode(['layout' => 'text-left', 'sectionId' => 'interventional-approaches']),
        'data' => json_encode([
          'section' => ['title' => 'Interventional Approaches and DUS Priorities'],
          'content' => [
            'html' => '<div class="space-y-6"><div><h2 class="font-700 text-xl sm:text-2xl mb-4 text-[#080C14]">Sustainable Poverty Reduction and Human Development:</h2><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug mb-4">The development interventional unit of GoB is each Household. DUS believes if the member of the HHs are developed then they can play an active role to bring immense changes within their families. As a whole each household take part into the process of socio-economic development of the country.</p><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">This Organization\'s aim to help its member\'s inherent abilities to flourish such a way so that they are endowed with the key to their progress to a sustainable livelihood restoration. With renewed confidence and hope, the poor, then, move ahead and break free from the shackles of multidimensional poverty and indignity and achieve living standards characterized by human freedom and dignity, along with material uplift.</p></div><div><h2 class="font-700 text-xl sm:text-2xl mb-4 text-[#080C14]">Focus on Landless poor</h2><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">DUS concentrates on the settlement of landless poor families who are victims of major riverbank erosion & affected by several natural disasters like tropical cyclone, salinity, tidal surge etc that are living below poverty line in the coastal district of Bangladesh.</p></div><div><h2 class="font-700 text-xl sm:text-2xl mb-4 text-[#080C14]">Empowerment of Women</h2><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Over 87% of our target population/beneficiaries are poor women. DUS believes if women are empowered towards right direction, they can play an active role to bring vital changes within their families as well as in the communities.</p></div></div>'
          ],
          'btn' => ['text' => 'Learn More About Interventional Approaches', 'link' => '/about/interventional-approaches'],
          'image' => ['src' => $asset('AboutUs/d3afc7e94d5609f2c2356758f463ee15af0450fe.jpg'), 'alt' => 'Interventional Approaches', 'className' => 'w-full h-auto lg:h-full object-cover rounded-2xl sm:rounded-3xl lg:rounded-4xl']
        ]),
        'created_at' => now(),
        'updated_at' => now(),
      ],
      // Legal
      [
        'page_id' => $aboutPage->id,
        'section_id' => $legalSection->id ?? null,
        'section_key' => 'legal',
        'order' => 5,
        'is_special_component' => true,
        'prop_name' => 'legalData',
        'data' => json_encode([
          'background' => ['src' => $asset('AboutUs/64065404ef679e54d2dabd90bba3b1744817c578.jpg'), 'alt' => 'Background'],
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
        'section_id' => $heroFigureSection->id ?? null,
        'section_key' => 'evolutionary-changes',
        'order' => 6,
        'is_special_component' => true,
        'prop_name' => 'evolutionaryChangesData',
        'custom_props' => json_encode(['layout' => 'text-left', 'sectionId' => 'evolutionary-changes']),
        'data' => json_encode([
          'section' => ['title' => 'Evolutionary Changes and Footings'],
          'content' => [
            'html' => '<div class="space-y-6"><div><h2 class="font-700 text-xl sm:text-2xl mb-4 text-[#080C14]">Year 1972-1985</h2><ul class="list-disc pl-5 space-y-2 mb-4"><li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">DUS was formed by a group of young volunteers and started working for the victims of Bangladesh Liberation War of 1971 and devastating 1970 cyclone affected households at Hatiya Island focusing on humanitarian service to mankind</li><li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Relief and rehabilitation program for the victims and initiate disaster management program at local level</li><li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Rehabilitation of 2000 landless river bank eroded farmers in the newly accreted Govt. Khash land</li><li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">DUS turn into an organizational shape and named as Dwip Unnayan Sangstha in 1982</li><li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Community Mobilization and revolving credit support to community started in 1984</li><li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Registered with Ministry of Social Services &amp; Welfare.</li><li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Registered with NGO Affairs Bureau.</li><li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Socio-economic development programs for the poor initiative from 1985</li></ul></div><div><h2 class="font-700 text-xl sm:text-2xl mb-4 text-[#080C14]">Year 1986-2000</h2><ul class="list-disc pl-5 space-y-2"><li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Strengthening Local Govt. bodies through capacity building in good governance, accountancy and resource management supported by IVS/ USAID</li><li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Capacity building of Union Parishad and Upazila Parishad for effective disaster management in four coastal district of Bangladesh supported by CARE-Bangladesh &amp; USAID</li><li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Island fisheries development project implementation supported by DFID.</li><li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Disaster rehabilitation support project implementation supported by AusAid/Oxfam-America/Oxfam-UK, Oxfam-Hong Kong British ODA</li><li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Cyclone shelter Construction supported by CAA Australia</li><li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Housing support for poor supported by British ODA/CARE-Bangladesh/AusAid</li><li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Livestock development for poor supported by DANIDA, CIDA</li><li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Integrated Socio-economic development program supported by Oxfam-UK</li><li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Emergency Relief and Rehabilitation for Cyclone in coastal islands supported by Oxfam-UK, British ODA, CARE-Bangladesh</li><li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Livelihood Rehabilitation for Flood Affected Fisheries Households in Hatiya Island supported by DFID</li><li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Flood 98 Rehabilitation program supported by DFID, Oxfam-GB</li></ul></div></div>'
          ],
          'btn' => ['text' => 'Learn More About 2001 - 2020', 'link' => '/about/evolutionary-changes'],
          'image' => ['src' => $asset('AboutUs/962bd5ee9dacf1f4261d0592856f5716dcffb725.jpg'), 'alt' => 'Evolutionary Changes', 'className' => 'w-full h-auto lg:h-full object-cover rounded-2xl sm:rounded-3xl lg:rounded-4xl']
        ]),
        'created_at' => now(),
        'updated_at' => now(),
      ],
      // Governance
      [
        'page_id' => $aboutPage->id,
        'section_id' => $heroFigureSection->id ?? null,
        'section_key' => 'governance',
        'order' => 7,
        'is_special_component' => true,
        'prop_name' => 'governanceData',
        'custom_props' => json_encode(['layout' => 'text-right', 'sectionId' => 'governance', 'bgColor' => 'bg-[#F5F5F5]']),
        'data' => json_encode([
          'section' => ['title' => 'Governance'],
          'content' => [
            'html' => '<div class="space-y-6"><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug mb-4">DUS believes in democratic practice and public-private participation to achieve its goal, purpose and objectives and accordingly the internal management system has been framed comprising the following structures:</p><div><h2 class="font-700 text-xl sm:text-2xl mb-4 text-[#080C14]">General Body</h2><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">The General Body consists of 31 members who are the permanent resident of the coastal community. Of them 30% are women. The social and professional status of the members include teachers, lawyers, social workers, freedom fighters and community leaders.</p></div><div><h2 class="font-700 text-xl sm:text-2xl mb-4 text-[#080C14]">Executive Committee</h2><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">DUS has an Executive Committee of 7 members duly elected by the General Body for a period of three years. DUS is represented by its Executive Director who is the Member Secretary of the Executive Committee. ED and his core staff members are appointed by the board. Executive Director is treated as the Chief Executive of the organization. The Executive Director is the overall authority to implement the projects and programs on behalf of the Executive Committee.</p></div></div>'
          ],
          'btn' => ['text' => 'Learn More About Governance', 'link' => '/about/governance'],
          'image' => ['src' => $asset('AboutUs/ce88efc81f8b1fe8d4f757eba85f05717acb68e4.jpg'), 'alt' => 'Governance', 'className' => 'w-full h-auto lg:h-full object-cover rounded-2xl sm:rounded-3xl lg:rounded-4xl']
        ]),
        'created_at' => now(),
        'updated_at' => now(),
      ],
      // Cards
      [
        'page_id' => $aboutPage->id,
        'section_id' => $cardsSection->id ?? null,
        'section_key' => 'cards',
        'order' => 8,
        'is_special_component' => true,
        'prop_name' => 'cardsData',
        'data' => json_encode([
          'section' => ['title' => 'Cards Section'],
          'cards' => [
            [
              'id' => 'operational-areas',
              'image' => ['src' => $asset('AboutUs/image.png'), 'alt' => 'Operational Areas', 'className' => 'mx-auto object-contain'],
              'title' => 'Operational Areas',
              'buttonText' => 'Explore Our Areas of Operation',
              'buttonLink' => '/about/operational-areas',
              'bgColor' => 'bg-[#F5F5F5]',
              'cardBgColor' => 'bg-white'
            ],
            [
              'id' => 'achievements',
              'image' => ['src' => $asset('AboutUs/fcbbf1e10ca75bccf6a608e1de01306d56897811.png'), 'alt' => 'Our Achievements', 'className' => 'mx-auto object-contain'],
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
        'section_id' => $heroFigureSection->id ?? null,
        'section_key' => 'programs-activities',
        'order' => 9,
        'is_special_component' => true,
        'prop_name' => 'programsData',
        'custom_props' => json_encode(['layout' => 'text-right', 'sectionId' => 'programs-activities', 'bgColor' => 'bg-[#F5F5F5]']),
        'data' => json_encode([
          'section' => ['title' => 'Programs/Activities'],
          'content' => [
            'html' => '<div class="space-y-6"><div><h2 class="font-700 text-xl sm:text-2xl mb-4 text-[#080C14]">Micro-Finance Program</h2><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug mb-4">Micro finance Program is the core program of all DUS activities. DUS has been implementing its major program in partnership with Palli Karma Sahayak Foundation (PKSF) since 2000. It provides collateral free micro-credit to its around 40K+ group members where 97 percent are female. Under this program, DUS has savings scheme for poor women who has no access in mainstream banks due to lack of capital and assets.</p><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Most of the targeted beneficiaries of DUS are poor women, marginal farmers and small micro entrepreneurs. Major borrowers are women who used these loan funds to promote various income generating activities for their earnings and employments. As a result, micro finance program has positive impact on poverty reduction especially at grass rote level, income enhancement, consumption, the promotion of rural businesses, education and health and finally the empowerment of women and their employment in rural island communities.</p></div><div><h2 class="font-700 text-xl sm:text-2xl mb-4 text-[#080C14]">Jagoron</h2><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug mb-4">Jagoron is the name of a credit instrument of PKSF to initiate household based enterprise development in Bangladesh. As a Partner Organization of PKSF, DUS is implementing this program which is now comprised with Rural Micro finance and Urban Micro finance. Rural Micro finance is that types of loan which allows rural women to finance their small scale agriculture production at homestead level.</p><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">RMC Loans are allowed as working capital loans to promote poor and disadvantaged households in income earnings. RMC loan range from 10K to 59K to allowed for one year and service charge is 24% (Reducing Balancing Method)/12.0% (Flat Rate Method) per year. The weekly savings of RMC members are 10/= per week.</p></div></div>'
          ],
          'btn' => ['text' => 'Learn More About Programs', 'link' => '/about/programs-activities'],
          'image' => ['src' => $asset('AboutUs/8235fc0d0e2c3082be7cb9ba5d6f5502a121d0ff.jpg'), 'alt' => 'Programs', 'className' => 'w-full h-auto lg:h-full object-cover rounded-2xl sm:rounded-3xl lg:rounded-4xl']
        ]),
        'created_at' => now(),
        'updated_at' => now(),
      ],
      // Training
      [
        'page_id' => $aboutPage->id,
        'section_id' => $heroFigureSection->id ?? null,
        'section_key' => 'training',
        'order' => 10,
        'is_special_component' => true,
        'prop_name' => 'trainingData',
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
        'section_id' => $faqSection->id ?? null,
        'section_key' => 'faq',
        'order' => 11,
        'is_special_component' => true,
        'prop_name' => 'faqData',
        'data' => json_encode([
          'section' => [
            'title' => 'Key Questions Answered About Our Us',
            'subtitle' => 'Explore our Frequently Asked Questions for answers about our charity\'s mission, projects, and how to help.'
          ],
          'faqs' => [
            ['id' => 1, 'question' => 'What is the mission of your charity?', 'answer' => 'Any company that is using spreadsheets and emails to manage the people side of their business is wasting time on admin and making life more difficult for themselves. A well-designed HR system like PiHR automates menial tasks allowing business owners to focus on the strategic work of growing the business. It improves the recruitment process, enriches payroll management, provides real-time feedback, improves employees, improves data security, helps make decisions.'],
            ['id' => 2, 'question' => 'Who benefits from your programs?', 'answer' => 'Our programs benefit underprivileged communities, women and children, disaster-affected families, and landless poor in coastal areas of Bangladesh.'],
            ['id' => 3, 'question' => 'Can I make a recurring donation?', 'answer' => 'Yes, you can make recurring donations monthly, quarterly, or annually. Visit our donation page to set up your recurring contribution.'],
            ['id' => 4, 'question' => 'Can I visit the projects I support?', 'answer' => 'Yes, we welcome donors to visit our project sites. Please contact our office in advance to arrange a visit and meet the communities you are supporting.'],
            ['id' => 5, 'question' => 'How can I get involved?', 'answer' => 'You can get involved by donating, volunteering, sponsoring a child, or becoming a community ambassador. Visit our "Get Involved" page for more details.'],
            ['id' => 6, 'question' => 'How can I make a donation?', 'answer' => 'You can make a donation online through our secure payment portal, bank transfer, or by visiting our office. We accept one-time and recurring donations.'],
            ['id' => 7, 'question' => 'How do you maintain accountability?', 'answer' => 'We maintain transparency through regular audits, annual reports, community feedback mechanisms, and public disclosure of our financial statements.'],
            ['id' => 8, 'question' => 'Are donations tax-deductible?', 'answer' => 'Yes, donations to DUS are tax-deductible under applicable tax laws. You will receive a receipt for your donation for tax purposes.']
          ]
        ]),
        'created_at' => now(),
        'updated_at' => now(),
      ],
    ];

    $this->insertPageSections($aboutSections);
    $this->command->info('About page sections seeded successfully!');

    // ============================================
    // ABOUT SUB-PAGES SECTIONS (Vision, Mission, Functions, etc.)
    // ============================================

    $aboutSubPages = [
      'vision-mission' => [
        'title' => 'Vision, Mission, Goal, Objectives and Core values',
        'html' => '<div class="space-y-8"><div><h2 class="font-700 text-xl sm:text-2xl mb-4 text-[#080C14]">Vision</h2><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">DUS dreams the existence of a society free from all sorts of exploitation where everyone irrespective of class, creed and cast will enjoy equal rights, freedom and justice.</p></div><div><h2 class="font-700 text-xl sm:text-2xl mb-4 text-[#080C14]">Mission</h2><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug mb-4">DUS believes that optimizing utilization of hidden humane capacity and local resources could gradually alleviate poverty and exclusion.</p><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">The organization facilitates sustainable development through capacity building, resource mobilization, networking, lobbying, need assessment, impact analysis, research, evaluation and policy advocacy.</p></div><div><h2 class="font-700 text-xl sm:text-2xl mb-4 text-[#080C14]">Goals and Values</h2><ul class="list-disc pl-5 space-y-2"><li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Uplift the poor and vulnerable communities</li><li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Promote dignity, justice and equality</li><li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Build people-centered sustainable development</li></ul></div></div>'
      ],
      'functions' => [
        'title' => 'Background, Roles and Functions',
        'html' => '<div class="space-y-8"><div><h2 class="font-700 text-xl sm:text-2xl mb-4 text-[#080C14]">Background</h2><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug mb-4">The emergence and existence of Dwip Unnayan Songstha was based upon supporting victims of the Liberation War in 1971 and providing immediate relief after the devastating cyclone of 1970.</p><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">The organization began as a volunteer initiative and later evolved into a development and philanthropic organization rooted in Hatiya Island.</p></div><div><h2 class="font-700 text-xl sm:text-2xl mb-4 text-[#080C14]">Roles and Functions</h2><ul class="list-disc pl-5 space-y-2"><li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Humanitarian assistance and rehabilitation</li><li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Socio-economic development and livelihood support</li><li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Community mobilization and capacity building</li><li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Policy advocacy, networking, research and evaluation</li></ul></div></div>'
      ],
      'legal-affiliations' => [
        'title' => 'Legal Status and Organizational Affiliations',
        'html' => '<div class="space-y-8"><div><h2 class="font-700 text-xl sm:text-2xl mb-4 text-[#080C14]">Legal Status</h2><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">DUS is a registered organization with the Ministry of Social Services & Welfare and NGO Affairs Bureau. The organization operates under the Societies Registration Act and complies with all government regulations for NGOs in Bangladesh.</p></div><div><h2 class="font-700 text-xl sm:text-2xl mb-4 text-[#080C14]">Organizational Affiliations</h2><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">DUS maintains affiliations with various national and international organizations including PKSF, CUP, ALRD, CGG, BNNRC, and Disaster Forum Bangladesh.</p></div></div>'
      ],
      'interventional-approaches' => [
        'title' => 'Interventional Approaches and DUS Priorities',
        'html' => '<div class="space-y-8"><div><h2 class="font-700 text-xl sm:text-2xl mb-4 text-[#080C14]">Priority Areas</h2><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug mb-4">DUS concentrates on landless poor families, women empowerment, and long-term sustainable livelihoods in the coastal region.</p><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">The organization believes household-level development creates stronger families and stronger communities.</p></div><div><h2 class="font-700 text-xl sm:text-2xl mb-4 text-[#080C14]">Interventional Approach</h2><ul class="list-disc pl-5 space-y-2"><li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Capacity building of community institutions</li><li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Targeted support for women and marginalized households</li><li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Research-based and context-driven interventions</li></ul></div></div>'
      ],
      'evolutionary-changes' => [
        'title' => 'Evolutionary Changes and Footings',
        'html' => '<div class="space-y-8"><div><h2 class="font-700 text-xl sm:text-2xl mb-4 text-[#080C14]">Early Footings</h2><ul class="list-disc pl-5 space-y-2"><li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">1971 to 1985: volunteer relief and rehabilitation activities</li><li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">1986 to 2000: stronger community-based development work</li></ul></div><div><h2 class="font-700 text-xl sm:text-2xl mb-4 text-[#080C14]">Growth Phase</h2><ul class="list-disc pl-5 space-y-2"><li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Expansion into microfinance, disaster management and livelihood support</li><li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Greater focus on capacity building, governance and resilience</li></ul></div></div>'
      ],
      'governance' => [
        'title' => 'Governance Structure',
        'html' => '<div class="space-y-8"><div><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug mb-4">DUS believes in democratic practice and public participation in decision making.</p><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Its governance structure is designed to keep accountability, oversight and implementation clearly separated.</p></div><div><h2 class="font-700 text-xl sm:text-2xl mb-4 text-[#080C14]">Governance Bodies</h2><ul class="list-disc pl-5 space-y-2"><li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">General Body</li><li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Executive Committee</li><li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Executive Director and core staff team</li></ul></div></div>'
      ],
      'operational-areas' => [
        'title' => 'Operational Areas of DUS',
        'html' => '<div class="space-y-8"><div><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug mb-4">DUS works in coastal and island communities across Bangladesh, with deep roots in Hatiya and surrounding vulnerable zones.</p><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">The operational focus is on the most vulnerable rural areas where disaster exposure, poverty and climate risk overlap.</p></div><div><h2 class="font-700 text-xl sm:text-2xl mb-4 text-[#080C14]">Core Working Areas</h2><ul class="list-disc pl-5 space-y-2"><li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Disaster-prone coastal communities</li><li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Low-income rural and island households</li><li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Women-led and youth-focused livelihood groups</li></ul></div></div>'
      ],
      'achievements' => [
        'title' => 'Our Achievements',
        'html' => '<div class="space-y-8"><div><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug mb-4">Over the years DUS has built a strong track record in microfinance, disaster response, education, health and community development.</p><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Its achievements are deeply linked to the resilience and participation of the communities it serves.</p></div><div><h2 class="font-700 text-xl sm:text-2xl mb-4 text-[#080C14]">Highlights</h2><ul class="list-disc pl-5 space-y-2"><li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Large-scale outreach through microfinance and livelihood support</li><li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Sustained engagement in coastal resilience and disaster preparedness</li><li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Community radio and knowledge-sharing initiatives</li></ul></div></div>'
      ],
      'programs-activities' => [
        'title' => 'Programs & Activities',
        'html' => '<div class="space-y-8"><div><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug mb-4">DUS programs are built around the practical needs of coastal and rural communities.</p><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Microfinance, community radio, research, health, education, agriculture, and climate resilience are central to its work.</p></div><div><h2 class="font-700 text-xl sm:text-2xl mb-4 text-[#080C14]">Program Areas</h2><ul class="list-disc pl-5 space-y-2"><li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Micro-Finance Program</li><li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Climate Change and Disaster Management</li><li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Community Radio</li><li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Research and Documentation</li></ul></div></div>'
      ],
      'facilities' => [
        'title' => 'Training and Other Facilities',
        'html' => '<div class="space-y-8"><div><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug mb-4">Training is a key part of the development approach at DUS and is used to build capacity among staff and beneficiaries.</p><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">The training unit prepares modules, uses practical demonstrations, and supports both livelihood and leadership development.</p></div><div><h2 class="font-700 text-xl sm:text-2xl mb-4 text-[#080C14]">Training Offerings</h2><ul class="list-disc pl-5 space-y-2"><li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Skill development and vocational training</li><li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Leadership and management training</li><li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Financial literacy and business management</li><li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">MIS and data management training</li></ul></div></div>'
      ],
    ];

    foreach ($aboutSubPages as $slug => $data) {
      $subPage = DB::table('pages')
        ->where('slug', $slug)
        ->where('parent_id', $aboutPage->id)
        ->first();

      if ($subPage) {
        $subPageSections = [
          [
            'page_id' => $subPage->id,
            'section_id' => $pageBannerSection->id ?? null,
            'section_key' => 'banner',
            'order' => 1,
            'is_special_component' => true,
            'prop_name' => 'bannerData',
            'custom_props' => json_encode(['sectionId' => $slug . '-banner']),
            'data' => json_encode([
              'background' => ['src' => $asset('OurPrograms/db1b2b6eae5fc260b4204f8257dadbd5a7aa0af7.png'), 'alt' => 'Background'],
              'overlay' => ['darkOverlay' => 'bg-black/40 lg:bg-black/50', 'gradient' => 'bg-gradient-to-r from-black/85 via-black/10 to-transparent'],
              'content' => ['title' => ['text' => $data['title'], 'className' => 'font-bold leading-tight']]
            ]),
            'created_at' => now(),
            'updated_at' => now(),
          ],
          [
            'page_id' => $subPage->id,
            'section_id' => $heroFigureSection->id ?? null,
            'section_key' => 'content',
            'order' => 2,
            'is_special_component' => true,
            'prop_name' => 'subPageData',
            'custom_props' => json_encode(['layout' => 'text-left', 'sectionId' => $slug . '-content']),
            'data' => json_encode([
              'title' => $data['title'],
              'content' => $data['html'],
              'image' => ['src' => 'https://placehold.co/730x730', 'alt' => $data['title']]
            ]),
            'created_at' => now(),
            'updated_at' => now(),
          ],
          [
            'page_id' => $subPage->id,
            'section_id' => $faqSection->id ?? null,
            'section_key' => 'faq',
            'order' => 3,
            'is_special_component' => true,
            'prop_name' => 'faqData',
            'data' => json_encode([
              'section' => [
                'title' => 'Key Questions Answered',
                'subtitle' => 'Find answers to common questions about our organization'
              ],
              'faqs' => [
                ['id' => 1, 'question' => 'What is your mission?', 'answer' => 'Our mission is to help communities...'],
                ['id' => 2, 'question' => 'How can I contact you?', 'answer' => 'You can contact us via email or phone...'],
              ]
            ]),
            'created_at' => now(),
            'updated_at' => now(),
          ],
          [
            'page_id' => $subPage->id,
            'section_id' => $upcomingEventsSection->id ?? null,
            'section_key' => 'upcoming-events',
            'order' => 4,
            'is_special_component' => true,
            'prop_name' => 'upcomingEventsData',
            'data' => json_encode([
              'section' => [
                'title' => 'Upcoming Events',
                'description' => 'Join us at our upcoming events',
                'button' => ['text' => 'View All Events', 'link' => '/events']
              ],
              'image' => ['src' => $asset('UpcomingEvent/8107b01ed92d05bd5a6861d1ca3a78ccbffc6289.webp'), 'alt' => 'Events'],
              'events' => []
            ]),
            'created_at' => now(),
            'updated_at' => now(),
          ],
        ];

        $this->insertPageSections($subPageSections);
        $this->command->info($slug . ' page sections seeded successfully!');
      }
    }

    // ============================================
    // CONTACT PAGE SECTIONS
    // ============================================

    $contactSections = [
      // Banner
      [
        'page_id' => $contactPage->id,
        'section_id' => $pageBannerSection->id ?? null,
        'section_key' => 'banner',
        'order' => 1,
        'is_special_component' => true,
        'prop_name' => 'bannerData',
        'custom_props' => json_encode(['sectionId' => 'contact-us-banner']),
        'data' => json_encode([
          'background' => ['src' => $asset('OurPrograms/db1b2b6eae5fc260b4204f8257dadbd5a7aa0af7.png'), 'alt' => 'Background'],
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
        'section_id' => $contactOfficeSection->id ?? null,
        'section_key' => 'contact-offices',
        'order' => 2,
        'is_special_component' => false,
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
        'section_id' => $contactReachSection->id ?? null,
        'section_key' => 'contact-reach',
        'order' => 3,
        'is_special_component' => true,
        'prop_name' => 'reachUsImage',
        'data' => json_encode($asset('ContactUs/8235fc0d0e2c3082be7cb9ba5d6f5502a121d0ff.jpg')),
        'created_at' => now(),
        'updated_at' => now(),
      ],
      // Follow Us
      [
        'page_id' => $contactPage->id,
        'section_id' => $followUsSection->id ?? null,
        'section_key' => 'follow-us',
        'order' => 4,
        'is_special_component' => true,
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
      // Address (Map)
      [
        'page_id' => $contactPage->id,
        'section_id' => $addressSection->id ?? null,
        'section_key' => 'address',
        'order' => 5,
        'is_special_component' => true,
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
        'section_id' => $faqSection->id ?? null,
        'section_key' => 'faq',
        'order' => 6,
        'is_special_component' => true,
        'prop_name' => 'faqData',
        'custom_props' => json_encode(['bgColor' => 'bg-white']),
        'data' => json_encode([
          'section' => [
            'title' => 'Key Questions Answered',
            'subtitle' => 'Find answers to common questions about our organization'
          ],
          'faqs' => [
            ['id' => 1, 'question' => 'What is your mission?', 'answer' => 'Our mission is to help communities through sustainable development...'],
            ['id' => 2, 'question' => 'How can I contact you?', 'answer' => 'You can contact us via email or phone...'],
            ['id' => 3, 'question' => 'Where are you located?', 'answer' => 'We have offices in Dhaka, Noakhali, and Hatiya.'],
            ['id' => 4, 'question' => 'How can I volunteer?', 'answer' => 'Visit our volunteer page or contact our HR department.']
          ]
        ]),
        'created_at' => now(),
        'updated_at' => now(),
      ],
      // Stories
      [
        'page_id' => $contactPage->id,
        'section_id' => $storiesSection->id ?? null,
        'section_key' => 'stories',
        'order' => 7,
        'is_special_component' => true,
        'prop_name' => 'storiesData',
        'data' => json_encode([
          'section' => [
            'title' => 'Insights, Stories & Impact',
            'description' => 'Read real stories from the field, community experiences, and thought-provoking perspectives that reflect our mission and impact.'
          ],
          'stories' => [
            ['id' => 1, 'image' => $asset('Stories/8107b01ed92d05bd5a6861d1ca3a78ccbffc6289.webp'), 'date' => 'June 6, 2023', 'title' => 'Invest in Kindness', 'description' => 'Lorem Ipsum...', 'link' => '/stories/invest-in-kindness'],
            ['id' => 2, 'image' => $asset('Stories/b3d758bf8cd7985c857cdbe55b5101b105ee9f75.webp'), 'date' => 'June 6, 2023', 'title' => 'Custom Pool Design', 'description' => 'Lorem Ipsum...', 'link' => '/stories/custom-pool-design'],
            ['id' => 3, 'image' => $asset('Stories/8235fc0d0e2c3082be7cb9ba5d6f5502a121d0ff%20(1).webp'), 'date' => 'June 6, 2023', 'title' => 'Mindfulness Benefits', 'description' => 'Lorem Ipsum...', 'link' => '/stories/mindfulness-benefits']
          ]
        ]),
        'created_at' => now(),
        'updated_at' => now(),
      ],
      // Upcoming Events
      [
        'page_id' => $contactPage->id,
        'section_id' => $upcomingEventsSection->id ?? null,
        'section_key' => 'upcoming-events',
        'order' => 8,
        'is_special_component' => true,
        'prop_name' => 'upcomingEventsData',
        'data' => json_encode([
          'section' => [
            'title' => 'Upcoming Events',
            'description' => 'Join us at our upcoming events',
            'button' => ['text' => 'View All Events', 'link' => '/events']
          ],
          'image' => ['src' => $asset('UpcomingEvent/8107b01ed92d05bd5a6861d1ca3a78ccbffc6289.webp'), 'alt' => 'Events'],
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
        'section_id' => $pageBannerSection->id ?? null,
        'section_key' => 'banner',
        'order' => 1,
        'is_special_component' => true,
        'prop_name' => 'bannerData',
        'custom_props' => json_encode(['sectionId' => 'blogs-banner']),
        'data' => json_encode([
          'background' => ['src' => $asset('OurPrograms/db1b2b6eae5fc260b4204f8257dadbd5a7aa0af7.png'), 'alt' => 'Background'],
          'overlay' => ['darkOverlay' => 'bg-black/40 lg:bg-black/50', 'gradient' => 'bg-gradient-to-r from-black/85 via-black/10 to-transparent'],
          'content' => ['title' => ['text' => 'Blog', 'className' => 'font-bold leading-tight']]
        ]),
        'created_at' => now(),
        'updated_at' => now(),
      ],
      // Blog Section (Multi-prop - no prop_name)
      [
        'page_id' => $blogsPage->id,
        'section_id' => $blogSection->id ?? null,
        'section_key' => 'blog-section',
        'order' => 2,
        'is_special_component' => false,
        'prop_name' => null,
        'data' => json_encode([
          'mainBlog' => [
            'id' => 1,
            'date' => 'June 6, 2023',
            'title' => 'Invest in Kindness, Reap a Better Future',
            'description' => 'Micro finance Program is the core program of all DUS activities. DUS has been implementing its major program in partnership with Palli Karma Sahayak Foundation (PKSF) since 2000. It provides collateral free micro-credit to its around 40K+ group members where 97 percent are female. Under this program, DUS has savings scheme for poor women who has no access in mainstream banks due to lack of capital and assets. Most of the targeted beneficiaries of DUS are poor women, marginal farmers and small micro entrepreneurs. Major borrowers are women who used these loan funds to promote various income generating activities for their earnings and employments. As a result, micro finance program has positive impact on poverty reduction especially at grass root level, income enhancement, consumption, the promotion of rural businesses, education and health and finally the empowerment of women and their employment in rural island communities.',
            'image' => 'https://placehold.co/750x450',
            'slug' => 'invest-in-kindness-reap-a-better-future',
            'tags' => ['Kindness', 'Future', 'Investment'],
            'createdBy' => 'Admin',
            'timerRead' => '5 min read'
          ],
          'blogPosts' => [
            ['id' => 2, 'date' => 'June 5, 2023', 'title' => 'How Technology is Changing Education', 'description' => 'Lorem Ipsum is simply dummy text of the printing and typesetting industry...', 'image' => 'https://placehold.co/420x250', 'slug' => 'how-technology-is-changing-education', 'tags' => ['Technology'], 'createdBy' => 'Admin', 'timerRead' => '4 min read'],
            ['id' => 3, 'date' => 'June 4, 2023', 'title' => 'Sustainable Living: Small Changes, Big Impact', 'description' => 'Lorem Ipsum is simply dummy text of the printing and typesetting industry...', 'image' => 'https://placehold.co/420x250', 'slug' => 'sustainable-living', 'tags' => ['Sustainability'], 'createdBy' => 'Admin', 'timerRead' => '6 min read'],
            ['id' => 4, 'date' => 'June 3, 2023', 'title' => 'The Future of Remote Work', 'description' => 'Lorem Ipsum is simply dummy text of the printing and typesetting industry...', 'image' => 'https://placehold.co/420x250', 'slug' => 'future-of-remote-work', 'tags' => ['Work'], 'createdBy' => 'Admin', 'timerRead' => '5 min read'],
            ['id' => 5, 'date' => 'June 2, 2023', 'title' => 'Mental Health Awareness in the Workplace', 'description' => 'Lorem Ipsum is simply dummy text of the printing and typesetting industry...', 'image' => 'https://placehold.co/420x250', 'slug' => 'mental-health-awareness-in-the-workplace', 'tags' => ['Health'], 'createdBy' => 'Admin', 'timerRead' => '7 min read'],
            ['id' => 6, 'date' => 'June 1, 2023', 'title' => 'Innovations in Renewable Energy', 'description' => 'Lorem Ipsum is simply dummy text of the printing and typesetting industry...', 'image' => 'https://placehold.co/420x250', 'slug' => 'innovations-in-renewable-energy', 'tags' => ['Energy'], 'createdBy' => 'Admin', 'timerRead' => '5 min read'],
            ['id' => 7, 'date' => 'May 31, 2023', 'title' => 'Building a Personal Brand Online', 'description' => 'Lorem Ipsum is simply dummy text of the printing and typesetting industry...', 'image' => 'https://placehold.co/420x250', 'slug' => 'building-a-personal-brand-online', 'tags' => ['Branding'], 'createdBy' => 'Admin', 'timerRead' => '4 min read'],
            ['id' => 8, 'date' => 'May 30, 2023', 'title' => 'The Art of Effective Communication', 'description' => 'Lorem Ipsum is simply dummy text of the printing and typesetting industry...', 'image' => 'https://placehold.co/420x250', 'slug' => 'the-art-of-effective-communication', 'tags' => ['Communication'], 'createdBy' => 'Admin', 'timerRead' => '6 min read'],
            ['id' => 9, 'date' => 'May 29, 2023', 'title' => 'Financial Planning for Young Professionals', 'description' => 'Lorem Ipsum is simply dummy text of the printing and typesetting industry...', 'image' => 'https://placehold.co/420x250', 'slug' => 'financial-planning-for-young-professionals', 'tags' => ['Finance'], 'createdBy' => 'Admin', 'timerRead' => '5 min read'],
            ['id' => 10, 'date' => 'May 28, 2023', 'title' => 'Tech is Changing the World', 'description' => 'Lorem Ipsum is simply dummy text of the printing and typesetting industry...', 'image' => 'https://placehold.co/420x250', 'slug' => 'tech-is-changing-the-world', 'tags' => ['Technology'], 'createdBy' => 'Admin', 'timerRead' => '4 min read']
          ]
        ]),
        'created_at' => now(),
        'updated_at' => now(),
      ],
      // FAQ
      [
        'page_id' => $blogsPage->id,
        'section_id' => $faqSection->id ?? null,
        'section_key' => 'faq',
        'order' => 3,
        'is_special_component' => true,
        'prop_name' => 'faqData',
        'data' => json_encode([
          'section' => [
            'title' => 'Frequently Asked Questions',
            'subtitle' => 'Find answers to common questions about our blog content'
          ],
          'faqs' => [
            ['id' => 1, 'question' => 'What is your mission?', 'answer' => 'Our mission is to help communities through sustainable development...'],
            ['id' => 2, 'question' => 'How often do you publish?', 'answer' => 'We publish new content weekly.'],
            ['id' => 3, 'question' => 'Can I contribute?', 'answer' => 'Yes, contact us with your proposal.']
          ]
        ]),
        'created_at' => now(),
        'updated_at' => now(),
      ],
    ];

    $this->insertPageSections($blogsSections);
    $this->command->info('Blogs page sections seeded successfully!');

    // ============================================
    // BLOG DETAILS PAGES (Individual blog posts)
    // ============================================

    $blogPostsData = [
      'invest-in-kindness-reap-a-better-future' => [
        'title' => 'Invest in Kindness, Reap a Better Future',
        'content' => '<div class="space-y-6"><div><p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Micro finance Program is the core program of all DUS activities. DUS has been implementing its major program in partnership with <strong class="text-[#009BE2]">Palli Karma Sahayak Foundation (PKSF)</strong> since 2000. It provides collateral free micro-credit to its around 40K+ group members where 97 percent are female.</p><p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Under this program, DUS has savings scheme for poor women who has no access in mainstream banks due to lack of capital and assets. Most of the targeted beneficiaries of DUS are poor women, marginal farmers and small micro entrepreneurs.</p><p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Major borrowers are women who used these loan funds to promote various income generating activities for their earnings and employments. As a result, micro finance program has positive impact on poverty reduction especially at grass root level, income enhancement, consumption, the promotion of rural businesses, education and health and finally the empowerment of women and their employment in rural island communities.</p><h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">The Power of Microfinance</h2><p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Microfinance has proven to be one of the most effective tools for poverty alleviation in developing countries. By providing small loans to those who lack access to traditional banking services, we enable families to start businesses, generate income, and build a better future for their children.</p><div class="flex flex-col sm:flex-row gap-12 my-8"><img src="https://placehold.co/460x400" alt="Microfinance beneficiaries" class="w-full sm:w-115 h-100 object-cover rounded-2xl shadow-lg"/><img src="https://placehold.co/460x400" alt="Community empowerment" class="w-full sm:w-115 h-100 object-cover rounded-2xl shadow-lg"/></div><h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Success Stories</h2><p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Take the story of Fatema, a mother of three from Hatiya Island. With a small loan of BDT 15,000, she started a tailoring business. Today, she employs two other women from her community and has been able to send all her children to school.</p><div class="bg-white/50 rounded-lg p-6 mt-6 mb-6"><h3 class="font-600 text-xl sm:text-2xl text-[#080C14] mb-3">Key Impact Statistics</h3><ul class="list-disc pl-6 space-y-2"><li class="font-400 text-base sm:text-lg text-[#333333]">40,000+ active group members</li><li class="font-400 text-base sm:text-lg text-[#333333]">97% female beneficiaries</li><li class="font-400 text-base sm:text-lg text-[#333333]">Over 95% loan recovery rate</li><li class="font-400 text-base sm:text-lg text-[#333333]">Operating in 50+ villages</li><li class="font-400 text-base sm:text-lg text-[#333333]">BDT 50+ crore distributed in loans</li></ul></div><h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Looking Ahead</h2><p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">As we continue to expand our microfinance program, we remain committed to reaching more underserved communities. Your support helps us create lasting change and build a more equitable future for all.</p></div></div>'
      ],
      'how-technology-is-changing-education' => [
        'title' => 'How Technology is Changing Education',
        'content' => '<div class="space-y-6"><div><p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Technology is revolutionizing education in ways we could never have imagined. From digital classrooms to online learning platforms, students now have access to a world of knowledge at their fingertips.</p><p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">In remote areas like Hatiya Island, technology is bridging the gap between rural and urban education. Our <strong class="text-[#009BE2]">Digital Learning Centers</strong> provide students with access to computers, internet connectivity, and online educational resources.</p><h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Key Technological Interventions</h2><ul class="list-disc pl-6 space-y-3 mb-6"><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Computer literacy programs for students and teachers</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Online scholarship applications and tracking systems</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Digital libraries with thousands of e-books and resources</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Virtual tutoring and mentorship programs</li></ul><div class="bg-white/50 rounded-lg p-6 mt-6"><h3 class="font-600 text-xl sm:text-2xl text-[#080C14] mb-3">Impact So Far</h3><ul class="list-disc pl-6 space-y-2"><li class="font-400 text-base sm:text-lg text-[#333333]">1,500+ students trained in basic computer skills</li><li class="font-400 text-base sm:text-lg text-[#333333]">50 teachers equipped with digital teaching tools</li><li class="font-400 text-base sm:text-lg text-[#333333]">10 community ICT centers established</li></ul></div></div></div>'
      ],
      'sustainable-living' => [
        'title' => 'Sustainable Living: Small Changes, Big Impact',
        'content' => '<div class="space-y-6"><div><p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Sustainable living is not just a trend—it\'s a necessity for our planet\'s future. Small changes in our daily habits can collectively make a significant impact on environmental conservation.</p><h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Simple Steps for Sustainable Living</h2><ul class="list-disc pl-6 space-y-3 mb-6"><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Reduce, reuse, and recycle waste materials</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Conserve water and electricity at home</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Support local farmers and sustainable agriculture</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Plant trees and maintain home gardens</li></ul></div></div>'
      ],
      'future-of-remote-work' => [
        'title' => 'The Future of Remote Work',
        'content' => '<div class="space-y-6"><div><p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Remote work has transformed the way we work, offering flexibility, reduced commute times, and new opportunities for work-life balance.</p><p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">As organizations adapt to this new normal, we\'re seeing innovative approaches to collaboration, team building, and productivity measurement.</p><h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Benefits of Remote Work</h2><ul class="list-disc pl-6 space-y-3"><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Increased productivity and employee satisfaction</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Reduced overhead costs for organizations</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Access to global talent pools</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Lower carbon footprint from commuting</li></ul></div></div>'
      ],
      'mental-health-awareness-in-the-workplace' => [
        'title' => 'Mental Health Awareness in the Workplace',
        'content' => '<div class="space-y-6"><div><p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Mental health awareness is becoming increasingly important in today\'s fast-paced work environment. Organizations that prioritize employee well-being see higher productivity, lower turnover, and better overall performance.</p><h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Creating a Supportive Environment</h2><ul class="list-disc pl-6 space-y-3"><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Implement employee assistance programs</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Provide mental health days and flexible schedules</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Train managers to recognize signs of burnout</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Create safe spaces for open conversations</li></ul></div></div>'
      ],
      'innovations-in-renewable-energy' => [
        'title' => 'Innovations in Renewable Energy',
        'content' => '<div class="space-y-6"><div><p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Renewable energy technologies are advancing rapidly, making clean power more accessible and affordable than ever before.</p><h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Emerging Technologies</h2><ul class="list-disc pl-6 space-y-3"><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Solar panel efficiency improvements</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Offshore wind farms</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Tidal and wave energy systems</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Green hydrogen production</li></ul></div></div>'
      ],
      'building-a-personal-brand-online' => [
        'title' => 'Building a Personal Brand Online',
        'content' => '<div class="space-y-6"><div><p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">In the digital age, your personal brand is your most valuable asset. It represents who you are, what you stand for, and the value you bring to others.</p><h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Tips for Building Your Brand</h2><ul class="list-disc pl-6 space-y-3"><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Define your unique value proposition</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Create consistent content across platforms</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Engage authentically with your audience</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Showcase your expertise and achievements</li></ul></div></div>'
      ],
      'the-art-of-effective-communication' => [
        'title' => 'The Art of Effective Communication',
        'content' => '<div class="space-y-6"><div><p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Effective communication is the foundation of strong relationships, whether personal or professional. It involves not just speaking clearly, but also listening actively.</p><h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Key Communication Skills</h2><ul class="list-disc pl-6 space-y-3"><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Active listening and empathy</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Clear and concise messaging</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Non-verbal communication awareness</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Conflict resolution techniques</li></ul></div></div>'
      ],
      'financial-planning-for-young-professionals' => [
        'title' => 'Financial Planning for Young Professionals',
        'content' => '<div class="space-y-6"><div><p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Starting your financial planning early can set you up for long-term success and security. Simple habits today can lead to significant wealth accumulation over time.</p><h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Financial Planning Tips</h2><ul class="list-disc pl-6 space-y-3"><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Create and stick to a budget</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Build an emergency fund</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Start investing early for compound growth</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Pay off high-interest debt strategically</li></ul></div></div>'
      ],
      'tech-is-changing-the-world' => [
        'title' => 'Tech is Changing the World',
        'content' => '<div class="space-y-6"><div><p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Technology is reshaping every aspect of our lives, from how we work and learn to how we connect with others and access services.</p><h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Transformative Technologies</h2><ul class="list-disc pl-6 space-y-3"><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Artificial Intelligence and Machine Learning</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Internet of Things (IoT)</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Blockchain and decentralized systems</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">5G and edge computing</li></ul></div></div>'
      ],
    ];

    foreach ($blogPostsData as $slug => $data) {
      $blogPage = DB::table('pages')
        ->where('slug', $slug)
        ->where('parent_id', $blogsPage->id)
        ->first();

      if ($blogPage) {
        $blogDetailsSections = [
          [
            'page_id' => $blogPage->id,
            'section_id' => $pageBannerSection->id ?? null,
            'section_key' => 'banner',
            'order' => 1,
            'is_special_component' => true,
            'prop_name' => 'bannerData',
            'custom_props' => json_encode(['sectionId' => $slug . '-banner']),
            'data' => json_encode([
              'background' => ['src' => $asset('OurPrograms/db1b2b6eae5fc260b4204f8257dadbd5a7aa0af7.png'), 'alt' => 'Background'],
              'overlay' => ['darkOverlay' => 'bg-black/40 lg:bg-black/70'],
            ]),
            'created_at' => now(),
            'updated_at' => now(),
          ],
          [
            'page_id' => $blogPage->id,
            'section_id' => null,
            'section_key' => 'blog-content',
            'order' => 2,
            'is_special_component' => true,
            'prop_name' => 'blogData',
            'data' => json_encode([
              'title' => $data['title'],
              'fullContent' => $data['content'],
              'date' => 'June 6, 2023',
              'tags' => ['Kindness', 'Future', 'Investment'],
              'createdBy' => 'Admin',
              'timerRead' => '5 min read'
            ]),
            'created_at' => now(),
            'updated_at' => now(),
          ],
          [
            'page_id' => $blogPage->id,
            'section_id' => $storiesSection->id ?? null,
            'section_key' => 'related-blogs',
            'order' => 3,
            'is_special_component' => true,
            'prop_name' => 'relatedBlogs',
            'data' => json_encode([
              [
                'id' => 2,
                'date' => 'June 5, 2023',
                'title' => 'How Technology is Changing Education',
                'description' => 'Discover how digital tools are transforming education...',
                'image' => 'https://placehold.co/420x250',
                'slug' => 'how-technology-is-changing-education',
                'tags' => ['Technology'],
                'createdBy' => 'Admin',
                'timerRead' => '4 min read'
              ],
              [
                'id' => 3,
                'date' => 'June 4, 2023',
                'title' => 'Sustainable Living: Small Changes, Big Impact',
                'description' => 'Learn how simple lifestyle changes can help...',
                'image' => 'https://placehold.co/420x250',
                'slug' => 'sustainable-living',
                'tags' => ['Sustainability'],
                'createdBy' => 'Admin',
                'timerRead' => '6 min read'
              ],
              [
                'id' => 4,
                'date' => 'June 3, 2023',
                'title' => 'The Future of Remote Work',
                'description' => 'Exploring how remote work is reshaping...',
                'image' => 'https://placehold.co/420x250',
                'slug' => 'future-of-remote-work',
                'tags' => ['Work'],
                'createdBy' => 'Admin',
                'timerRead' => '5 min read'
              ]
            ]),
            'created_at' => now(),
            'updated_at' => now(),
          ],
          [
            'page_id' => $blogPage->id,
            'section_id' => $upcomingEventsSection->id ?? null,
            'section_key' => 'upcoming-events',
            'order' => 4,
            'is_special_component' => true,
            'prop_name' => 'upcomingEventsData',
            'data' => json_encode([
              'section' => [
                'title' => 'Upcoming Events & Community Actions',
                'description' => 'Join us at our upcoming events',
                'button' => ['text' => 'Explore All Events', 'link' => '/events']
              ],
              'image' => ['src' => $asset('UpcomingEvent/8107b01ed92d05bd5a6861d1ca3a78ccbffc6289.webp'), 'alt' => 'Events Image', 'className' => 'mt-15 rounded-2xl h-139.25 w-auto'],
              'events' => [
                [
                  'id' => 1,
                  'date' => ['day' => '25', 'month' => 'Apr', 'weekday' => 'THU', 'dayNumber' => '1', 'time' => '10:30AM'],
                  'location' => 'International Convention City Bashundhara - ICCB',
                  'title' => 'Participate in our community clean-up day',
                  'description' => 'Let\'s shape the future together!',
                  'link' => '/events/community-cleanup'
                ]
              ]
            ]),
            'created_at' => now(),
            'updated_at' => now(),
          ],
        ];

        $this->insertPageSections($blogDetailsSections);
        $this->command->info($slug . ' blog page sections seeded successfully!');
      }
    }

    // ============================================
    // PROJECTS & PROGRAMS PAGE SECTIONS
    // ============================================

    $projectsSections = [
      // Banner
      [
        'page_id' => $projectsPage->id,
        'section_id' => $pageBannerSection->id ?? null,
        'section_key' => 'banner',
        'order' => 1,
        'is_special_component' => true,
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
        'section_id' => $ourProgramsSection->id ?? null,
        'section_key' => 'our-programs',
        'order' => 2,
        'is_special_component' => true,
        'prop_name' => 'ourProgramsData',
        'data' => json_encode([
          'programs' => [
            [
              'id' => 1,
              'title' => 'Micro-Finance <br /> Program',
              'description' => '<div class="space-y-4"><p>Micro finance Program is the core program of all DUS activities. DUS has been implementing its major program in partnership with <strong class="text-[#009BE2]">Palli Karma Sahayak Foundation (PKSF)</strong> since 2000. It provides collateral free micro-credit to its around 40K+ group members where 97 percent are female.</p><div class="bg-white/50 rounded-lg p-4"><h4 class="font-600 text-[18px] mb-2">Key Achievements:</h4><ul><li>40,000+ active group members</li><li>97% female beneficiaries</li><li>Over 95% loan recovery rate</li></ul></div></div>',
              'image' => $asset('OurPrograms/945e2496664a40b12a1cddd6561e954cdc78e255.webp'),
              'bgColor' => 'bg-[#E6F3E7]',
              'link' => '/projects-programs/micro-finance'
            ],
            [
              'id' => 2,
              'title' => 'Climate Change and <br /> Disaster Management',
              'description' => '<div class="space-y-4"><p>DUS is geographically located at very exposed disaster risk area of Coastal Bangladesh. DUS is now moving beyond relief and rehabilitation into <strong class="text-[#009BE2]">institutionalized preparedness, risk reduction and management interventions</strong>.</p><div class="bg-white/50 rounded-lg p-4"><h4 class="font-600 text-[18px] mb-2">Program Components:</h4><ul><li>Early warning systems</li><li>Cyclone shelter management</li><li>Climate-resilient agriculture</li></ul></div></div>',
              'image' => $asset('OurPrograms/a03fa6dba9fcdac0a5aedf2d337b118228a03298.webp'),
              'bgColor' => 'bg-[#F3EDE6]',
              'link' => '/projects-programs/climate-change'
            ],
            [
              'id' => 3,
              'title' => 'Community Radio',
              'description' => '<div class="space-y-4"><p>Strengthening Hatiya Island community for pioneering-connecting and empowering their Voice for Change. Bangladesh is the <strong class="text-[#009BE2]">2nd country in South Asia</strong> in formulating policy for Community Radio.</p><ul><li>Agricultural information broadcasts</li><li>Health awareness programs</li><li>Women empowerment shows</li></ul></div>',
              'image' => $asset('OurPrograms/e280b627b1771904c38022aac2566b932e248887.webp'),
              'bgColor' => 'bg-[#E8E6F3]',
              'link' => '/projects-programs/community-radio'
            ],
            [
              'id' => 4,
              'title' => 'Research and <br /> Documentation',
              'description' => '<div class="space-y-4"><p>DUS has a strong <strong class="text-[#009BE2]">Research and Documentation Cell</strong> to conduct quality research in diverse areas of human and social development sectors.</p><ul><li>Baseline surveys</li><li>Impact evaluation studies</li><li>Documentation of best practices</li></ul></div>',
              'image' => $asset('OurPrograms/a496922a3fc00992b6c454822d60bde51dc001e5.webp'),
              'bgColor' => 'bg-[#F3E6EA]',
              'link' => '/projects-programs/research-documentation'
            ],
            [
              'id' => 5,
              'title' => 'WATSAN <br /> Program',
              'description' => '<div class="space-y-4"><p>Providing sustainable <strong class="text-[#009BE2]">water and sanitation services</strong> to rural communities with support from the Netherland Government.</p><div class="bg-white/50 rounded-lg p-4"><h4 class="font-600 text-[18px] mb-2">Targets:</h4><ul><li>4,605 households with sanitation</li><li>250 deep tube wells</li><li>20,000 people with hygiene education</li></ul></div></div>',
              'image' => $asset('OurPrograms/be14c45848898048e7b7832affc4dc713b032e10.webp'),
              'bgColor' => 'bg-[#F2F3E6]',
              'link' => '/projects-programs/watsan'
            ]
          ]
        ]),
        'created_at' => now(),
        'updated_at' => now(),
      ],
      // FAQ
      [
        'page_id' => $projectsPage->id,
        'section_id' => $faqSection->id ?? null,
        'section_key' => 'faq',
        'order' => 3,
        'is_special_component' => true,
        'prop_name' => 'faqData',
        'data' => json_encode([
          'section' => [
            'title' => 'Frequently Asked Questions About Our Programs',
            'subtitle' => 'Learn more about our programs and how you can get involved'
          ],
          'faqs' => [
            ['id' => 1, 'question' => 'How can I participate in your programs?', 'answer' => 'You can participate by becoming a volunteer, donor, or partner organization.'],
            ['id' => 2, 'question' => 'Who is eligible for micro-finance support?', 'answer' => 'Our micro-finance program primarily serves poor women, marginal farmers, and small micro-entrepreneurs.'],
            ['id' => 3, 'question' => 'How do you ensure program sustainability?', 'answer' => 'We ensure sustainability through community ownership, capacity building, and income generation mechanisms.'],
            ['id' => 4, 'question' => 'Can international donors support your programs?', 'answer' => 'Yes, we welcome international support. DUS is registered with the NGO Affairs Bureau.']
          ]
        ]),
        'created_at' => now(),
        'updated_at' => now(),
      ],
    ];

    $this->insertPageSections($projectsSections);
    $this->command->info('Projects & Programs page sections seeded successfully!');

    // ============================================
    // PROJECT DETAILS PAGES
    // ============================================

    $programsDetailsData = [
      'micro-finance' => [
        'title' => 'Micro-Finance Program',
        'breadcrumb' => 'Micro-Finance Program',
        'content' => '<div class="space-y-6"><div><p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Micro finance Program is the core program of all DUS activities. DUS has been implementing its major program in partnership with <strong class="text-[#009BE2]">Palli Karma Sahayak Foundation (PKSF)</strong> since 2000. It provides collateral free micro-credit to its around 40K+ group members where 97 percent are female.</p><p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Under this program, DUS has savings scheme for poor women who has no access in mainstream banks due to lack of capital and assets. Most of the targeted beneficiaries of DUS are poor women, marginal farmers and small micro entrepreneurs.</p><h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Key Achievements</h2><ul class="list-disc pl-6 space-y-3"><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">40,000+ active group members</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">97% female beneficiaries</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Over 95% loan recovery rate</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Operating in 50+ villages</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">BDT 50+ crore distributed in loans</li></ul><h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Impact on Community</h2><p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">The micro-finance program has significantly contributed to poverty reduction, women empowerment, and economic development in coastal communities.</p></div></div>'
      ],
      'climate-change' => [
        'title' => 'Climate Change and Disaster Management Program',
        'breadcrumb' => 'Climate Change & Disaster Management',
        'content' => '<div class="space-y-6"><div><p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">DUS is geographically located at very exposed disaster risk area of Coastal Bangladesh. DUS is now moving beyond relief and rehabilitation into <strong class="text-[#009BE2]">institutionalized preparedness, risk reduction and management interventions</strong>.</p><h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Program Components</h2><ul class="list-disc pl-6 space-y-3"><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Early warning systems and community preparedness</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Cyclone shelter management and maintenance</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Climate-resilient agriculture practices</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Post-disaster livelihood restoration</li></ul></div></div>'
      ],
      'community-radio' => [
        'title' => 'Community Radio Program',
        'breadcrumb' => 'Community Radio',
        'content' => '<div class="space-y-6"><div><p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Strengthening Hatiya Island community for pioneering-connecting and empowering their Voice for Change. Bangladesh is the <strong class="text-[#009BE2]">2nd country in South Asia</strong> in formulating policy for Community Radio.</p><h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Broadcast Content</h2><ul class="list-disc pl-6 space-y-3"><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Agricultural information and weather updates</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Health awareness and educational programs</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Local news and community announcements</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Women empowerment and youth engagement shows</li></ul></div></div>'
      ],
      'dwip-education' => [
        'title' => 'DWIP Education Program',
        'breadcrumb' => 'Education Program',
        'content' => '<div class="space-y-6"><div><p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Education is the most powerful tool to break the cycle of poverty. DUS\'s Education Program focuses on providing <strong class="text-[#009BE2]">quality education to underprivileged children</strong> in coastal communities.</p><h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Key Interventions</h2><ul class="list-disc pl-6 space-y-3"><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Scholarship programs for 500+ students annually</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">School infrastructure development</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Teacher training and capacity building</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Digital learning centers</li></ul></div></div>'
      ],
      'information-and-communication-technology' => [
        'title' => 'Information and Communication Technology (ICT)',
        'breadcrumb' => 'ICT Program',
        'content' => '<div class="space-y-6"><div><p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Bridging the digital divide in coastal communities through <strong class="text-[#009BE2]">ICT for Development (ICT4D)</strong> initiatives.</p><h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Program Highlights</h2><ul class="list-disc pl-6 space-y-3"><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">15 community ICT centers established</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Digital literacy training for 5,000+ women</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Mobile banking solutions</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Telemedicine services</li></ul></div></div>'
      ],
      'research-and-documentation' => [
        'title' => 'Research and Documentation',
        'breadcrumb' => 'Research & Documentation',
        'content' => '<div class="space-y-6"><div><p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">DUS has a strong <strong class="text-[#009BE2]">Research and Documentation Cell</strong> to conduct quality research in diverse areas of human and social development.</p><h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Research Areas</h2><ul class="list-disc pl-6 space-y-3"><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Baseline surveys and needs assessments</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Impact evaluation studies</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Action research on poverty reduction</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Documentation of best practices</li></ul></div></div>'
      ],
      'livelihood-restoration-project' => [
        'title' => 'Livelihood Restoration Project',
        'breadcrumb' => 'Livelihood Restoration',
        'content' => '<div class="space-y-6"><div><p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">This project focuses on restoring and enhancing livelihood opportunities for communities affected by natural disasters and economic vulnerabilities.</p><h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Livelihood Options</h2><ul class="list-disc pl-6 space-y-3"><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Small business development</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Agricultural diversification</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Livestock rearing</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Handicrafts production</li></ul></div></div>'
      ],
      'group-member-insurance-savings-scheme' => [
        'title' => 'Group Member Insurance & Savings Scheme',
        'breadcrumb' => 'Insurance & Savings Scheme',
        'content' => '<div class="space-y-6"><div><p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">A comprehensive social protection mechanism combining <strong class="text-[#009BE2]">savings and insurance</strong> to provide financial security.</p><h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Benefits</h2><ul class="list-disc pl-6 space-y-3"><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Life insurance coverage up to BDT 50,000</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Health and accident benefits</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Emergency loan facilities</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Children\'s education support</li></ul></div></div>'
      ],
      'social-development-program' => [
        'title' => 'Social Development Program',
        'breadcrumb' => 'Social Development',
        'content' => '<div class="space-y-6"><div><p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Addressing social issues and promoting inclusive development through community mobilization and awareness programs.</p><h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Focus Areas</h2><ul class="list-disc pl-6 space-y-3"><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Women empowerment and leadership</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Child rights and protection</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Prevention of child marriage</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Disability-inclusive development</li></ul></div></div>'
      ],
      'legal-and-human-rights' => [
        'title' => 'Legal and Human Rights',
        'breadcrumb' => 'Legal & Human Rights',
        'content' => '<div class="space-y-6"><div><p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Promoting <strong class="text-[#009BE2]">access to justice and human rights protection</strong> for marginalized communities.</p><h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Services</h2><ul class="list-disc pl-6 space-y-3"><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Free legal aid and counseling</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Human rights awareness campaigns</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Support for victims of violence</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Land rights dispute resolution</li></ul></div></div>'
      ],
      'watsan' => [
        'title' => 'WATSAN Program',
        'breadcrumb' => 'Water & Sanitation',
        'content' => '<div class="space-y-6"><div><p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Providing sustainable <strong class="text-[#009BE2]">water and sanitation services</strong> to rural communities with support from the Netherland Government.</p><h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Targets</h2><ul class="list-disc pl-6 space-y-3"><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">4,605 households with sanitation access</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">250 deep tube wells for safe water</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">20,000 people with hygiene education</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Community-led total sanitation</li></ul></div></div>'
      ],
      'training-and-other-facilities' => [
        'title' => 'Training and Other Facilities',
        'breadcrumb' => 'Training Facilities',
        'content' => '<div class="space-y-6"><div><p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">DUS has developed a comprehensive <strong class="text-[#009BE2]">Training and Communication Unit</strong> fully equipped with all possible physical and human resources.</p><h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Training Offerings</h2><ul class="list-disc pl-6 space-y-3"><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Skill development training</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Leadership and management training</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Financial literacy training</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">ToT programs</li></ul></div></div>'
      ],
      'tourism-and-hospitality' => [
        'title' => 'Tourism and Hospitality',
        'breadcrumb' => 'Tourism & Hospitality',
        'content' => '<div class="space-y-6"><div><p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Promoting <strong class="text-[#009BE2]">sustainable tourism and hospitality</strong> as an emerging livelihood opportunity for coastal communities.</p><h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Initiatives</h2><ul class="list-disc pl-6 space-y-3"><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Homestay and guesthouse development</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Tour guide training</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Handicraft production</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Eco-tourism awareness</li></ul></div></div>'
      ],
    ];

    foreach ($programsDetailsData as $slug => $data) {
      $programPage = DB::table('pages')
        ->where('slug', $slug)
        ->where('parent_id', $projectsPage->id)
        ->first();

      if ($programPage) {
        $programDetailsSections = [
          [
            'page_id' => $programPage->id,
            'section_id' => $pageBannerSection->id ?? null,
            'section_key' => 'banner',
            'order' => 1,
            'is_special_component' => true,
            'prop_name' => 'bannerData',
            'custom_props' => json_encode(['sectionId' => $slug . '-banner']),
            'data' => json_encode([
              'background' => ['src' => $asset('OurPrograms/db1b2b6eae5fc260b4204f8257dadbd5a7aa0af7.png'), 'alt' => 'Background'],
              'overlay' => ['darkOverlay' => 'bg-black/40 lg:bg-black/50', 'gradient' => 'bg-gradient-to-r from-black/85 via-black/10 to-transparent'],
              'content' => ['title' => ['text' => $data['title'], 'className' => 'font-bold leading-tight']]
            ]),
            'created_at' => now(),
            'updated_at' => now(),
          ],
          [
            'page_id' => $programPage->id,
            'section_id' => $heroFigureSection->id ?? null,
            'section_key' => 'program-content',
            'order' => 2,
            'is_special_component' => true,
            'prop_name' => 'programData',
            'data' => json_encode([
              'title' => $data['title'],
              'breadcrumb' => $data['breadcrumb'],
              'content' => $data['content'],
              'image' => $asset('OurPrograms/945e2496664a40b12a1cddd6561e954cdc78e255.webp'),
              'bgColor' => 'bg-[#E6F3E7]'
            ]),
            'created_at' => now(),
            'updated_at' => now(),
          ],
          [
            'page_id' => $programPage->id,
            'section_id' => $faqSection->id ?? null,
            'section_key' => 'faq',
            'order' => 3,
            'is_special_component' => true,
            'prop_name' => 'faqData',
            'data' => json_encode([
              'section' => [
                'title' => 'Frequently Asked Questions',
                'subtitle' => 'Learn more about this program'
              ],
              'faqs' => [
                ['id' => 1, 'question' => 'How can I participate?', 'answer' => 'Contact our office for more information.'],
                ['id' => 2, 'question' => 'Who is eligible?', 'answer' => 'Eligibility varies by program. Please inquire for details.']
              ]
            ]),
            'created_at' => now(),
            'updated_at' => now(),
          ],
          [
            'page_id' => $programPage->id,
            'section_id' => $upcomingEventsSection->id ?? null,
            'section_key' => 'upcoming-events',
            'order' => 4,
            'is_special_component' => true,
            'prop_name' => 'upcomingEventsData',
            'data' => json_encode([
              'section' => [
                'title' => 'Upcoming Events',
                'description' => 'Join us at our upcoming events',
                'button' => ['text' => 'View All Events', 'link' => '/events']
              ],
              'image' => ['src' => $asset('UpcomingEvent/8107b01ed92d05bd5a6861d1ca3a78ccbffc6289.webp'), 'alt' => 'Events'],
              'events' => []
            ]),
            'created_at' => now(),
            'updated_at' => now(),
          ],
        ];

        $this->insertPageSections($programDetailsSections);
        $this->command->info($slug . ' program page sections seeded successfully!');
      }
    }

    $this->command->info('All page sections seeded successfully! 🎉');
  }
}
