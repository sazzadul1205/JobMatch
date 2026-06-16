<?php
// database/seeders/CMS/BlogsTableSeeder.php

namespace Database\Seeders\CMS;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class BlogsTableSeeder extends Seeder
{
    public function run()
    {
        // Truncate table first
        Schema::disableForeignKeyConstraints();
        DB::table('blogs')->truncate();
        Schema::enableForeignKeyConstraints();

        $blogs = [
            // Blog 1
            [
                'id' => 1,
                'slug' => 'invest-in-kindness-reap-a-better-future',
                'title' => 'Invest in Kindness, Reap a Better Future',
                'excerpt' => 'Micro finance Program is the core program of all DUS activities. DUS has been implementing its major program in partnership with Palli Karma Sahayak Foundation (PKSF) since 2000. It provides collateral free micro-credit to its around 40K+ group members where 97 percent are female. Under this program, DUS has savings scheme for poor women who has no access in mainstream banks due to lack of capital and assets.',
                'content' => '<div class="space-y-6">
                    <div>
                        <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Micro finance Program is the core program of all DUS activities. DUS has been implementing its major program in partnership with <strong class="text-[#009BE2]">Palli Karma Sahayak Foundation (PKSF)</strong> since 2000. It provides collateral free micro-credit to its around 40K+ group members where 97 percent are female.</p>
                        
                        <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Under this program, DUS has savings scheme for poor women who has no access in mainstream banks due to lack of capital and assets. Most of the targeted beneficiaries of DUS are poor women, marginal farmers and small micro entrepreneurs.</p>
                        
                        <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Major borrowers are women who used these loan funds to promote various income generating activities for their earnings and employments. As a result, micro finance program has positive impact on poverty reduction especially at grass root level, income enhancement, consumption, the promotion of rural businesses, education and health and finally the empowerment of women and their employment in rural island communities.</p>
                        
                        <h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">The Power of Microfinance</h2>
                        <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Microfinance has proven to be one of the most effective tools for poverty alleviation in developing countries. By providing small loans to those who lack access to traditional banking services, we enable families to start businesses, generate income, and build a better future for their children.</p>
                        
                        <div class="flex flex-col sm:flex-row gap-12 my-8">
                            <img src="https://placehold.co/460x400" alt="Microfinance beneficiaries" class="w-full sm:w-115 h-100 object-cover rounded-2xl shadow-lg" />
                            <img src="https://placehold.co/460x400" alt="Community empowerment" class="w-full sm:w-115 h-100 object-cover rounded-2xl shadow-lg" />
                        </div>
                        
                        <h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Success Stories</h2>
                        <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Take the story of Fatema, a mother of three from Hatiya Island. With a small loan of BDT 15,000, she started a tailoring business. Today, she employs two other women from her community and has been able to send all her children to school.</p>
                        
                        <div class="bg-white/50 rounded-lg p-6 mt-6 mb-6">
                            <h3 class="font-600 text-xl sm:text-2xl text-[#080C14] mb-3">Key Impact Statistics</h3>
                            <ul class="list-disc pl-6 space-y-2">
                                <li class="font-400 text-base sm:text-lg text-[#333333]">40,000+ active group members</li>
                                <li class="font-400 text-base sm:text-lg text-[#333333]">97% female beneficiaries</li>
                                <li class="font-400 text-base sm:text-lg text-[#333333]">Over 95% loan recovery rate</li>
                                <li class="font-400 text-base sm:text-lg text-[#333333]">Operating in 50+ villages</li>
                                <li class="font-400 text-base sm:text-lg text-[#333333]">BDT 50+ crore distributed in loans</li>
                            </ul>
                        </div>
                        
                        <h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Looking Ahead</h2>
                        <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">As we continue to expand our microfinance program, we remain committed to reaching more underserved communities. Your support helps us create lasting change and build a more equitable future for all.</p>
                    </div>
                </div>',
                'image' => 'https://placehold.co/750x450',
                'date' => '2023-06-06',
                'created_by' => 'Admin',
                'timer_read' => '5 min read',
                'is_published' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Blog 2
            [
                'id' => 2,
                'slug' => 'how-technology-is-changing-education',
                'title' => 'How Technology is Changing Education',
                'excerpt' => 'Technology is revolutionizing education in ways we could never have imagined. From digital classrooms to online learning platforms, students now have access to a world of knowledge at their fingertips.',
                'content' => '<div class="space-y-6">
                    <div>
                        <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Technology is revolutionizing education in ways we could never have imagined. From digital classrooms to online learning platforms, students now have access to a world of knowledge at their fingertips.</p>
                        
                        <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">In remote areas like Hatiya Island, technology is bridging the gap between rural and urban education. Our <strong class="text-[#009BE2]">Digital Learning Centers</strong> provide students with access to computers, internet connectivity, and online educational resources.</p>
                        
                        <h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Key Technological Interventions</h2>
                        <ul class="list-disc pl-6 space-y-3 mb-6">
                            <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Computer literacy programs for students and teachers</li>
                            <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Online scholarship applications and tracking systems</li>
                            <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Digital libraries with thousands of e-books and resources</li>
                            <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Virtual tutoring and mentorship programs</li>
                        </ul>
                        
                        <div class="bg-white/50 rounded-lg p-6 mt-6">
                            <h3 class="font-600 text-xl sm:text-2xl text-[#080C14] mb-3">Impact So Far</h3>
                            <ul class="list-disc pl-6 space-y-2">
                                <li class="font-400 text-base sm:text-lg text-[#333333]">1,500+ students trained in basic computer skills</li>
                                <li class="font-400 text-base sm:text-lg text-[#333333]">50 teachers equipped with digital teaching tools</li>
                                <li class="font-400 text-base sm:text-lg text-[#333333]">10 community ICT centers established</li>
                            </ul>
                        </div>
                        
                        <h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">The Future of Digital Learning</h2>
                        <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">As we continue to invest in technology-enabled education, we envision a future where every child, regardless of their geographical location, has access to quality learning resources and opportunities for growth.</p>
                    </div>
                </div>',
                'image' => 'https://placehold.co/750x450',
                'date' => '2023-06-05',
                'created_by' => 'Admin',
                'timer_read' => '4 min read',
                'is_published' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Blog 3
            [
                'id' => 3,
                'slug' => 'sustainable-living-small-changes-big-impact',
                'title' => 'Sustainable Living: Small Changes, Big Impact',
                'excerpt' => 'Learn how simple lifestyle changes can contribute to environmental sustainability and community well-being.',
                'content' => '<div class="space-y-6">
                    <div>
                        <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Sustainable living is not just a trend—it\'s a necessity for our planet\'s future. Small changes in our daily habits can collectively make a significant impact on environmental conservation.</p>
                        
                        <h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Simple Steps for Sustainable Living</h2>
                        <ul class="list-disc pl-6 space-y-3 mb-6">
                            <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Reduce, reuse, and recycle waste materials</li>
                            <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Conserve water and electricity at home</li>
                            <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Support local farmers and sustainable agriculture</li>
                            <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Plant trees and maintain home gardens</li>
                        </ul>
                        
                        <div class="flex flex-col sm:flex-row gap-8 my-8">
                            <img src="https://placehold.co/400x300" alt="Sustainable farming" class="w-full sm:w-1/2 object-cover rounded-2xl" />
                            <img src="https://placehold.co/400x300" alt="Recycling initiative" class="w-full sm:w-1/2 object-cover rounded-2xl" />
                        </div>
                        
                        <h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Community-Led Initiatives</h2>
                        <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">DUS has launched several community-led sustainability projects, including tree planting campaigns, waste management programs, and awareness workshops on environmental conservation.</p>
                        
                        <div class="bg-white/50 rounded-lg p-6 mt-6">
                            <h3 class="font-600 text-xl sm:text-2xl text-[#080C14] mb-3">Our Environmental Achievements</h3>
                            <ul class="list-disc pl-6 space-y-2">
                                <li class="font-400 text-base sm:text-lg text-[#333333]">10,000+ trees planted in coastal areas</li>
                                <li class="font-400 text-base sm:text-lg text-[#333333]">50+ community awareness workshops conducted</li>
                                <li class="font-400 text-base sm:text-lg text-[#333333]">100+ households practicing composting</li>
                            </ul>
                        </div>
                    </div>
                </div>',
                'image' => 'https://placehold.co/750x450',
                'date' => '2023-06-04',
                'created_by' => 'Admin',
                'timer_read' => '6 min read',
                'is_published' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Blog 4
            [
                'id' => 4,
                'slug' => 'the-future-of-remote-work',
                'title' => 'The Future of Remote Work',
                'excerpt' => 'Exploring how remote work is reshaping the modern workplace and creating new opportunities for professionals worldwide.',
                'content' => '<div class="space-y-6">
                    <div>
                        <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">The COVID-19 pandemic accelerated the adoption of remote work, transforming how businesses operate and how employees balance their professional and personal lives.</p>
                        
                        <h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Benefits of Remote Work</h2>
                        <ul class="list-disc pl-6 space-y-3 mb-6">
                            <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Increased flexibility and work-life balance</li>
                            <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Reduced commute time and associated stress</li>
                            <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Access to a global talent pool for employers</li>
                            <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Lower overhead costs for businesses</li>
                        </ul>
                        
                        <div class="bg-white/50 rounded-lg p-6 mt-6">
                            <h3 class="font-600 text-xl sm:text-2xl text-[#080C14] mb-3">Remote Work Statistics</h3>
                            <ul class="list-disc pl-6 space-y-2">
                                <li class="font-400 text-base sm:text-lg text-[#333333]">74% of professionals expect remote work to become standard</li>
                                <li class="font-400 text-base sm:text-lg text-[#333333]">Companies save an average of $11,000 per remote employee annually</li>
                                <li class="font-400 text-base sm:text-lg text-[#333333]">85% of businesses plan to continue hybrid work models</li>
                            </ul>
                        </div>
                    </div>
                </div>',
                'image' => 'https://placehold.co/750x450',
                'date' => '2023-06-03',
                'created_by' => 'Admin',
                'timer_read' => '5 min read',
                'is_published' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Blog 5
            [
                'id' => 5,
                'slug' => 'mental-health-awareness-in-the-workplace',
                'title' => 'Mental Health Awareness in the Workplace',
                'excerpt' => 'Understanding the importance of mental health support and wellness programs in creating a healthy work environment.',
                'content' => '<div class="space-y-6">
                    <div>
                        <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Mental health awareness in the workplace has gained significant attention in recent years, with organizations recognizing the importance of supporting employee well-being.</p>
                        
                        <div class="bg-white/50 rounded-lg p-6 mt-6">
                            <h3 class="font-600 text-xl sm:text-2xl text-[#080C14] mb-3">Employer Best Practices</h3>
                            <ul class="list-disc pl-6 space-y-2">
                                <li class="font-400 text-base sm:text-lg text-[#333333]">Offer employee assistance programs (EAPs)</li>
                                <li class="font-400 text-base sm:text-lg text-[#333333]">Provide mental health days and flexible schedules</li>
                                <li class="font-400 text-base sm:text-lg text-[#333333]">Train managers in mental health first aid</li>
                                <li class="font-400 text-base sm:text-lg text-[#333333]">Create a stigma-free culture through open dialogue</li>
                            </ul>
                        </div>
                    </div>
                </div>',
                'image' => 'https://placehold.co/750x450',
                'date' => '2023-06-02',
                'created_by' => 'Admin',
                'timer_read' => '7 min read',
                'is_published' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Blog 6
            [
                'id' => 6,
                'slug' => 'innovations-in-renewable-energy',
                'title' => 'Innovations in Renewable Energy',
                'excerpt' => 'Exploring the latest breakthroughs in solar, wind, and other renewable energy technologies shaping our sustainable future.',
                'content' => '<div class="space-y-6">
                    <div>
                        <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Renewable energy technologies are advancing rapidly, offering sustainable alternatives to fossil fuels and helping combat climate change.</p>
                        
                        <div class="bg-white/50 rounded-lg p-6 mt-6">
                            <h3 class="font-600 text-xl sm:text-2xl text-[#080C14] mb-3">Global Impact</h3>
                            <ul class="list-disc pl-6 space-y-2">
                                <li class="font-400 text-base sm:text-lg text-[#333333]">Renewable energy jobs reached 12 million globally</li>
                                <li class="font-400 text-base sm:text-lg text-[#333333]">Solar and wind are now cheapest energy sources in many regions</li>
                                <li class="font-400 text-base sm:text-lg text-[#333333]">Electric vehicle adoption is accelerating rapidly</li>
                            </ul>
                        </div>
                    </div>
                </div>',
                'image' => 'https://placehold.co/750x450',
                'date' => '2023-06-01',
                'created_by' => 'Admin',
                'timer_read' => '5 min read',
                'is_published' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Blog 7
            [
                'id' => 7,
                'slug' => 'building-a-personal-brand-online',
                'title' => 'Building a Personal Brand Online',
                'excerpt' => 'Strategies and tips for creating a compelling personal brand in the digital age to advance your career.',
                'content' => '<div class="space-y-6">
                    <div>
                        <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Building a personal brand online has become essential for career advancement and professional opportunities in the digital age.</p>
                        
                        <div class="bg-white/50 rounded-lg p-6 mt-6">
                            <h3 class="font-600 text-xl sm:text-2xl text-[#080C14] mb-3">Platforms for Personal Branding</h3>
                            <ul class="list-disc pl-6 space-y-2">
                                <li class="font-400 text-base sm:text-lg text-[#333333]">LinkedIn for professional networking</li>
                                <li class="font-400 text-base sm:text-lg text-[#333333]">Twitter for industry commentary</li>
                                <li class="font-400 text-base sm:text-lg text-[#333333]">Medium or personal blog for thought leadership</li>
                                <li class="font-400 text-base sm:text-lg text-[#333333]">YouTube or podcast for video/audio content</li>
                            </ul>
                        </div>
                    </div>
                </div>',
                'image' => 'https://placehold.co/750x450',
                'date' => '2023-05-31',
                'created_by' => 'Admin',
                'timer_read' => '4 min read',
                'is_published' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Blog 8
            [
                'id' => 8,
                'slug' => 'the-art-of-effective-communication',
                'title' => 'The Art of Effective Communication',
                'excerpt' => 'Mastering communication skills to enhance personal and professional relationships in today\'s interconnected world.',
                'content' => '<div class="space-y-6">
                    <div>
                        <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Effective communication is a critical skill that impacts every aspect of our lives, from personal relationships to professional success.</p>
                        
                        <div class="bg-white/50 rounded-lg p-6 mt-6">
                            <h3 class="font-600 text-xl sm:text-2xl text-[#080C14] mb-3">Communication in the Digital Age</h3>
                            <ul class="list-disc pl-6 space-y-2">
                                <li class="font-400 text-base sm:text-lg text-[#333333]">Email etiquette and professionalism</li>
                                <li class="font-400 text-base sm:text-lg text-[#333333]">Virtual meeting best practices</li>
                                <li class="font-400 text-base sm:text-lg text-[#333333]">Collaboration tools (Slack, Teams, Zoom)</li>
                                <li class="font-400 text-base sm:text-lg text-[#333333]">Cross-cultural communication</li>
                            </ul>
                        </div>
                    </div>
                </div>',
                'image' => 'https://placehold.co/750x450',
                'date' => '2023-05-30',
                'created_by' => 'Admin',
                'timer_read' => '6 min read',
                'is_published' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Blog 9
            [
                'id' => 9,
                'slug' => 'financial-planning-for-young-professionals',
                'title' => 'Financial Planning for Young Professionals',
                'excerpt' => 'Essential financial planning strategies for young professionals to build wealth and secure their financial future.',
                'content' => '<div class="space-y-6">
                    <div>
                        <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Financial planning is crucial for young professionals to build wealth, achieve financial independence, and secure their future.</p>
                        
                        <div class="bg-white/50 rounded-lg p-6 mt-6">
                            <h3 class="font-600 text-xl sm:text-2xl text-[#080C14] mb-3">Investment Options for Beginners</h3>
                            <ul class="list-disc pl-6 space-y-2">
                                <li class="font-400 text-base sm:text-lg text-[#333333]">401(k) or employer retirement plans</li>
                                <li class="font-400 text-base sm:text-lg text-[#333333]">Index funds and ETFs</li>
                                <li class="font-400 text-base sm:text-lg text-[#333333]">High-yield savings accounts</li>
                                <li class="font-400 text-base sm:text-lg text-[#333333]">Real estate investment trusts (REITs)</li>
                            </ul>
                        </div>
                    </div>
                </div>',
                'image' => 'https://placehold.co/750x450',
                'date' => '2023-05-29',
                'created_by' => 'Admin',
                'timer_read' => '5 min read',
                'is_published' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Blog 10
            [
                'id' => 10,
                'slug' => 'tech-is-changing-the-world',
                'title' => 'Tech is Changing the World',
                'excerpt' => 'How technological innovations are transforming industries, societies, and the way we live and work globally.',
                'content' => '<div class="space-y-6">
                    <div>
                        <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Technology is fundamentally reshaping our world, from how we work and communicate to how we access information and healthcare.</p>
                        
                        <div class="bg-white/50 rounded-lg p-6 mt-6">
                            <h3 class="font-600 text-xl sm:text-2xl text-[#080C14] mb-3">Technology Impact by Sector</h3>
                            <ul class="list-disc pl-6 space-y-2">
                                <li class="font-400 text-base sm:text-lg text-[#333333]">Healthcare: Telemedicine and AI diagnostics</li>
                                <li class="font-400 text-base sm:text-lg text-[#333333]">Education: Online learning and VR training</li>
                                <li class="font-400 text-base sm:text-lg text-[#333333]">Finance: Digital payments and robo-advisors</li>
                                <li class="font-400 text-base sm:text-lg text-[#333333]">Transportation: Autonomous vehicles and ride-sharing</li>
                            </ul>
                        </div>
                    </div>
                </div>',
                'image' => 'https://placehold.co/750x450',
                'date' => '2023-05-28',
                'created_by' => 'Admin',
                'timer_read' => '4 min read',
                'is_published' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('blogs')->insert($blogs);

        $this->command->info('BlogsTableSeeder completed. Inserted ' . count($blogs) . ' blogs.');
    }
}
