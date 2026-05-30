import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop Component
 * 
 * Automatically scrolls the page body to the top (smoothly) whenever the pathname updates.
 * Also monitors user scroll position to toggle the visibility of a floating "Back to top" action button.
 */

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  // Scroll to top automatically when the route changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  // Show/hide floating button based on scroll position
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className=" cursor-pointer fixed bottom-8 right-8 z-[100] p-3.5 rounded-full bg-[#7C3AED] text-white shadow-xl shadow-violet-500/30 hover:bg-[#6D28D9] hover:shadow-violet-500/50 hover:-translate-y-1 transition-all duration-300 animate-fade-in-up flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-violet-300 group"
          aria-label="Scroll to top"
        >
          {/* Subtle shine effect on hover */}
          <div className="absolute inset-0 -translate-x-full group-hover:animate-shine bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 z-0 rounded-full"></div>
          <svg 
            className="w-5 h-5 relative z-10" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </>
  );
};

export default ScrollToTop;
