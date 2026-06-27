// resources/js/pages/Backend/CMS/Section/components/SectionFooter.jsx

import React from 'react';
import { FaGripVertical } from 'react-icons/fa';

const SectionFooter = ({ sections, hasData }) => {
  const stats = {
    total: sections.length,
    banner: sections.filter(s => s.component === 'HomeBanner' || s.component === 'PageBannerSection').length,
    fixed: sections.filter(s => s.is_fixed_section).length,
    shared: sections.filter(s => s.data_table === 'shared_data').length,
    jobs: sections.filter(s => s.data_table === 'jobs').length,
    hasData: sections.filter(s => hasData(s)).length,
  };

  return (
    <div className="mt-4 flex items-center gap-4 text-xs text-gray-400 flex-wrap">
      <span>📊 Total: {stats.total} sections</span>
      <span>⭐ Banner: {stats.banner}</span>
      <span>🔒 Fixed: {stats.fixed}</span>
      <span>🔄 Shared: {stats.shared}</span>
      <span>💼 Jobs: {stats.jobs}</span>
      <span>📦 Has Data: {stats.hasData}</span>
      <span>💡 Drag the <FaGripVertical className="inline text-gray-400" size={12} /> handle or use ↑ ↓ buttons to reorder</span>
      <span>🔒 Fixed sections cannot be moved</span>
    </div>
  );
};

export default SectionFooter;