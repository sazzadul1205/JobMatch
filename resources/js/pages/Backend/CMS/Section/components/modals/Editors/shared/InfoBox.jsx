// resources/js/pages/Backend/CMS/Section/components/modals/Editors/shared/InfoBox.jsx

import React from 'react';

// icons
import { FaExternalLinkAlt } from 'react-icons/fa';

/**
 * Reusable Info Box Component for special sections
 * Used for sections that are controlled by other managers
 */
const InfoBox = ({
  title,
  description,
  note,
  linkText,
  linkUrl,
  icon: Icon,
  iconBgClass = 'bg-blue-100',
  iconColorClass = 'text-blue-600',
  bgColorClass = 'bg-blue-50',
  borderColorClass = 'border-blue-200',
  titleColorClass = 'text-blue-800',
  textColorClass = 'text-blue-700',
  noteColorClass = 'text-blue-600',
}) => {
  return (
    <div className={`mb-4 p-4 ${bgColorClass} rounded-lg border ${borderColorClass}`}>
      <div className="flex items-start gap-3">

        {/* Icon */}
        <div className="mt-0.5">
          <div className={`w-10 h-10 ${iconBgClass} rounded-lg flex items-center justify-center ${iconColorClass}`}>
            {Icon && <Icon size={20} />}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">

          {/* Title */}
          <h4 className={`text-sm font-semibold ${titleColorClass}`}>{title}</h4>

          {/* Description */}
          <p className={`text-sm ${textColorClass} mt-1`}>{description}</p>

          {/* Note */}
          {note && <p className={`text-xs ${noteColorClass} mt-1`}>{note}</p>}

          {/* External Link */}
          {linkText && linkUrl && (
            <button
              type="button"
              onClick={() => {
                window.location.href = linkUrl;
              }}
              className={`mt-2 inline-flex items-center gap-1 text-xs ${textColorClass} hover:underline`}
            >
              <FaExternalLinkAlt size={10} />
              {linkText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfoBox;