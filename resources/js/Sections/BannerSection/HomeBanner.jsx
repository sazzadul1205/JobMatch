// js/Sections/BannerSection/HomeBanner.jsx

// React
import React from 'react';

// Arrow Icon
import ArrowIcon from '../../components/Shared/ArrowIcon';

// Utility function for consistent value checking
const hasValue = (value) => {
  if (value === undefined || value === null) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  return true;
};

const HomeBanner = ({
  bannerData,
  bgColor = '',
  height = 'h-125 md:h-280',
  sectionClassName = '',
}) => {
  // If bannerData doesn't exist, don't render anything
  if (!hasValue(bannerData)) {
    return null;
  }

  // Destructure with fallbacks to prevent errors
  const {
    background = {},
    overlay = {},
    content = {},
    buttons = []
  } = bannerData;

  // Check if there's any content to display
  const hasAnyContent = hasValue(content.tagline?.text) ||
    hasValue(content.title?.text) ||
    hasValue(content.description?.text) ||
    hasValue(buttons);

  return (
    <section
      id="banner"
      className={`relative w-full ${height} overflow-hidden ${bgColor} ${sectionClassName}`}
    >
      {/* Background Image - Only render if src exists */}
      {hasValue(background.src) && (
        <img
          src={background.src}
          alt={background.alt || "Banner background"}
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

      {/* Additional overlay for mobile - Always show */}
      <div className="absolute inset-0 bg-black/40 md:hidden"></div>

      {/* Content - Only render if there's any content */}
      {hasAnyContent && (
        <div className="absolute left-0 md:left-5 inset-0 flex items-center p-5 md:p-12.5">
          <div className="w-full px-4 md:px-20 text-white space-y-3 md:space-y-5">

            {/* Tagline - Only render if text exists */}
            {hasValue(content.tagline?.text) && (
              <p className={`bricolage-grotesque ${content.tagline.className || ''} text-white text-center md:text-left text-sm md:text-[30px] tracking-[2px] md:tracking-[4px]`}>
                {content.tagline.text}
              </p>
            )}

            {/* Title - Only render if text exists */}
            {hasValue(content.title?.text) && (
              <h1 className={`bricolage-grotesque font-bold leading-tight text-[32px] md:text-[100px] text-center md:text-left w-full md:w-215.75`}>
                {content.title.text}
              </h1>
            )}

            {/* Description - Only render if text exists */}
            {hasValue(content.description?.text) && (
              <p className={`bricolage-grotesque font-normal text-[14px] md:text-[30px] leading-tight text-center md:text-left text-white w-full md:w-215.75 line-clamp-3 md:line-clamp-none`}>
                {content.description.text}
              </p>
            )}

            {/* Buttons - Only render if buttons array has items */}
            {hasValue(buttons) && (
              <div className='flex flex-col sm:flex-row items-center gap-3 md:gap-6 pt-5 md:pt-7.5'>
                {buttons.map((button) => (
                  <button
                    key={button.id || Math.random()}
                    onClick={() => {
                      if (button.link) {
                        window.location.href = button.link;
                      }
                    }}
                    className={`capitalize font-600 text-[14px] md:text-[18px] px-5 md:px-7.5 py-3 md:py-5 bricolage-grotesque rounded-md inline-flex items-center justify-center gap-2 md:gap-3 group transition-all duration-300 w-full sm:w-auto ${button.className || ''}`}
                  >
                    <span>{button.text}</span>
                    {button.icon && (
                      <ArrowIcon className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300 w-4 h-4 md:w-5 md:h-5" />
                    )}
                  </button>
                ))}
              </div>
            )}

          </div>
        </div>
      )}
    </section>
  );
};

export default HomeBanner;