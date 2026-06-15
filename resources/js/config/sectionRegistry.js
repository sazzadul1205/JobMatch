// resources/js/config/sectionRegistry.js

import { lazy } from 'react';

// ============================================
// SECTION REGISTRY - All available sections
// Add new sections here once and use everywhere
// ============================================

export const SECTION_COMPONENTS = {
  // Banner Sections
  HomeBanner: lazy(() => import('../Sections/BannerSection/HomeBanner')),
  PageBannerSection: lazy(() => import('../Sections/BannerSection/PageBannerSection')),
  
  // Common Sections
  FAQSection: lazy(() => import('../Sections/FAQSection/FAQSection')),
  BlogSection: lazy(() => import('../Sections/BlogSection/BlogSection')),
  JobsSection: lazy(() => import('../Sections/JobsSection/JobsSection')),
  CardsSection: lazy(() => import('../Sections/CardsSection/CardsSection')),
  LegalSection: lazy(() => import('../Sections/LegalSection/LegalSection')),
  AddressSection: lazy(() => import('../Sections/AddressSection/AddressSection')),
  AboutUsSection: lazy(() => import('../Sections/AboutUsSection/AboutUsSection')),
  StoriesSection: lazy(() => import('../Sections/StoriesSection/StoriesSection')),
  FollowUSSection: lazy(() => import('../Sections/FollowUSSection/FollowUSSection')),
  OurActionSection: lazy(() => import('../Sections/OurActionSection/OurActionSection')),
  HeroFigureSection: lazy(() => import('../Sections/HeroFigureSection/HeroFigureSection')),
  OurProgramsSection: lazy(() => import('../Sections/OurProgramsSection/OurProgramsSection')),
  WhereWeWorkSection: lazy(() => import('../Sections/WhereWeWorkSection/WhereWeWorkSection')),
  ContactReachSection: lazy(() => import('../Sections/ContactReachSection/ContactReachSection')),
  ContactOfficeSection: lazy(() => import('../Sections/ContactOfficeSection/ContactOfficeSection')),
  ProgramImpactSection: lazy(() => import('../Sections/ProgramImpactSection/ProgramImpactSection')),
  UpcomingEventsSection: lazy(() => import('../Sections/UpcomingEventsSection/UpcomingEventsSection')),
};

// Section configurations - defines how each section receives its props
export const SECTION_CONFIGS = {
  // Single prop sections
  FAQSection: { propName: 'faqData', isMultiProp: false },
  JobsSection: { propName: 'jobsData', isMultiProp: false },
  HomeBanner: { propName: 'bannerData', isMultiProp: false },
  CardsSection: { propName: 'cardsData', isMultiProp: false },
  LegalSection: { propName: 'legalData', isMultiProp: false },
  HeroFigureSection: { propName: 'data', isMultiProp: false },
  ContactReachSection: { propName: 'image', isMultiProp: false },
  AboutUsSection: { propName: 'aboutUsData', isMultiProp: false },
  StoriesSection: { propName: 'storiesData', isMultiProp: false },
  FollowUSSection: { propName: 'socialItems', isMultiProp: false },
  OurActionSection: { propName: 'actionData', isMultiProp: false },
  WhereWeWorkSection: { propName: 'workData', isMultiProp: false },
  PageBannerSection: { propName: 'bannerData', isMultiProp: false },
  ContactOfficeSection: { propName: 'offices', isMultiProp: false },
  AddressSection: { propName: 'officesLocation', isMultiProp: false },
  ProgramImpactSection: { propName: 'impactData', isMultiProp: false },
  OurProgramsSection: { propName: 'programsData', isMultiProp: false },
  UpcomingEventsSection: { propName: 'eventsData', isMultiProp: false },
  
  // Multi-prop sections (need special handling)
  BlogSection: { 
    isMultiProp: true, 
    props: ['mainBlog', 'blogPosts'],
    defaultProps: { sectionTitle: null }
  },
};