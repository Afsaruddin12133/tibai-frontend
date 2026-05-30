import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { checkHealth } from '../services/api';

/**
 * Navbar Component
 * 
 * Displays the top navigation links and checks the backend server health
 * periodically. Displays a real-time system status dot (green = online, red = offline).
 */
const Navbar = () => {
  const [isSystemOnline, setIsSystemOnline] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const data = await checkHealth();
        if (data && data.status === 'ok') {
          setIsSystemOnline(true);
        }
      } catch {
        // Mark server as offline if the healthcheck request fails
        setIsSystemOnline(false);
      }
    };
    fetchHealth();
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="w-full bg-white/80 backdrop-blur-md border-b border-slate-100 py-4 px-6 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Minimalist Socratic Feedback Loop Logo */}
        <Link to="/" className="flex items-center gap-3.5 select-none group">
          <div className="relative flex items-center justify-center w-11 h-11 group-hover:scale-105 transition-transform duration-300">
            <svg className="w-11 h-11 drop-shadow-sm" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="tealGrad" x1="10" y1="10" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#10B981" />
                  <stop offset="1" stopColor="#059669" />
                </linearGradient>
                <linearGradient id="violetGrad" x1="4" y1="6" x2="22" y2="24" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#8B5CF6" />
                  <stop offset="1" stopColor="#6D28D9" />
                </linearGradient>
                <filter id="bubbleShadow" x="-2" y="0" width="36" height="36" filterUnits="userSpaceOnUse">
                  <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.08" />
                </filter>
              </defs>

              {/* AI Bubble (Teal) - Background */}
              <path d="M14 10 C 11.79 10, 10 11.79, 10 14 V 20 C 10 22.2, 11.79 24, 14 24 H 18.5 L 23.5 28 V 24 H 24 C 26.2 24, 28 22.2, 28 20 V 14 C 28 11.79, 26.2 10, 24 10 Z" fill="#F0FDF4" stroke="url(#tealGrad)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              
              {/* AI Spark (Teal) */}
              <path d="M19 14.5 L19.4 16.6 L21.5 17 L19.4 17.4 L19 19.5 L18.6 17.4 L16.5 17 L18.6 16.6 Z" fill="url(#tealGrad)" />

              {/* User Bubble (Violet) - Foreground */}
              <path d="M8 6 C 5.79 6, 4 7.79, 4 10 V 16 C 4 18.2, 5.79 20, 8 20 H 8.5 V 24 L 13.5 20 H 18 C 20.2 20, 22 18.2, 22 16 V 10 C 22 7.79, 20.2 6, 18 6 Z" fill="#FFFFFF" stroke="url(#violetGrad)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" filter="url(#bubbleShadow)" />
              
              {/* User Dots (Violet) */}
              <circle cx="9" cy="13" r="1.3" fill="url(#violetGrad)" />
              <circle cx="13" cy="13" r="1.3" fill="url(#violetGrad)" />
              <circle cx="17" cy="13" r="1.3" fill="url(#violetGrad)" />
            </svg>
            
            {/* Status Indicator seamlessly attached to the bottom right of the icon cluster */}
            <span className={`absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full ring-2 ring-white transition-colors duration-500 ${isSystemOnline ? 'bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-[#EF4444]'}`}></span>
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-[26px] font-black tracking-[-0.05em] text-slate-900 lowercase leading-none transition-opacity group-hover:opacity-80">
              teach<span className="text-[#7C3AED]">it</span>back
            </span>
            <span className="text-[6.5px] font-bold text-slate-400 uppercase tracking-[0.22em] mt-0.5 ml-[2px]">
              We turn learners into teachers
            </span>
          </div>
        </Link>

        {/* Horizontal Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link 
            to="/" 
            className={`text-sm font-bold transition-all duration-200 ${isActive('/') ? 'text-[#7C3AED]' : 'text-slate-500 hover:text-[#7C3AED]'}`}
          >
            Home
          </Link>
          <Link 
            to="/history" 
            className={`text-sm font-bold transition-all duration-200 ${isActive('/history') ? 'text-[#7C3AED]' : 'text-slate-500 hover:text-[#7C3AED]'}`}
          >
            History 
          </Link>
        </div>

        {/* Navigation Action CTA */}
        <div>
          <Link 
            to="/session" 
            className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-sm py-2.5 px-5 rounded-[8px] shadow-md shadow-violet-600/10 hover:shadow-violet-600/20 transition-all duration-200"
          >
            New Session
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
