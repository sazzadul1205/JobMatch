// resources/js/Pages/Frontend/ContactUs/ContactUs.jsx

import React from 'react';

// Inertia
import { Head } from '@inertiajs/react';

// Layout
import PublicLayout from '../../../layouts/PublicLayout';

// Components
import DynamicSectionRenderer from '../../../components/Shared/DynamicSectionRenderer';

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
        sectionId: 'contact-us-banner',
      }
    },
    {
      id: "contact-offices",
      component: "ContactOfficeSection",
      enabled: true,
      propName: "offices",
      dataKey: "offices",
      order: 2,
      customProps: {}
    },
    {
      id: "contact-reach",
      component: "ContactReachSection",
      enabled: true,
      propName: "image",
      dataKey: "reachUsImage",
      order: 3,
      customProps: {}
    },
    {
      id: "follow-us",
      component: "FollowUSSection",
      enabled: true,
      propName: "socialItems",
      dataKey: "socialItems",
      order: 4,
      customProps: {}
    },
    {
      id: "address",
      component: "AddressSection",
      enabled: true,
      propName: "officesLocation",
      dataKey: "officesLocation",
      order: 5,
      customProps: {}
    },
    {
      id: "faq",
      component: "FAQSection",
      enabled: true,
      propName: "faqData",
      dataKey: "faqData",
      order: 6,
      customProps: {
        bgColor: 'bg-white',
      }
    },
    {
      id: "stories",
      component: "StoriesSection",
      enabled: true,
      propName: "storiesData",
      dataKey: "storiesData",
      order: 7,
      customProps: {}
    },
    {
      id: "upcoming-events",
      component: "UpcomingEventsSection",
      enabled: true,
      propName: "eventsData",
      dataKey: "upcomingEventsData",
      order: 8,
      customProps: {}
    },
  ],
};

const ContactUs = ({
  topBarData,
  navbarData,
  footerData,
  storageUrl,
  bannerData,
  offices,
  socialItems,
  reachUsImage,
  officesLocation,
  faqData,
  storiesData,
  upcomingEventsData,
}) => {

  // Prepare data mapping
  const pageData = {
    bannerData,
    offices,
    reachUsImage,
    socialItems,
    officesLocation,
    faqData,
    storiesData,
    upcomingEventsData,
  };

  // Get enabled sections sorted by order
  const sectionsToRender = SECTION_ORDER_CONFIG.sections
    .filter(section => section.enabled === true)
    .sort((a, b) => a.order - b.order);

  return (
    <PublicLayout
      topBarData={topBarData}
      navbarData={navbarData}
      footerData={footerData}
      storageUrl={storageUrl}
    >
      <Head title="Contact Us | DUS - Dwip Unnayan Society | Empowering Communities" />

      {sectionsToRender.map((section) => (
        <DynamicSectionRenderer
          key={section.id}
          section={section}
          pageData={pageData}
          globalProps={{ storageUrl }}
        />
      ))}
    </PublicLayout>
  );
};

export default ContactUs;