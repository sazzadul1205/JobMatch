// js/Sections/LegalSection/LegalSection.jsx

// React
import React from 'react';

// Components
import ArrowIcon from '../../components/Shared/ArrowIcon';

// Utility function to check if value exists (SAME as other sections)
const hasValue = (value) => {
  if (value === undefined || value === null) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  return true;
};

const LegalSection = ({
  legalData,
  bgColor = '',
  height = 'h-125 md:h-147.25',
  paddingY = '',
  paddingX = '',
  sectionClassName = '',
  sectionId = 'legal',
}) => {
  // Early return if no data
  if (!hasValue(legalData)) {
    return null;
  }

  // Safe destructuring with defaults
  const {
    background = {},
    overlay = {},
    textBox = {}
  } = legalData;

  // Check if there's any content to display
  const hasBackground = hasValue(background.src);
  const hasOverlay = hasValue(overlay.darkOverlay);
  const hasTitle = hasValue(textBox.title) || hasValue(textBox.titleLine2);
  const hasButton = hasValue(textBox.buttonText) && hasValue(textBox.buttonLink);

  const hasAnyContent = hasBackground || hasOverlay || hasTitle || hasButton;

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
          alt={background.alt || 'Legal background'}
          className="w-full h-full object-cover object-center md:object-cover"
        />
      )}

      {/* Dark Overlay - Only render if darkOverlay class exists */}
      {hasValue(overlay.darkOverlay) && (
        <div className={`absolute inset-0 ${overlay.darkOverlay}`}></div>
      )}

      {/* Additional overlay for mobile to ensure text readability */}
      <div className="absolute inset-0 bg-black/40 md:hidden"></div>

      {/* White Box Text - Positioned at bottom right - Only show if there's content */}
      {(hasTitle || hasButton) && (
        <div className="absolute bottom-5 right-5 md:bottom-10 lg:bottom-12.5 md:right-10 lg:right-50 bg-white/90 backdrop-blur-sm p-6 md:p-8 lg:p-12.5 w-[calc(100%-2.5rem)] md:w-auto lg:w-182.5 h-auto lg:h-75 shadow-lg rounded-lg">

          {/* Title */}
          {(hasValue(textBox.title) || hasValue(textBox.titleLine2)) && (
            <h3 className="text-black font-700 text-2xl md:text-3xl lg:text-[40px] bricolage-grotesque leading-tight">
              {hasValue(textBox.title) && <span>{textBox.title}</span>}
              {hasValue(textBox.title) && hasValue(textBox.titleLine2) && <br />}
              {hasValue(textBox.titleLine2) && <span>{textBox.titleLine2}</span>}
            </h3>
          )}

          {/* Button */}
          {hasValue(textBox.buttonText) && hasValue(textBox.buttonLink) && (
            <div className='pt-6 md:pt-7 lg:pt-9'>
              <button
                onClick={() => window.location.href = textBox.buttonLink}
                className='bricolage-grotesque border border-[#009BE2] rounded-md text-[#009BE2] px-4 py-3 sm:px-5 sm:py-3.5 lg:p-4 font-600 text-[14px] sm:text-[15px] lg:text-[16px] inline-flex items-center gap-3 group hover:bg-[#009BE2] hover:text-white transition-all duration-300'
              >
                <span>{textBox.buttonText}</span>
                <ArrowIcon className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default LegalSection;