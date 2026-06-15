// resources/js/Pages/Frontend/AboutDetails/AboutDetails.jsx

import React from 'react';

// Inertia
import { Head } from "@inertiajs/react";

// Layout
import PublicLayout from '../../../layouts/PublicLayout';

// Components
import DynamicSectionRenderer from '../../../components/Shared/DynamicSectionRenderer';

// Content Section Component (for the main dynamic content)
const ContentSection = ({
  title,
  content,
  bgColor = 'bg-white',
  paddingY = 'py-37.5',
  paddingX = 'px-100',
  sectionClassName = '',
  sectionId = 'main-content',
}) => {
  const renderHTML = (htmlString) => ({ __html: htmlString });

  if (!title && !content) return null;

  return (
    <section
      id={sectionId}
      className={`${bgColor} ${paddingY} ${paddingX} ${sectionClassName}`}
    >
      {title && (
        <h1 className='font-700 text-[100px] leading-tight pb-12.5'>
          {title}
        </h1>
      )}
      {content && (
        <div
          className="bricolage-grotesque prose prose-lg max-w-none
              prose-headings:font-700 prose-headings:text-[#080C14] 
              prose-p:text-[#333333] prose-p:leading-relaxed
              prose-ul:text-[#333333] prose-ul:leading-relaxed
              prose-li:text-[#333333] prose-li:leading-relaxed
              prose-strong:text-[#009BE2]"
          dangerouslySetInnerHTML={renderHTML(content)}
        />
      )}
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
        sectionId: "about-details-banner",
      }
    },
    {
      id: "main-content",
      component: "ContentSection", // Special local component
      isSpecialComponent: true,
      enabled: true,
      order: 2,
      customProps: {
        bgColor: "bg-white",
        paddingY: "py-37.5",
        paddingX: "px-100",
        sectionId: "main-content",
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

const AboutDetails = ({
  topBarData,
  navbarData,
  footerData,
  storageUrl,
  slug,
  faqData,
  bannerData,
  subPageData,
  upcomingEventsData,
}) => {

  // Prepare data mapping
  const pageData = {
    bannerData,
    faqData,
    upcomingEventsData,
    subPageData,
  };

  // Get enabled sections sorted by order
  const sectionsToRender = SECTION_ORDER_CONFIG.sections
    .filter(section => section.enabled === true)
    .sort((a, b) => a.order - b.order);

  const renderSection = (section) => {
    // Handle special components
    if (section.isSpecialComponent) {
      if (section.component === 'ContentSection') {
        return (
          <ContentSection
            key={section.id}
            title={subPageData?.title}
            content={subPageData?.content}
            {...section.customProps}
          />
        );
      }
      return null;
    }

    // Use DynamicSectionRenderer for registered components
    return (
      <DynamicSectionRenderer
        key={section.id}
        section={section}
        pageData={pageData}
        globalProps={{ storageUrl }}
      />
    );
  };

  return (
    <PublicLayout
      topBarData={topBarData}
      navbarData={navbarData}
      footerData={footerData}
      storageUrl={storageUrl}
    >
      <Head title={`${subPageData?.title || 'About'} | DUS - Dwip Unnayan Society`} />

      {sectionsToRender.map((section) => renderSection(section))}
    </PublicLayout>
  );
};

export default AboutDetails;