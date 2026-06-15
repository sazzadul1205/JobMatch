// resources/js/components/Shared/DynamicSectionRenderer.jsx

// React
import React, { Suspense } from 'react';

// Import section loader
import SectionLoader from './SectionLoader';


// Import section registry
import { SECTION_COMPONENTS, SECTION_CONFIGS } from '../../config/sectionRegistry';

const DynamicSectionRenderer = ({
  section,           // Section config from SECTION_ORDER_CONFIG
  pageData,          // All page data (sectionDataMap)
  globalProps = {}   // Global props like storageUrl
}) => {
  const {
    id,
    component: componentName,
    propName,
    dataKey,
    customProps = {},
    isSpecialSection = false,
  } = section;

  // Get the component from registry
  const Component = SECTION_COMPONENTS[componentName];

  if (!Component) {
    console.warn(`Component "${componentName}" not found in registry`);
    return null;
  }

  // Build component props
  let componentProps = { ...customProps, ...globalProps };

  // Get config for this component
  const config = SECTION_CONFIGS[componentName];

  if (config?.isMultiProp) {
    // Handle multi-prop components (like BlogSection)
    config.props.forEach(prop => {
      if (pageData[prop] !== undefined) {
        componentProps[prop] = pageData[prop];
      }
    });
  } else if (propName && dataKey) {
    // Handle standard single prop sections
    componentProps[propName] = pageData[dataKey];
  } else if (propName) {
    // Fallback: use propName as both prop and dataKey
    componentProps[propName] = pageData[propName];
  }

  return (
    <Suspense fallback={<SectionLoader message={`Loading ${id}...`} />}>
      <Component {...componentProps} />
    </Suspense>
  );
};

export default DynamicSectionRenderer;