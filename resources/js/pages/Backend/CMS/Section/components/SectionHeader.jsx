// resources/js/pages/Backend/CMS/Section/components/SectionHeader.jsx

// React
import React from 'react';
import { Link } from '@inertiajs/react';

// Icons
import { FaSpinner } from 'react-icons/fa';

const SectionHeader = ({ page, stats, isSaving, dragError }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <Link
            // eslint-disable-next-line no-undef
            href={route('backend.cms.pages.index')}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors group"
          >
            <span className="group-hover:-translate-x-1 transition-transform inline-block">←</span>
            <span>Back to Pages</span>
          </Link>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Sections - {page.name}</h1>
        <p className="text-sm text-gray-500 mt-1">
          {stats.total} sections •
          {stats.fixed > 0 && (
            <span className="ml-2 text-blue-600">🔒 {stats.fixed} fixed</span>
          )}
          {stats.banner > 0 && (
            <span className="ml-2 text-yellow-600">⭐ {stats.banner} banner</span>
          )}
          {stats.shared > 0 && (
            <span className="ml-2 text-green-600">🔄 {stats.shared} shared</span>
          )}
          {stats.jobs > 0 && (
            <span className="ml-2 text-purple-600">💼 {stats.jobs} jobs</span>
          )}
          {stats.hasData > 0 && (
            <span className="ml-2 text-blue-600">📦 {stats.hasData} with data</span>
          )}
          {isSaving && (
            <span className="ml-2 text-blue-600 flex items-center gap-1">
              <FaSpinner className="animate-spin" size={12} />
              Saving order...
            </span>
          )}
          {dragError && (
            <span className="ml-2 text-red-600">{dragError}</span>
          )}
        </p>
      </div>
    </div>
  );
};

export default SectionHeader;