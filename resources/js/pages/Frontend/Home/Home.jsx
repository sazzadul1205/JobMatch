// resources/js/Pages/Frontend/Home/Home.jsx

// Inertia
import { Head } from "@inertiajs/react";
import { Suspense, lazy } from "react";

// Layout
import PublicLayout from "../../../layouts/PublicLayout";

// ============================================
// LAZY LOAD SECTIONS - Only load when needed
// ============================================
const HomeBanner = lazy(() => import("../../../Sections/BannerSection/HomeBanner"));
const JobsSection = lazy(() => import("../../../Sections/JobsSection/JobsSection"));
const StoriesSection = lazy(() => import("../../../Sections/StoriesSection/StoriesSection"));
const AboutUsSection = lazy(() => import("../../../Sections/AboutUsSection/AboutUsSection"));
const OurActionSection = lazy(() => import("../../../Sections/OurActionSection/OurActionSection"));
const WhereWeWorkSection = lazy(() => import("../../../Sections/WhereWeWorkSection/WhereWeWorkSection"));
const OurProgramsSection = lazy(() => import("../../../Sections/OurProgramsSection/OurProgramsSection"));
const ProgramImpactSection = lazy(() => import("../../../Sections/ProgramImpactSection/ProgramImpactSection"));
const UpcomingEventsSection = lazy(() => import("../../../Sections/UpcomingEventsSection/UpcomingEventsSection"));

// ============================================
// SECTION ORDER CONFIGURATION (JSON)
// ============================================
const SECTION_ORDER_CONFIG = {
  sections: [
    {
      id: "banner",
      component: HomeBanner,
      enabled: true,
      propName: "bannerData",
      dataKey: "bannerData",
      order: 1,
      // Optional custom props for the section
      customProps: {
        // bgColor: 'bg-custom',
        // height: 'h-150 md:h-350',
        // sectionClassName: 'custom-banner-class'
      }
    },
    {
      id: "about-us",
      component: AboutUsSection,
      enabled: true,
      propName: "aboutUsData",
      dataKey: "aboutUsData",
      order: 2,
      customProps: {
        // bgColor: 'bg-white',
        // paddingY: 'py-20 lg:py-40',
        // paddingX: 'px-10 lg:px-60'
      }
    },
    {
      id: "our-action",
      component: OurActionSection,
      enabled: true,
      propName: "actionData",
      dataKey: "ourActionData",
      order: 3,
      customProps: {
        // bgColor: 'bg-gray-50',
        // paddingY: 'py-15 lg:py-30'
      }
    },
    {
      id: "where-we-work",
      component: WhereWeWorkSection,
      enabled: true,
      propName: "workData",
      dataKey: "whereWeWorkData",
      order: 4,
      customProps: {
        // bgColor: 'bg-white'
      }
    },
    {
      id: "our-programs",
      component: OurProgramsSection,
      enabled: true,
      propName: "programsData",
      dataKey: "ourProgramsData",
      order: 5,
      customProps: {
        // bgColor: 'bg-white'
      }
    },
    {
      id: "stories",
      component: StoriesSection,
      enabled: true,
      propName: "storiesData",
      dataKey: "storiesData",
      order: 6,
      customProps: {
        // bgColor: 'bg-[#F5F5F5]'
      }
    },
    {
      id: "upcoming-events",
      component: UpcomingEventsSection,
      enabled: true,
      propName: "eventsData",
      dataKey: "upcomingEventsData",
      order: 7,
      customProps: {
        // bgColor: 'bg-white'
      }
    },
    {
      id: "jobs",
      component: JobsSection,
      enabled: true,
      propName: "jobsData",
      dataKey: "jobsData",
      order: 8,
      customProps: {
        // bgColor: 'bg-[#F5F5F5]'
      }
    },
    {
      id: "program-impact",
      component: ProgramImpactSection,
      enabled: true,
      propName: "impactData",
      dataKey: "programImpactData",
      order: 9,
      customProps: {
        // bgColor: 'bg-white'
      }
    },
  ],
};

// Loading fallback component
const SectionLoader = () => (
  <div className="w-full py-20 flex justify-center items-center min-h-screen">
    <div className="animate-pulse flex flex-col items-center">
      <div className="w-12 h-12 border-4 border-[#009BE2] border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-[#515151] font-400">Loading section...</p>
    </div>
  </div>
);

export default function Home({
  // Shared 
  topBarData,
  navbarData,
  footerData,
  storageUrl,

  // Page Specific Data
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
  const sectionDataMap = {
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
  const getSectionsToRender = () => {
    return SECTION_ORDER_CONFIG.sections
      .filter(section => section.enabled === true)
      .sort((a, b) => a.order - b.order);
  };

  // Get sections to render
  const sectionsToRender = getSectionsToRender();

  return (
    <PublicLayout
      topBarData={topBarData}
      navbarData={navbarData}
      footerData={footerData}
      storageUrl={storageUrl}
    >
      <Head title="Home | DUS - Dwip Unnayan Society | Empowering Communities" />

      {/* Wrap all lazy sections in Suspense */}
      <Suspense fallback={<SectionLoader />}>
        {sectionsToRender.map((section) => {
          const SectionComponent = section.component;
          const sectionData = sectionDataMap[section.dataKey];

          if (!SectionComponent || !sectionData) {
            console.warn(`Missing component or data for: ${section.id}`);
            return null;
          }

          // Merge the required prop with custom props from config
          const props = {
            [section.propName]: sectionData,
            ...(section.customProps || {})
          };

          return <SectionComponent key={section.id} {...props} />;
        })}
      </Suspense>
    </PublicLayout>
  );
}