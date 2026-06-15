// resources/js/Pages/Frontend/Home/Home.jsx

// Inertia
import { Head } from "@inertiajs/react";

// Layout
import PublicLayout from "../../../layouts/PublicLayout";

// Components
import DynamicSectionRenderer from '../../../components/Shared/DynamicSectionRenderer';

// ============================================
// SECTION ORDER CONFIGURATION (JSON)
// ============================================
const SECTION_ORDER_CONFIG = {
  sections: [
    {
      id: "banner",
      component: "HomeBanner",
      enabled: true,
      propName: "bannerData",
      dataKey: "bannerData",
      order: 1,
      customProps: {}
    },
    {
      id: "about-us",
      component: "AboutUsSection",
      enabled: true,
      propName: "aboutUsData",
      dataKey: "aboutUsData",
      order: 2,
      customProps: {}
    },
    {
      id: "our-action",
      component: "OurActionSection",
      enabled: true,
      propName: "actionData",
      dataKey: "ourActionData",
      order: 3,
      customProps: {}
    },
    {
      id: "where-we-work",
      component: "WhereWeWorkSection",
      enabled: true,
      propName: "workData",
      dataKey: "whereWeWorkData",
      order: 4,
      customProps: {}
    },
    {
      id: "our-programs",
      component: "OurProgramsSection",
      enabled: true,
      propName: "programsData",
      dataKey: "ourProgramsData",
      order: 5,
      customProps: {}
    },
    {
      id: "stories",
      component: "StoriesSection",
      enabled: true,
      propName: "storiesData",
      dataKey: "storiesData",
      order: 6,
      customProps: {}
    },
    {
      id: "upcoming-events",
      component: "UpcomingEventsSection",
      enabled: true,
      propName: "eventsData",
      dataKey: "upcomingEventsData",
      order: 7,
      customProps: {}
    },
    {
      id: "jobs",
      component: "JobsSection",
      enabled: true,
      propName: "jobsData",
      dataKey: "jobsData",
      order: 8,
      customProps: {}
    },
    {
      id: "program-impact",
      component: "ProgramImpactSection",
      enabled: true,
      propName: "impactData",
      dataKey: "programImpactData",
      order: 9,
      customProps: {}
    },
  ],
};

export default function Home({
  topBarData,
  navbarData,
  footerData,
  storageUrl,
  jobsData,
  bannerData,
  storiesData,
  aboutUsData,
  ourActionData,
  ourProgramsData,
  whereWeWorkData,
  programImpactData,
  upcomingEventsData,
}) {

  // Prepare data mapping
  const pageData = {
    bannerData,
    aboutUsData,
    ourActionData,
    whereWeWorkData,
    ourProgramsData,
    storiesData,
    upcomingEventsData,
    jobsData,
    programImpactData,
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
      <Head title="Home | DUS - Dwip Unnayan Society | Empowering Communities" />

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
}