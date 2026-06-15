// resources/js/Pages/Frontend/DynamicPage.jsx

import React from 'react';
import { Head } from "@inertiajs/react";
import PublicLayout from "../../layouts/PublicLayout";
import DynamicSectionRenderer from '../../components/Shared/DynamicSectionRenderer';

const DynamicPage = ({
  topBarData,
  navbarData,
  footerData,
  storageUrl,
  sectionConfig,
  pageTitle,
  ...pageData
}) => {
  // Get enabled sections sorted by order
  const sectionsToRender = (sectionConfig?.sections || [])
    .filter(section => section.enabled === true)
    .sort((a, b) => a.order - b.order);

  return (
    <PublicLayout
      topBarData={topBarData}
      navbarData={navbarData}
      footerData={footerData}
      storageUrl={storageUrl}
    >
      <Head title={pageTitle || "DUS - Dwip Unnayan Society | Empowering Communities"} />

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

export default DynamicPage;