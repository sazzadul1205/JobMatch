// js/pages/Frontend/Home/Sections/StoriesSection.jsx

// React
import React, { useRef, useEffect, useState } from 'react';

// Arrow Icon
import ArrowIcon from '../../../../components/Shared/ArrowIcon';

const StoriesSection = ({
  storiesData,
  bgColor = 'bg-[#F5F5F5]',  // Default background color
  sectionClassName = '',      // Additional custom classes
}) => {
  // Refs for DOM elements and drag state
  const scrollContainerRef = useRef(null);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const isDraggingRef = useRef(false);

  // State only for cursor styling (triggers re-render)
  const [dragging, setDragging] = useState(false);

  // Set up drag-to-scroll event listeners
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // --- Mouse Event Handlers ---
    const onMouseDown = (e) => {
      // Prevent default only if not clicking on interactive elements (optional)
      // We'll let it be; dragging starts even over buttons, but click will still work if no movement
      isDraggingRef.current = true;
      setDragging(true);

      // Get initial position and scroll offset
      startX.current = e.pageX - container.offsetLeft;
      scrollLeftStart.current = container.scrollLeft;

      // Prevent text selection while dragging
      e.preventDefault();
    };

    const onMouseMove = (e) => {
      if (!isDraggingRef.current) return;

      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX.current) * 1.5; // Drag sensitivity
      container.scrollLeft = scrollLeftStart.current - walk;
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
      setDragging(false);
    };

    const onMouseLeave = () => {
      // End drag if mouse leaves the container
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        setDragging(false);
      }
    };

    // --- Touch Event Handlers ---
    const onTouchStart = (e) => {
      if (e.touches.length) {
        isDraggingRef.current = true;
        setDragging(true);

        startX.current = e.touches[0].pageX - container.offsetLeft;
        scrollLeftStart.current = container.scrollLeft;
      }
    };

    const onTouchMove = (e) => {
      if (!isDraggingRef.current || !e.touches.length) return;

      e.preventDefault(); // Prevent page scroll while dragging horizontally
      const x = e.touches[0].pageX - container.offsetLeft;
      const walk = (x - startX.current) * 1.5;
      container.scrollLeft = scrollLeftStart.current - walk;
    };

    const onTouchEnd = () => {
      isDraggingRef.current = false;
      setDragging(false);
    };

    // --- Attach Event Listeners ---
    // Mouse events
    container.addEventListener('mousedown', onMouseDown);
    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mouseup', onMouseUp);
    container.addEventListener('mouseleave', onMouseLeave);

    // Touch events (with passive: false for touchmove to allow preventDefault)
    container.addEventListener('touchstart', onTouchStart, { passive: false });
    container.addEventListener('touchmove', onTouchMove, { passive: false });
    container.addEventListener('touchend', onTouchEnd);
    container.addEventListener('touchcancel', onTouchEnd);

    // --- Cleanup ---
    return () => {
      container.removeEventListener('mousedown', onMouseDown);
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('mouseleave', onMouseLeave);

      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('touchend', onTouchEnd);
      container.removeEventListener('touchcancel', onTouchEnd);
    };
  }, []); // Empty dependency array - only run on mount/unmount

  return (
    <section
      id='stories'
      className={`${bgColor} ${sectionClassName} py-12 sm:py-16 md:py-25 lg:py-37.5`}
    >
      {/* Section Header - Full width with responsive padding */}
      <div className="text-center mx-auto px-5 sm:px-10 md:px-20 lg:px-50">
        <h3 className='bricolage-grotesque font-extrabold text-[32px] sm:text-[38px] md:text-[44px] lg:text-[50px] text-center text-[#080C14] pb-3 sm:pb-4 lg:pb-5'>
          {storiesData.section.title}
        </h3>
        <p className='bricolage-grotesque font-400 text-[16px] sm:text-[18px] lg:text-[20px] mx-auto max-w-200 text-center text-[#515151] pb-8 sm:pb-10 lg:pb-15'>
          {storiesData.section.description}
        </p>
      </div>

      {/* Full Width Scrollable Container with Hidden Scrollbar */}
      <div
        ref={scrollContainerRef}
        className={`
          flex overflow-x-auto gap-5 sm:gap-8 lg:gap-10 px-5 sm:px-10 md:px-20 lg:px-50 scroll-smooth w-full
          ${dragging ? 'cursor-grabbing select-none' : 'cursor-grab'}
          hide-scrollbar
        `}
        style={{
          scrollbarWidth: 'none',     // Firefox
          msOverflowStyle: 'none',    // IE/Edge
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {storiesData.stories.map((story) => (
          <div
            key={story.id}
            className='bg-[#FFFFFF] p-4 sm:p-5 lg:p-7.5 w-70 sm:w-[320px] md:w-100 lg:w-137.5 rounded-xl shrink-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-1'
          >
            <img
              src={story.image}
              alt={story.title}
              className='h-48 sm:h-56 md:h-72 lg:h-86.75 rounded-2xl mx-auto object-cover w-full'
            />
            <div className='p-3 sm:p-4 lg:p-5'>
              <span className='text-[#009BE2] font-400 text-[12px] sm:text-[14px] lg:text-[16px] pb-1 sm:pb-2 block'>
                {story.date}
              </span>
              <h3 className='text-[#080C14] font-600 text-[24px] sm:text-[28px] md:text-[32px] lg:text-[36px] leading-snug mb-3 sm:mb-4 lg:mb-5 line-clamp-2'>
                {story.title}
              </h3>
              <p className="bricolage-grotesque font-400 text-[14px] sm:text-[16px] lg:text-[20px] text-[#524B48] leading-relaxed line-clamp-4 sm:line-clamp-5 mb-3 sm:mb-4 lg:mb-5">
                {story.description}
              </p>
              <button className="bricolage-grotesque text-[#009BE2] font-600 text-[14px] sm:text-[15px] lg:text-[16px] inline-flex items-center gap-2 sm:gap-3 group hover:text-[#009BE2]/70 transition-all duration-300 whitespace-nowrap">
                Read More
                <ArrowIcon className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Optional: Scroll hint indicator (subtle gradient on edges) - Hidden on mobile for better UX */}
      <div className="relative mt-5 pointer-events-none hidden md:block">
        <div className={`absolute left-0 top-0 bottom-0 w-8 sm:w-10 lg:w-12 bg-linear-to-r from-${bgColor.replace('bg-', '')} to-transparent`}></div>
        <div className={`absolute right-0 top-0 bottom-0 w-8 sm:w-10 lg:w-12 bg-linear-to-l from-${bgColor.replace('bg-', '')} to-transparent`}></div>
      </div>

      {/* Hide scrollbar globally for this component */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default StoriesSection;