<?php
// database/seeders/CMS/ProgramsTableSeeder.php

namespace Database\Seeders\CMS;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class ProgramsTableSeeder extends Seeder
{
    public function run()
    {
        // Truncate table first
        Schema::disableForeignKeyConstraints();
        DB::table('programs')->truncate();
        Schema::enableForeignKeyConstraints();

        $assetBase = '/storage';

        $programs = [
            // Program 1: Micro-Finance
            [
                'id' => 1,
                'slug' => 'micro-finance',
                'title' => 'Micro-Finance Program',
                'breadcrumb' => 'Micro-Finance Program',
                'excerpt' => '<div class="space-y-4">
                    <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#524B48] leading-relaxed">Micro finance Program is the core program of all DUS activities. DUS has been implementing its major program in partnership with <strong class="text-[#009BE2]">Palli Karma Sahayak Foundation (PKSF)</strong> since 2000. It provides collateral free micro-credit to its around 40K+ group members where 97 percent are female.</p>
                    
                    <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#524B48] leading-relaxed">Under this program, DUS has savings scheme for poor women who has no access in mainstream banks due to lack of capital and assets. Most of the targeted beneficiaries of DUS are poor women, marginal farmers and small micro entrepreneurs.</p>
                    
                    <div class="bg-white/50 rounded-lg p-4 mt-4">
                        <h4 class="font-600 text-[18px] sm:text-[20px] text-[#080C14] mb-2">Key Achievements:</h4>
                        <ul class="list-disc pl-5 space-y-1">
                            <li class="text-[14px] sm:text-[16px] text-[#524B48]">40,000+ active group members</li>
                            <li class="text-[14px] sm:text-[16px] text-[#524B48]">97% female beneficiaries</li>
                            <li class="text-[14px] sm:text-[16px] text-[#524B48]">Over 95% loan recovery rate</li>
                            <li class="text-[14px] sm:text-[16px] text-[#524B48]">Operating in 50+ villages</li>
                        </ul>
                    </div>
                </div>',
                'full_content' => '<div class="space-y-6">
                    <div>
                        <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Micro finance Program is the core program of all DUS activities. DUS has been implementing its major program in partnership with <strong class="text-[#009BE2]">Palli Karma Sahayak Foundation (PKSF)</strong> since 2000. It provides collateral free micro-credit to its around 40K+ group members where 97 percent are female.</p>
                        
                        <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Under this program, DUS has savings scheme for poor women who has no access in mainstream banks due to lack of capital and assets. Most of the targeted beneficiaries of DUS are poor women, marginal farmers and small micro entrepreneurs.</p>
                        
                        <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Major borrowers are women who used these loan funds to promote various income generating activities for their earnings and employments. As a result, micro finance program has positive impact on poverty reduction especially at grass root level, income enhancement, consumption, the promotion of rural businesses, education and health and finally the empowerment of women and their employment in rural island communities.</p>
                        
                        <h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Key Achievements</h2>
                        <ul class="list-disc pl-6 space-y-3">
                            <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">40,000+ active group members</li>
                            <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">97% female beneficiaries</li>
                            <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Over 95% loan recovery rate</li>
                            <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Operating in 50+ villages</li>
                            <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">BDT 50+ crore distributed in loans</li>
                        </ul>
                        
                        <h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Impact on Community</h2>
                        <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">The micro-finance program has significantly contributed to poverty reduction, women empowerment, and economic development in coastal communities.</p>
                    </div>
                </div>',
                'image' => $assetBase . '/OurPrograms/945e2496664a40b12a1cddd6561e954cdc78e255.webp',
                'bg_color' => 'bg-[#E6F3E7]',
                'order' => 1,
                'is_published' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Program 2: Climate Change
            [
                'id' => 2,
                'slug' => 'climate-change',
                'title' => 'Climate Change and Disaster Management Program',
                'breadcrumb' => 'Climate Change & Disaster Management',
                'excerpt' => '<div class="space-y-4">
                    <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#524B48] leading-relaxed">DUS is geographically located at very exposed disaster risk area of Coastal Bangladesh, most of its beneficiaries as well as core staffs of the organization and volunteers including general members are experienced by the influence of topography & living experience with the community, to cope with and face any natural disaster.</p>
                    
                    <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#524B48] leading-relaxed">DUS is now moving beyond relief and rehabilitation into <strong class="text-[#009BE2]">institutionalized preparedness, risk reduction and management interventions</strong> as well as long term adaptation strategies.</p>
                    
                    <div class="bg-white/50 rounded-lg p-4 mt-4">
                        <h4 class="font-600 text-[18px] sm:text-[20px] text-[#080C14] mb-2">Program Components:</h4>
                        <ul class="list-disc pl-5 space-y-1">
                            <li class="text-[14px] sm:text-[16px] text-[#524B48]">Early warning systems and community preparedness</li>
                            <li class="text-[14px] sm:text-[16px] text-[#524B48]">Cyclone shelter management and maintenance</li>
                            <li class="text-[14px] sm:text-[16px] text-[#524B48]">Climate-resilient agriculture practices</li>
                        </ul>
                    </div>
                </div>',
                'full_content' => '<div class="space-y-6">
                    <div>
                        <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">DUS is geographically located at very exposed disaster risk area of Coastal Bangladesh, most of its beneficiaries as well as core staffs of the organization and volunteers including general members are experienced by the influence of topography & living experience with the community, to cope with and face any natural disaster.</p>
                        
                        <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Further during its lifetime DUS was active in major emergency in relief and rehabilitation programs following Nov. 1970 cyclone relief, 1988/1991-cyclone recovery, 1998 flood response, SIDR 2007 etc.</p>
                        
                        <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">DUS is now moving beyond relief and rehabilitation into <strong class="text-[#009BE2]">institutionalized preparedness, risk reduction and management interventions</strong> as well as long term adaptation strategies as consequence of lessons learnt while helping communities cope with the devastating effects of Cyclone SIDR, which struck in November 2007.</p>
                        
                        <h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Program Components</h2>
                        <ul class="list-disc pl-6 space-y-3">
                            <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Early warning systems and community preparedness</li>
                            <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Cyclone shelter management and maintenance</li>
                            <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Climate-resilient agriculture practices</li>
                            <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Post-disaster livelihood restoration</li>
                        </ul>
                    </div>
                </div>',
                'image' => $assetBase . '/OurPrograms/a03fa6dba9fcdac0a5aedf2d337b118228a03298.webp',
                'bg_color' => 'bg-[#F3EDE6]',
                'order' => 2,
                'is_published' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Program 3: Community Radio
            [
                'id' => 3,
                'slug' => 'community-radio',
                'title' => 'Community Radio Program',
                'breadcrumb' => 'Community Radio',
                'excerpt' => '<div class="space-y-4">
                    <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#524B48] leading-relaxed">Strengthening Hatiya Island community for pioneering-connecting and empowering their Voice for Change. Bangladesh is the <strong class="text-[#009BE2]">2nd country in South Asia</strong> in formulating policy for Community Radio.</p>
                    
                    <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#524B48] leading-relaxed">The community radio serves as a platform for disseminating agricultural information, health awareness, local news, and women empowerment programs.</p>
                </div>',
                'full_content' => '<div class="space-y-6">
                    <div>
                        <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Strengthening Hatiya Island community for pioneering-connecting and empowering their Voice for Change. Bangladesh Government has already acknowledged the importance of community radio and announced the Community Radio Installation, Broadcast & Operation Policy.</p>
                        
                        <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Bangladesh is the <strong class="text-[#009BE2]">2nd country in South Asia</strong> in formulating policy for Community Radio. This initiative gives voice to the voiceless and empowers local communities to share their stories, concerns, and aspirations.</p>
                        
                        <h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Broadcast Content</h2>
                        <ul class="list-disc pl-6 space-y-3">
                            <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Agricultural information and weather updates</li>
                            <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Health awareness and educational programs</li>
                            <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Local news and community announcements</li>
                            <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Women empowerment and youth engagement shows</li>
                        </ul>
                    </div>
                </div>',
                'image' => $assetBase . '/OurPrograms/e280b627b1771904c38022aac2566b932e248887.webp',
                'bg_color' => 'bg-[#E8E6F3]',
                'order' => 3,
                'is_published' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Program 4: Education
            [
                'id' => 4,
                'slug' => 'dwip-education',
                'title' => 'DWIP Education Program',
                'breadcrumb' => 'Education Program',
                'excerpt' => '<div class="space-y-4">
                    <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#524B48] leading-relaxed">Education is the most powerful tool to break the cycle of poverty. DUS\'s Education Program focuses on providing <strong class="text-[#009BE2]">quality education to underprivileged children</strong> in coastal communities.</p>
                </div>',
                'full_content' => '<div class="space-y-6">
                    <div>
                        <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Education is the most powerful tool to break the cycle of poverty. DUS\'s Education Program focuses on providing <strong class="text-[#009BE2]">quality education to underprivileged children</strong> in coastal communities.</p>
                        
                        <h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Key Interventions</h2>
                        <ul class="list-disc pl-6 space-y-3">
                            <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Scholarship programs for 500+ students annually</li>
                            <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">School infrastructure development in remote areas</li>
                            <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Teacher training and capacity building</li>
                            <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Distribution of educational materials and supplies</li>
                        </ul>
                    </div>
                </div>',
                'image' => $assetBase . '/OurPrograms/42ccde89743ee9405c6546567e02dfbb36759866.jpg',
                'bg_color' => 'bg-[#EEF3E6]',
                'order' => 4,
                'is_published' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Program 5: ICT
            [
                'id' => 5,
                'slug' => 'information-and-communication-technology',
                'title' => 'Information and Communication Technology (ICT)',
                'breadcrumb' => 'ICT Program',
                'excerpt' => '<div class="space-y-4">
                    <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#524B48] leading-relaxed">Bridging the digital divide in coastal communities through <strong class="text-[#009BE2]">ICT for Development (ICT4D)</strong> initiatives.</p>
                </div>',
                'full_content' => '<div class="space-y-6">
                    <div>
                        <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Bridging the digital divide in coastal communities through <strong class="text-[#009BE2]">ICT for Development (ICT4D)</strong> initiatives.</p>
                        
                        <h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Program Highlights</h2>
                        <ul class="list-disc pl-6 space-y-3">
                            <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">15 community ICT centers established</li>
                            <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Digital literacy training for 5,000+ women</li>
                            <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Mobile banking and digital payment solutions</li>
                        </ul>
                    </div>
                </div>',
                'image' => $assetBase . '/OurPrograms/41146cd8c06fe1e0af97901abf7120a065421b19.jpg',
                'bg_color' => 'bg-[#E6F3F1]',
                'order' => 5,
                'is_published' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Program 6: Research
            [
                'id' => 6,
                'slug' => 'research-and-documentation',
                'title' => 'Research and Documentation',
                'breadcrumb' => 'Research & Documentation',
                'excerpt' => '<div class="space-y-4">
                    <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#524B48] leading-relaxed">DUS has a strong <strong class="text-[#009BE2]">Research and Documentation Cell</strong> to conduct quality research in diverse areas of human and social development sectors.</p>
                </div>',
                'full_content' => '<div class="space-y-6">
                    <div>
                        <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">DUS has a strong <strong class="text-[#009BE2]">Research and Documentation Cell</strong> to conduct quality research in diverse areas of human and social development sectors.</p>
                        
                        <h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Research Areas</h2>
                        <ul class="list-disc pl-6 space-y-3">
                            <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Baseline surveys and needs assessments</li>
                            <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Impact evaluation studies</li>
                            <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Documentation of best practices and case studies</li>
                        </ul>
                    </div>
                </div>',
                'image' => $assetBase . '/OurPrograms/a496922a3fc00992b6c454822d60bde51dc001e5.webp',
                'bg_color' => 'bg-[#F3E6EA]',
                'order' => 6,
                'is_published' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Program 7: Livelihood
            [
                'id' => 7,
                'slug' => 'livelihood-restoration-project',
                'title' => 'Livelihood Restoration Project',
                'breadcrumb' => 'Livelihood Restoration',
                'excerpt' => '<div class="space-y-4">
                    <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#524B48] leading-relaxed">This project focuses on restoring and enhancing livelihood opportunities for communities affected by natural disasters and economic vulnerabilities.</p>
                </div>',
                'full_content' => '<div class="space-y-6">
                    <div>
                        <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">This project focuses on restoring and enhancing livelihood opportunities for communities affected by natural disasters and economic vulnerabilities.</p>
                        
                        <h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Livelihood Options</h2>
                        <ul class="list-disc pl-6 space-y-3">
                            <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Small business development and entrepreneurship</li>
                            <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Agricultural diversification and improved farming</li>
                            <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Livestock rearing and poultry farming</li>
                        </ul>
                    </div>
                </div>',
                'image' => $assetBase . '/OurPrograms/1b7d77f85b29f0b12d98e2a09ddc1d734c6f6ea1.jpg',
                'bg_color' => 'bg-[#E6ECF3]',
                'order' => 7,
                'is_published' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Program 8: Insurance & Savings
            [
                'id' => 8,
                'slug' => 'group-member-insurance-savings-scheme',
                'title' => 'Group Member Insurance & Savings Scheme',
                'breadcrumb' => 'Insurance & Savings Scheme',
                'excerpt' => '<div class="space-y-4">
                    <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#524B48] leading-relaxed">A comprehensive social protection mechanism for our group members, combining <strong class="text-[#009BE2]">savings and insurance</strong> to provide financial security and risk coverage.</p>
                </div>',
                'full_content' => '<div class="space-y-6">
                    <div>
                        <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">A comprehensive social protection mechanism for our group members, combining <strong class="text-[#009BE2]">savings and insurance</strong> to provide financial security and risk coverage.</p>
                        
                        <h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Benefits</h2>
                        <ul class="list-disc pl-6 space-y-3">
                            <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Life insurance coverage up to BDT 50,000</li>
                            <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Health and accident benefits</li>
                            <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Emergency loan facilities from savings</li>
                        </ul>
                    </div>
                </div>',
                'image' => $assetBase . '/OurPrograms/21f2ed036293018aac5b8d98c97bc26201e92f68.jpg',
                'bg_color' => 'bg-[#F3E6F1]',
                'order' => 8,
                'is_published' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Program 9: Social Development
            [
                'id' => 9,
                'slug' => 'social-development-program',
                'title' => 'Social Development Program',
                'breadcrumb' => 'Social Development',
                'excerpt' => '<div class="space-y-4">
                    <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#524B48] leading-relaxed">Addressing social issues and promoting inclusive development through community mobilization and awareness programs.</p>
                </div>',
                'full_content' => '<div class="space-y-6">
                    <div>
                        <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Addressing social issues and promoting inclusive development through community mobilization and awareness programs.</p>
                        
                        <h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Focus Areas</h2>
                        <ul class="list-disc pl-6 space-y-3">
                            <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Women empowerment and leadership development</li>
                            <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Child rights and protection committees</li>
                            <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Prevention of child marriage and dowry</li>
                        </ul>
                    </div>
                </div>',
                'image' => $assetBase . '/OurPrograms/a00b43d1f3ee0f568f2e058ee39101be8911c1a0.jpg',
                'bg_color' => 'bg-[#F3E6EA]',
                'order' => 9,
                'is_published' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Program 10: Legal & Human Rights
            [
                'id' => 10,
                'slug' => 'legal-and-human-rights',
                'title' => 'Legal and Human Rights',
                'breadcrumb' => 'Legal & Human Rights',
                'excerpt' => '<div class="space-y-4">
                    <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#524B48] leading-relaxed">Promoting <strong class="text-[#009BE2]">access to justice and human rights protection</strong> for marginalized communities through legal aid, awareness, and advocacy.</p>
                </div>',
                'full_content' => '<div class="space-y-6">
                    <div>
                        <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Promoting <strong class="text-[#009BE2]">access to justice and human rights protection</strong> for marginalized communities through legal aid, awareness, and advocacy.</p>
                        
                        <h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Services</h2>
                        <ul class="list-disc pl-6 space-y-3">
                            <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Free legal aid and counseling clinics</li>
                            <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Human rights awareness campaigns</li>
                            <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Support for victims of violence and discrimination</li>
                        </ul>
                    </div>
                </div>',
                'image' => $assetBase . '/OurPrograms/1c54b2045a0958af86f3c81624c73f0b8e23b6f7.jpg',
                'bg_color' => 'bg-[#E6F1F3]',
                'order' => 10,
                'is_published' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Program 11: WATSAN
            [
                'id' => 11,
                'slug' => 'watsan-program',
                'title' => 'WATSAN Program',
                'breadcrumb' => 'Water & Sanitation',
                'excerpt' => '<div class="space-y-4">
                    <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#524B48] leading-relaxed">Building on its long experience of providing water and sanitation services to communities, DUS started its <strong class="text-[#009BE2]">Water and Sanitation program</strong> with the support of the Netherland Govt.</p>
                </div>',
                'full_content' => '<div class="space-y-6">
                    <div>
                        <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Building on its long experience of providing water and sanitation services to communities, DUS started its <strong class="text-[#009BE2]">Water and Sanitation program</strong> with the financial and technical support of the Netherland Government.</p>
                        
                        <h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Targets</h2>
                        <ul class="list-disc pl-6 space-y-3">
                            <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">4,605 households with sanitation access</li>
                            <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">250 deep tube wells for safe water</li>
                            <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">20,000 people with hygiene education</li>
                        </ul>
                    </div>
                </div>',
                'image' => $assetBase . '/OurPrograms/42d5b669fc99984337547c6028cb9251bc1b306d.jpg',
                'bg_color' => 'bg-[#F2F3E6]',
                'order' => 11,
                'is_published' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Program 12: Training
            [
                'id' => 12,
                'slug' => 'training-and-other-facilities',
                'title' => 'Training and Other Facilities',
                'breadcrumb' => 'Training Facilities',
                'excerpt' => '<div class="space-y-4">
                    <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#524B48] leading-relaxed">DUS has developed a comprehensive <strong class="text-[#009BE2]">Training and Communication Unit</strong> fully equipped with all possible physical and human resources to deliver high-quality capacity building programs.</p>
                </div>',
                'full_content' => '<div class="space-y-6">
                    <div>
                        <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">DUS has developed a comprehensive <strong class="text-[#009BE2]">Training and Communication Unit</strong> fully equipped with all possible physical and human resources to deliver high-quality capacity building programs.</p>
                        
                        <h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Training Offerings</h2>
                        <ul class="list-disc pl-6 space-y-3">
                            <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Skill development and vocational training</li>
                            <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Leadership and management training</li>
                            <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Financial literacy and business management</li>
                        </ul>
                    </div>
                </div>',
                'image' => $assetBase . '/OurPrograms/be14c45848898048e7b7832affc4dc713b032e10.webp',
                'bg_color' => 'bg-[#E6EDF3]',
                'order' => 12,
                'is_published' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Program 13: Tourism
            [
                'id' => 13,
                'slug' => 'tourism-and-hospitality',
                'title' => 'Tourism and Hospitality',
                'breadcrumb' => 'Tourism & Hospitality',
                'excerpt' => '<div class="space-y-4">
                    <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#524B48] leading-relaxed">Promoting <strong class="text-[#009BE2]">sustainable tourism and hospitality</strong> as an emerging livelihood opportunity for coastal communities.</p>
                </div>',
                'full_content' => '<div class="space-y-6">
                    <div>
                        <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Promoting <strong class="text-[#009BE2]">sustainable tourism and hospitality</strong> as an emerging livelihood opportunity for coastal communities.</p>
                        
                        <h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Initiatives</h2>
                        <ul class="list-disc pl-6 space-y-3">
                            <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Homestay and community guesthouse development</li>
                            <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Tour guide training and certification</li>
                            <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Handicraft and souvenir production</li>
                        </ul>
                    </div>
                </div>',
                'image' => $assetBase . '/OurPrograms/83260e25460beb43cd8a9c084bb311328e8f24d7.jpg',
                'bg_color' => 'bg-[#EAE6F3]',
                'order' => 13,
                'is_published' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('programs')->insert($programs);

        $this->command->info('ProgramsTableSeeder completed. Inserted ' . count($programs) . ' programs.');
    }
}
