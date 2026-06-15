// resources/js/Pages/Frontend/AboutDetails/AboutDetails.jsx

import React from 'react';
import { Head } from "@inertiajs/react";
import PublicLayout from '../../../layouts/PublicLayout';
import DynamicSectionRenderer from '../../../components/Shared/DynamicSectionRenderer';

// Special component for this page only
const ContentSection = ({ title, content, bgColor, paddingY, paddingX, sectionClassName, sectionId }) => {
  const renderHTML = (htmlString) => ({ __html: htmlString });

  if (!title && !content) return null;

  return (
    <section id={sectionId} className={`${bgColor} ${paddingY} ${paddingX} ${sectionClassName}`}>
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

const AboutDetails = ({
  topBarData,
  navbarData,
  footerData,
  storageUrl,
  sectionConfig,
  slug,
  ...pageData
}) => {
  const sectionsToRender = (sectionConfig?.sections || [])
    .filter(section => section.enabled === true)
    .sort((a, b) => a.order - b.order);

  const renderSpecialComponent = (section) => {
    if (section.component === 'ContentSection') {
      return (
        <ContentSection
          key={section.id}
          title={pageData.subPageData?.title}
          content={pageData.subPageData?.content}
          {...section.customProps}
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
      <Head title={`${pageData.subPageData?.title || 'About'} | DUS - Dwip Unnayan Society`} />

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

export default AboutDetails;