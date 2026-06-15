// resources/js/Pages/Frontend/ProjectsAndProgramsDetails/ProjectsAndProgramsDetails.jsx

import React from 'react';
import { Head } from "@inertiajs/react";
import PublicLayout from '../../../layouts/PublicLayout';
import DynamicSectionRenderer from '../../../components/Shared/DynamicSectionRenderer';

// Program Content Section Component
const ProgramContentSection = ({ programData, slug, bgColor, paddingY, paddingX, sectionClassName, sectionId }) => {
  const renderHTML = (htmlString) => ({ __html: htmlString });
  if (!programData) return null;

  return (
    <section id={sectionId} className={`${bgColor} ${paddingY} ${paddingX} ${sectionClassName}`}>
      <h1 className='font-700 text-[100px] leading-tight pb-12.5'>
        {programData?.title}
      </h1>

      {programData?.image && (
        <div className="mb-6 sm:mb-8 md:mb-10 lg:mb-12.5">
          <img
            src={programData.image}
            alt={programData?.title || 'Program image'}
            className="w-full h-auto max-h-64 sm:max-h-80 md:max-h-96 lg:max-h-125 object-cover rounded-2xl"
          />
        </div>
      )}

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

const ProjectsAndProgramsDetails = ({
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
    if (section.component === 'ProgramContentSection') {
      return (
        <ProgramContentSection
          key={section.id}
          programData={pageData.programData}
          slug={slug}
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
      <Head title={`${pageData.programData?.title || 'Program'} | DUS - Dwip Unnayan Society`} />

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