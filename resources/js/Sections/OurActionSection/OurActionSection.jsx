// js/Sections/OurActionSection/OurActionSection.jsx

// React
import React from 'react';

// Utility function to check if value exists
const hasValue = (value) => {
  if (value === undefined || value === null) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

const OurActionSection = ({
  actionData,
  bgColor = 'bg-[#F5F5F5]',
  paddingY = 'py-10 sm:py-15 md:py-25 lg:py-37.5',
  paddingX = 'px-5 sm:px-10 md:px-20 lg:px-50',
  sectionClassName = '',
}) => {
  // Early return if no data
  if (!hasValue(actionData)) return null;

  const { section = {}, actions = [] } = actionData;

  // Early return if no content
  if (!hasValue(section.title) && !hasValue(section.description) && !hasValue(actions)) {
    return null;
  }

  return (
    <section
      id='our-action'
      className={`mx-auto ${bgColor} ${paddingX} ${paddingY} ${sectionClassName}`}
    >
      {/* Section Header */}
      {(section.title || section.description) && (
        <div className="text-center">
          {section.title && (
            <h1 className='bricolage-grotesque font-700 text-[28px] sm:text-[32px] md:text-[36px] lg:text-[40px] text-center text-[#080C14] pb-3 sm:pb-4'>
              {section.title}
            </h1>
          )}
          {section.description && (
            <p className='mx-auto font-400 text-center text-[16px] sm:text-[18px] lg:text-[20px] max-w-253 text-[#515151] leading-relaxed px-4 sm:px-0'>
              {section.description}
            </p>
          )}
        </div>
      )}

      {/* Actions Grid */}
      {actions.length > 0 && (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-7.5 pt-8 sm:pt-10 lg:pt-12.5'>
          {actions.map((action) => (
            <div
              key={action.id}
              className='bg-[#FAFAFA] hover:bg-white p-6 sm:p-8 md:p-10 lg:p-12.5 rounded-xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer hover:shadow-[0_6px_12px_rgba(0,0,0,0.10)]'
            >
              {action.icon && (
                <img
                  src={action.icon}
                  alt={action.alt || action.title || "Action icon"}
                  className='w-8 h-8 sm:w-10 sm:h-10 lg:w-12.5 lg:h-12.5 group-hover:scale-110 transition-transform duration-300 mb-3 sm:mb-4 lg:mb-5'
                />
              )}
              {action.title && (
                <h3 className='bricolage-grotesque font-600 text-[20px] sm:text-[22px] lg:text-[24px] text-[#080C14] mb-2 sm:mb-3'>
                  {action.title}
                </h3>
              )}
              {action.description && (
                <p className='font-400 text-[14px] sm:text-[15px] lg:text-[16px] text-[#515151] leading-relaxed'>
                  {action.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default OurActionSection;