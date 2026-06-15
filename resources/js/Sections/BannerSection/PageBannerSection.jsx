// js/Sections/BannerSection/PageBannerSection.jsx

// React
import React from 'react';

// Utility function to check if value exists (SAME as other sections)
const hasValue = (value) => {
  if (value === undefined || value === null) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  return true;
};

const PageBannerSection = ({
  bannerData,
  bgColor = '',
  height = 'h-125 md:h-147.25',
  paddingY = '',
  paddingX = '',
  sectionClassName = '',
  sectionId = 'page-banner',
}) => {
  // Early return if no data (SAME pattern)
  if (!hasValue(bannerData)) {
    return null;
  }

  // Safe destructuring with defaults (SAME pattern)
  const {
    background = {},
    overlay = {},
    content = {},
  } = bannerData;

  const title = content.title || {};
  const description = content.description || {};

  // Check if there's any content to display
  const hasTitle = hasValue(title.text);
  const hasDescription = hasValue(description.text);
  const hasBackground = hasValue(background.src);
  const hasOverlays = hasValue(overlay.darkOverlay) || hasValue(overlay.gradient);

  const hasAnyContent = hasTitle || hasDescription || hasBackground || hasOverlays;

  if (!hasAnyContent) {
    return null;
  }

  return (
    <section
      id={sectionId}
      className={`relative w-full ${height} overflow-hidden ${bgColor} ${paddingY} ${paddingX} ${sectionClassName}`}
    >
      {/* Background Image - Only render if src exists */}
      {hasValue(background.src) && (
        <img
          src={background.src}
          alt={background.alt || 'Banner background'}
          className="w-full h-full object-cover object-center md:object-cover"
        />
      )}

      {/* Dark Overlay - Only render if darkOverlay class exists */}
      {hasValue(overlay.darkOverlay) && (
        <div className={`absolute inset-0 ${overlay.darkOverlay}`}></div>
      )}

      {/* Left Dark Gradient - Only render if gradient class exists */}
      {hasValue(overlay.gradient) && (
        <div className={`absolute inset-0 ${overlay.gradient}`}></div>
      )}

      {/* Additional overlay for mobile to ensure text readability */}
      <div className="absolute inset-0 bg-black/40 md:hidden"></div>

      {/* Content - Only render if there's content to show */}
      {(hasTitle || hasDescription) && (
        <div className="absolute left-0 md:left-10 inset-0 flex items-center p-5 md:p-12.5">
          <div className="w-full px-4 md:px-20 text-white space-y-3 md:space-y-5">

            {/* Title - Only render if text exists */}
            {hasTitle && (
              <h1 className={`bricolage-grotesque font-bold leading-tight text-[32px] md:text-[100px] text-center md:text-left w-full md:w-215.75 ${title.className || ''}`}>
                {title.text}
              </h1>
            )}

            {/* Description - Only render if text exists */}
            {hasDescription && (
              <p className={`bricolage-grotesque font-normal text-[14px] md:text-[30px] leading-tight text-center md:text-left text-white w-full md:w-215.75 line-clamp-3 md:line-clamp-none ${description.className || ''}`}>
                {description.text}
              </p>
            )}

          </div>
        </div>
      )}
    </section>
  );
};

export default PageBannerSection;