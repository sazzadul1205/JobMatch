// resources/js/Pages/Frontend/ProjectsAndProgramsDetails/ProjectsAndProgramsDetails.jsx

import React from 'react';
import { Head } from "@inertiajs/react";

// Layout
import PublicLayout from '../../../layouts/PublicLayout';

// Components
import DynamicSectionRenderer from '../../../components/Shared/DynamicSectionRenderer';

// ============================================
// SPECIAL COMPONENTS (Not in registry)
// ============================================

// Program Content Section Component
const ProgramContentSection = ({
  programData,
  slug,
  bgColor = 'bg-white',
  paddingY = 'py-37.5',
  paddingX = 'px-100',
  sectionClassName = '',
  sectionId = 'program-content',
}) => {
  const renderHTML = (htmlString) => ({ __html: htmlString });

  if (!programData) return null;

  return (
    <section id={sectionId} className={`${bgColor} ${paddingY} ${paddingX} ${sectionClassName}`}>
      {/* Title */}
      <h1 className='font-700 text-[100px] leading-tight pb-12.5'>
        {programData?.title}
      </h1>

      {/* Image - Responsive sizing */}
      {programData?.image && (
        <div className="mb-6 sm:mb-8 md:mb-10 lg:mb-12.5">
          <img
            src={programData.image}
            alt={programData?.title || 'Program image'}
            className="w-full h-auto max-h-64 sm:max-h-80 md:max-h-96 lg:max-h-125 object-cover rounded-2xl"
          />
        </div>
      )}

      {/* Content */}
      <div
        className="bricolage-grotesque prose prose-lg max-w-none
          prose-headings:font-700 prose-headings:text-[#080C14] 
          prose-p:text-[#333333] prose-p:leading-relaxed
          prose-ul:text-[#333333] prose-ul:leading-relaxed
          prose-li:text-[#333333] prose-li:leading-relaxed
          prose-strong:text-[#009BE2]"
        dangerouslySetInnerHTML={renderHTML(programData.content)}
      />
    </section>
  );
};

// ============================================
// SECTION ORDER CONFIGURATION (JSON)
// ============================================
const SECTION_ORDER_CONFIG = {
  sections: [
    {
      id: "banner",
      component: "PageBannerSection",
      enabled: true,
      propName: "bannerData",
      dataKey: "bannerData",
      order: 1,
      customProps: {
        // sectionId will be dynamically generated below
      }
    },
    {
      id: "program-content",
      component: "ProgramContentSection",
      isSpecialComponent: true,
      enabled: true,
      order: 2,
      customProps: {
        bgColor: 'bg-white',
        paddingY: 'py-37.5',
        paddingX: 'px-100',
      }
    },
    {
      id: "faq",
      component: "FAQSection",
      enabled: true,
      propName: "faqData",
      dataKey: "faqData",
      order: 3,
      customProps: {}
    },
    {
      id: "upcoming-events",
      component: "UpcomingEventsSection",
      enabled: true,
      propName: "eventsData",
      dataKey: "upcomingEventsData",
      order: 4,
      customProps: {}
    },
  ],
};

const ProjectsAndProgramsDetails = ({
  topBarData,
  navbarData,
  footerData,
  storageUrl,
  slug,
  faqData,
  bannerData,
  programData,
  upcomingEventsData,
}) => {

  // Prepare data mapping
  const pageData = {
    bannerData,
    faqData,
    upcomingEventsData,
    programData,
    slug,
  };

  // Get enabled sections sorted by order with dynamic banner sectionId
  const getSectionsToRender = () => {
    return SECTION_ORDER_CONFIG.sections
      .map(section => {
        // Dynamically update banner sectionId based on slug
        if (section.id === 'banner') {
          return {
            ...section,
            customProps: {
              ...section.customProps,
              sectionId: `program-${slug}-banner`
            }
          };
        }
        return section;
      })
      .filter(section => section.enabled === true)
      .sort((a, b) => a.order - b.order);
  };

  const sectionsToRender = getSectionsToRender();

  // Helper to render special components
  const renderSpecialComponent = (section) => {
    const { component, customProps = {} } = section;

    if (component === 'ProgramContentSection') {
      return (
        <ProgramContentSection
          key={section.id}
          programData={pageData.programData}
          slug={pageData.slug}
          {...customProps}
        />
      );
    }

    return null;
  };

  return (
    <PublicLayout
      topBarData={topBarData}
      navbarData={navbarData}
      footerData={footerData}
      storageUrl={storageUrl}
    >
      <Head title={`${programData?.title || 'Program'} | DUS - Dwip Unnayan Society`} />

      {sectionsToRender.map((section) => {
        if (section.isSpecialComponent) {
          return renderSpecialComponent(section);
        }

        return (
          <DynamicSectionRenderer
            key={section.id}
            section={section}
            pageData={pageData}
            globalProps={{ storageUrl }}
          />
        );
      })}
    </PublicLayout>
  );
};

export default ProjectsAndProgramsDetails;