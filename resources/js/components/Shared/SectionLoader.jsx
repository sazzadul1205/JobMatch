// resources/js/components/Shared/SectionLoader.jsx

import React from 'react';

const SectionLoader = ({ message = "Loading Pages..." }) => {
  return (
    <div className="w-full py-20 flex justify-center items-center min-h-screen">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-[#009BE2] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-[#515151] font-400">{message}</p>
      </div>
    </div>
  );
};

export default SectionLoader;