// resources/js/Pages/Frontend/BlogDetails/BlogDetails.jsx

import React from 'react';

// Inertia
import { Head, Link } from '@inertiajs/react';

import { CiCalendar } from "react-icons/ci";
import { FaRegClock, FaFacebookF, FaLinkedinIn, FaInstagram } from "react-icons/fa";

// Layout
import PublicLayout from '../../../layouts/PublicLayout';

// Components
import DynamicSectionRenderer from '../../../components/Shared/DynamicSectionRenderer';

// ============================================
// SPECIAL COMPONENTS (Not in registry)
// ============================================

// Banner Section Component
const BannerSection = ({ bannerData, blogData, storageUrl }) => {
  const tagColors = [
    "bg-[#3866FF]", "bg-[#503AF2]", "bg-[#00B894]",
    "bg-[#FF6B6B]", "bg-[#FDCB6E]", "bg-[#6C5CE7]",
  ];

  return (
    <section className="relative isolate w-full h-125 overflow-hidden bg-[#080C14]">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        {bannerData?.background?.src && (
          <img
            src={bannerData.background.src}
            alt={bannerData.background.alt || 'Banner background'}
            className="h-full w-full object-cover object-center"
          />
        )}
        <div className={`absolute inset-0 ${bannerData?.overlay?.darkOverlay || 'bg-black/60'}`}>
          {bannerData?.overlay?.gradient && (
            <div className={`absolute inset-0 ${bannerData.overlay.gradient}`} />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-275 mx-auto px-4 pt-24 sm:pt-28 lg:pt-32 h-full flex flex-col items-center justify-start text-center">
        {/* Tags */}
        <div className="flex items-center justify-center gap-2.5 flex-wrap mb-5">
          {blogData?.tags?.length > 0 ? (
            blogData.tags.map((tag, index) => (
              <span
                key={index}
                className={`text-white text-[12px] sm:text-[13px] font-semibold px-2 py-1 rounded-md ${tagColors[index % tagColors.length]}`}
              >
                {tag}
              </span>
            ))
          ) : (
            <span className="text-white bg-[#3866FF] text-[12px] sm:text-[13px] font-semibold px-2 py-1 rounded-md">
              Blog Post
            </span>
          )}
        </div>

        {/* Main Heading */}
        <h1 className="text-white font-bold text-[40px] sm:text-[54px] lg:text-[100px] leading-[1.05] mb-4 max-w-380">
          {blogData?.title || 'Blog Post'}
        </h1>

        {/* Meta */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 flex-wrap text-white text-[12px] sm:text-[14px] font-semibold">
          {/* Author */}
          <div className="flex items-center gap-2.5">
            <div className="relative w-5 h-5 rounded-full overflow-hidden">
              <img
                src="https://placehold.co/20x20"
                alt="Author"
                className="w-5 h-5 object-cover"
              />
              <div className="absolute inset-0 bg-[#503AF2]/40" />
            </div>
            <p className="flex items-center">
              BY :
              <Link className="underline pl-1">
                {blogData?.createdBy || 'ADMIN'}
              </Link>
            </p>
          </div>

          {/* Date */}
          <div className="flex items-center gap-2">
            <CiCalendar className="text-base" />
            <span>{blogData?.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}</span>
          </div>

          {/* Read time */}
          <div className="flex items-center gap-2">
            <FaRegClock className="text-base" />
            <span>{blogData?.timerRead || '5 MIN READ'}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

// Blog Content Section Component
const BlogContentSection = ({
  blogData,
  storageUrl,
  bgColor = 'bg-white',
  paddingY = 'py-12 lg:py-16',
  paddingX = 'px-4',
  sectionClassName = '',
  sectionId = 'blog-content'
}) => {
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `${storageUrl}/${imagePath}`;
  };

  const renderHTML = (htmlString) => ({ __html: htmlString });

  if (!blogData) return null;

  return (
    <section id={sectionId} className={`${bgColor} ${paddingY} ${paddingX} ${sectionClassName}`}>
      {/* Blog main image container with proper spacing */}
      <div className="relative z-10 max-w-275 mx-auto">
        {/* Image with negative margin to overlap banner */}
        <div className="-mt-16 sm:-mt-20 lg:-mt-24">
          <img
            src={getImageUrl(blogData?.image) || "https://placehold.co/1100x500"}
            alt={blogData?.title || "Blog main image"}
            className="w-full h-auto max-h-96 sm:max-h-125 object-cover object-center rounded-[28px] shadow-2xl"
          />
        </div>
      </div>

      {/* Blog content section - with proper top spacing */}
      <div className="max-w-275 mx-auto mt-12 sm:mt-16 lg:mt-20">
        <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-25">
          {/* Social media icons */}
          <div className="hidden lg:flex flex-col items-center gap-4 pt-2 sticky top-25">
            <a href="#" className="w-8 h-8 rounded-full bg-[#080C14] text-white flex items-center justify-center hover:bg-[#009BE2] transition-colors">
              <FaFacebookF className="text-sm" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-[#080C14] text-white flex items-center justify-center hover:bg-[#009BE2] transition-colors">
              <FaLinkedinIn className="text-sm" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-[#080C14] text-white flex items-center justify-center hover:bg-[#009BE2] transition-colors">
              <FaInstagram className="text-sm" />
            </a>
          </div>

          {/* Blog content */}
          <div className="flex-1">
            <div
              className="bricolage-grotesque prose prose-sm sm:prose-base lg:prose-lg max-w-none
                prose-headings:font-700 prose-headings:text-[#080C14]
                prose-p:text-[#333333] prose-p:leading-relaxed
                prose-ul:text-[#333333] prose-ul:leading-relaxed
                prose-li:text-[#333333] prose-li:leading-relaxed
                prose-strong:text-[#009BE2]
                prose-p:mt-4 prose-p:mb-4
                prose-h2:mt-8 prose-h2:mb-4
                prose-h3:mt-6 prose-h3:mb-3"
              dangerouslySetInnerHTML={renderHTML(blogData?.fullContent)}
            />
          </div>
        </div>
      </div>
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
      component: "BannerSection",
      isSpecialComponent: true,
      enabled: true,
      order: 1,
    },
    {
      id: "blog-content",
      component: "BlogContentSection",
      isSpecialComponent: true,
      enabled: true,
      order: 2,
      customProps: {
        bgColor: 'bg-white',
        paddingY: 'py-12 lg:py-16',
        paddingX: 'px-4',
      }
    },
    {
      id: "related-blogs",
      component: "BlogSection",
      enabled: true,
      // No propName/dataKey needed - handled by registry config
      order: 3,
      customProps: {
        bgColor: 'bg-[#F5F5F5]',
        sectionTitle: 'Related Blogs',
      }
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

const BlogDetails = ({
  topBarData,
  navbarData,
  footerData,
  storageUrl,
  slug,
  blogData,
  bannerData,
  relatedBlogs,
  upcomingEventsData,
}) => {

  // Prepare data mapping
  const pageData = {
    bannerData,
    blogData,
    relatedBlogs,
    upcomingEventsData,
    storageUrl,
    slug,
  };

  // Get enabled sections sorted by order
  const sectionsToRender = SECTION_ORDER_CONFIG.sections
    .filter(section => section.enabled === true)
    .sort((a, b) => a.order - b.order);

  // Helper to render special components
  const renderSpecialComponent = (section) => {
    const { component, customProps = {} } = section;

    if (component === 'BannerSection') {
      return (
        <BannerSection
          key={section.id}
          bannerData={pageData.bannerData}
          blogData={pageData.blogData}
          storageUrl={pageData.storageUrl}
          {...customProps}
        />
      );
    }

    if (component === 'BlogContentSection') {
      return (
        <BlogContentSection
          key={section.id}
          blogData={pageData.blogData}
          storageUrl={pageData.storageUrl}
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
      <Head title={`${blogData?.title || 'Blog Details'} | DUS - Dwip Unnayan Society | Empowering Communities`} />

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

export default BlogDetails;