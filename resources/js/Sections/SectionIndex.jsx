// resources/js/Sections/SectionIndex.jsx

import React from 'react';

// Import all section components
import HomeBanner from './BannerSection/HomeBanner';
import PageBannerSection from './BannerSection/PageBannerSection';
import AboutUsSection from './AboutUsSection/AboutUsSection';
import OurActionSection from './OurActionSection/OurActionSection';
import WhereWeWorkSection from './WhereWeWorkSection/WhereWeWorkSection';
import OurProgramsSection from './OurProgramsSection/OurProgramsSection';
import StoriesSection from './StoriesSection/StoriesSection';
import BlogSection from './BlogSection/BlogSection';
import JobsSection from './JobsSection/JobsSection';
import ProgramImpactSection from './ProgramImpactSection/ProgramImpactSection';
import UpcomingEventsSection from './UpcomingEventsSection/UpcomingEventsSection';
import HeroFigureSection from './HeroFigureSection/HeroFigureSection';
import CardsSection from './CardsSection/CardsSection';
import FAQSection from './FAQSection/FAQSection';
import ContactOfficeSection from './ContactOfficeSection/ContactOfficeSection';
import AddressSection from './AddressSection/AddressSection';
import ContactReachSection from './ContactReachSection/ContactReachSection';
import FollowUSSection from './FollowUSSection/FollowUSSection';
import LegalSection from './LegalSection/LegalSection';

// Component mapping with both old and new component names
const sectionComponents = {
  // New names
  HomeBanner,
  PageBannerSection,
  AboutUsSection,
  OurActionSection,
  WhereWeWorkSection,
  OurProgramsSection,
  StoriesSection,
  BlogSection,
  JobsSection,
  ProgramImpactSection,
  UpcomingEventsSection,
  HeroFigureSection,
  CardsSection,
  FAQSection,
  ContactOfficeSection,
  AddressSection,
  ContactReachSection,
  FollowUSSection,
  LegalSection,

  // Old names for backward compatibility
  'BannerSection': HomeBanner,
  'PageBanner': PageBannerSection,
  'AboutUs': AboutUsSection,
  'OurAction': OurActionSection,
  'WhereWeWork': WhereWeWorkSection,
  'OurPrograms': OurProgramsSection,
  'Stories': StoriesSection,
  'Blog': BlogSection,
  'Jobs': JobsSection,
  'ProgramImpact': ProgramImpactSection,
  'UpcomingEvents': UpcomingEventsSection,
  'HeroFigure': HeroFigureSection,
  'Cards': CardsSection,
  'FAQ': FAQSection,
  'ContactOffice': ContactOfficeSection,
  'Address': AddressSection,
  'ContactReach': ContactReachSection,
  'FollowUS': FollowUSSection,
  'Legal': LegalSection,
};

/**
 * Extract section data from different data structures
 * Supports both old and new data formats
 */
const extractSectionData = (section) => {
  if (!section) return null;

  // If section already has data directly
  if (section.data) {
    // For custom_section_data and shared_data, the actual data is nested
    if (section.data_table === 'custom_section_data' || section.data_table === 'shared_data') {
      return section.data.data || section.data;
    }
    // For blogs and programs, the data is the array itself
    if (section.data_table === 'blogs' || section.data_table === 'programs') {
      return section.data;
    }
    // For about_content
    if (section.data_table === 'about_content') {
      return section.data;
    }
    return section.data;
  }

  // Check for old format - data might be in section.section_data
  if (section.section_data) {
    return section.section_data;
  }

  // Check for custom section data
  if (section.custom_section_data) {
    return section.custom_section_data;
  }

  // Check for shared section data
  if (section.shared_section_data) {
    return section.shared_section_data;
  }

  return null;
};

/**
 * Build props for each component type
 * Supports both old and new prop names
 */
const buildComponentProps = (component, sectionData, section) => {
  const props = {
    key: section.id || section.section_key || section.component,
    ...(section.custom_props || {}),
  };

  // Map based on component name (support both old and new)
  const componentName = section.component;

  switch (componentName) {
    case 'HomeBanner':
    case 'BannerSection':
      props.bannerData = sectionData;
      break;

    case 'PageBannerSection':
    case 'PageBanner':
      props.bannerData = sectionData;
      break;

    case 'AboutUsSection':
    case 'AboutUs':
      props.aboutUsData = sectionData;
      break;

    case 'OurActionSection':
    case 'OurAction':
      props.actionData = sectionData;
      break;

    case 'WhereWeWorkSection':
    case 'WhereWeWork':
      props.workData = sectionData;
      break;

    case 'OurProgramsSection':
    case 'OurPrograms':
      props.programsData = sectionData;
      break;

    case 'StoriesSection':
    case 'Stories':
      props.storiesData = sectionData;
      break;

    case 'BlogSection':
    case 'Blog':
      // BlogSection expects mainBlog and blogPosts
      if (Array.isArray(sectionData) && sectionData.length > 0) {
        props.mainBlog = sectionData[0] || null;
        props.blogPosts = sectionData.slice(1) || [];
      } else {
        props.mainBlog = null;
        props.blogPosts = [];
      }
      // Check if section has a title in custom_props
      if (section.custom_props?.sectionTitle) {
        props.sectionTitle = section.custom_props.sectionTitle;
      }
      break;

    case 'JobsSection':
    case 'Jobs':
      props.jobsData = sectionData;
      break;

    case 'ProgramImpactSection':
    case 'ProgramImpact':
      props.impactData = sectionData;
      break;

    case 'UpcomingEventsSection':
    case 'UpcomingEvents':
      props.eventsData = sectionData;
      break;

    case 'FAQSection':
    case 'FAQ':
      props.faqData = sectionData;
      break;

    case 'ContactOfficeSection':
    case 'ContactOffice':
      props.offices = Array.isArray(sectionData) ? sectionData : [];
      break;

    case 'AddressSection':
    case 'Address':
      props.officesLocation = Array.isArray(sectionData) ? sectionData : [];
      break;

    case 'ContactReachSection':
    case 'ContactReach':
      props.image = sectionData?.image || '';
      props.title = sectionData?.title || 'Reach out to us today!';
      props.buttonText = sectionData?.buttonText || 'Submit Message';
      break;

    case 'FollowUSSection':
    case 'FollowUS':
      props.socialItems = Array.isArray(sectionData) ? sectionData : [];
      break;

    case 'LegalSection':
    case 'Legal':
      props.legalData = sectionData;
      break;

    case 'HeroFigureSection':
    case 'HeroFigure':
      props.data = sectionData;
      break;

    case 'CardsSection':
    case 'Cards':
      props.cardsData = sectionData;
      break;

    case 'ProgramContentSection':
    case 'ProgramContent':
      props.programData = sectionData;
      break;

    case 'BlogContentSection':
    case 'BlogContent':
      props.blogData = sectionData;
      break;

    case 'ContentSection':
    case 'Content':
      props.subPageData = sectionData;
      break;

    default:
      props.data = sectionData;
      break;
  }

  return props;
};

/**
 * SectionIndex Component - Main renderer
 * Supports both old and new section data formats
 */
const SectionIndex = ({ sections }) => {
  if (!sections || sections.length === 0) {
    return null;
  }

  return (
    <>
      {sections.map((section) => {
        // Find component by name (supports both old and new)
        const Component = sectionComponents[section.component];

        if (!Component) {
          console.warn(`No component found for: ${section.component}`);
          return null;
        }

        // Extract data (supports both old and new formats)
        const sectionData = extractSectionData(section);

        // Build props (supports both old and new prop names)
        const props = buildComponentProps(section.component, sectionData, section);

        return <Component key={section.id} {...props} />;
      })}
    </>
  );
};

export default SectionIndex;