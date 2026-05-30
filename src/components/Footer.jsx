import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-100 py-12 px-6 relative overflow-hidden">
      {/* Decorative ambient footer dots */}
      <div className="absolute w-72 h-72 bg-[#EDE9FE]/10 rounded-full blur-[80px] -bottom-36 -left-36"></div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12 relative z-10">
        {/* Brand Information Column */}
        <div className="space-y-6 md:max-w-sm">
          <div className="flex items-center gap-3 select-none">
            <div className="relative flex items-center justify-center w-9 h-9">
              <svg className="w-9 h-9 drop-shadow-sm" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="tealGradFooter" x1="10" y1="10" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#10B981" />
                    <stop offset="1" stopColor="#059669" />
                  </linearGradient>
                  <linearGradient id="violetGradFooter" x1="4" y1="6" x2="22" y2="24" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#8B5CF6" />
                    <stop offset="1" stopColor="#6D28D9" />
                  </linearGradient>
                </defs>
                <path d="M14 10 C 11.79 10, 10 11.79, 10 14 V 20 C 10 22.2, 11.79 24, 14 24 H 18.5 L 23.5 28 V 24 H 24 C 26.2 24, 28 22.2, 28 20 V 14 C 28 11.79, 26.2 10, 24 10 Z" fill="#F0FDF4" stroke="url(#tealGradFooter)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M19 14.5 L19.4 16.6 L21.5 17 L19.4 17.4 L19 19.5 L18.6 17.4 L16.5 17 L18.6 16.6 Z" fill="url(#tealGradFooter)" />
                <path d="M8 6 C 5.79 6, 4 7.79, 4 10 V 16 C 4 18.2, 5.79 20, 8 20 H 8.5 V 24 L 13.5 20 H 18 C 20.2 20, 22 18.2, 22 16 V 10 C 22 7.79, 20.2 6, 18 6 Z" fill="#FFFFFF" stroke="url(#violetGradFooter)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="9" cy="13" r="1.3" fill="url(#violetGradFooter)" />
                <circle cx="13" cy="13" r="1.3" fill="url(#violetGradFooter)" />
                <circle cx="17" cy="13" r="1.3" fill="url(#violetGradFooter)" />
              </svg>
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-[24px] font-black tracking-[-0.05em] text-slate-900 lowercase leading-none">
                teach<span className="text-[#7C3AED]">it</span>back
              </span>
              <span className="text-[6px] font-bold text-slate-400 uppercase tracking-[0.22em] mt-0.5 ml-[2px]">
                We turn learners into teachers
              </span>
            </div>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed pr-4">
            Harnessing the Feynman Technique and active learning to help minds master complex topics through teaching.
          </p>
        </div>

        {/* Navigation Links Columns */}
        <div className="flex flex-col sm:flex-row gap-12 md:gap-24">
          {/* Platform Column */}
          <div className="space-y-5">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Platform</h4>
            <ul className="space-y-3 text-sm font-medium">
              <li>
                <Link to="/session" className="text-slate-500 hover:text-[#7C3AED] transition-colors">Start Socratic Session</Link>
              </li>
              <li>
                <Link to="/history" className="text-slate-500 hover:text-[#7C3AED] transition-colors">History Dashboard</Link>
              </li>
            </ul>
          </div>

          {/* Cognitive Science Column */}
          <div className="space-y-5">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Cognitive Science</h4>
            <ul className="space-y-3 text-sm font-medium">
              <li>
                <a href="https://en.wikipedia.org/wiki/Feynman_technique" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-[#7C3AED] transition-colors">Feynman Technique</a>
              </li>
              <li>
                <a href="https://en.wikipedia.org/wiki/Memorization" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-[#7C3AED] transition-colors">Active Recall</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 relative z-10">
      <span className="text-xs font-medium text-slate-400">
        &copy; {new Date().getFullYear()} Teach It Back. All rights reserved.
      </span>
    </div>
    </footer>
  );
};

export default Footer;
