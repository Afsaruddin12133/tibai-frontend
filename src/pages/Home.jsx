import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

/**
 * Home Page Component
 * 
 * The main landing page of the application, featuring active recall definitions,
 * Socratic teaching principles, and a prominent CTA link to begin a learning session.
 */
const Home = () => {
  // Update page headers dynamically on mount for SEO indexing optimization
  useEffect(() => {
    document.title = "Teach It Back - Master Any Topic by Teaching AI";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Master any topic by teaching it to an AI. Teach It Back is a Socratic learning tool utilizing the Feynman Technique and active recall to find and close your knowledge gaps.");
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col justify-between">
      <Navbar />

      <div className="flex-1 flex items-center justify-center py-20 px-4 relative overflow-hidden">
        {/* Premium subtle gradient background details */}
        <div className="absolute w-[700px] h-[700px] bg-[#7C3AED]/10 rounded-full blur-[140px] -top-80 -left-60 animate-float pointer-events-none"></div>
        <div className="absolute w-[700px] h-[700px] bg-[#10B981]/10 rounded-full blur-[140px] -bottom-80 -right-60 animate-float-delayed pointer-events-none"></div>

        <main className="text-center px-6 max-w-4xl relative z-10 space-y-8 mt-12">

          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-800 tracking-tight leading-[1.15] opacity-0 animate-fade-in-up">
            Master Any Topic by <br className="hidden sm:block" />
            <span className="relative inline-block mt-2">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#10B981]">Teaching AI</span>
              {/* Premium abstract underline decoration */}
              <svg className="absolute w-full h-4 -bottom-1 left-0 text-[#10B981]/30 -z-10" viewBox="0 0 100 20" preserveAspectRatio="none">
                <path d="M0 15 Q 25 5, 50 15 T 100 15" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
              </svg>
            </span>
          </h2>

          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed opacity-0 animate-fade-in-up-delay-1">
            Explain a topic in your own words. Our AI asks smart follow-up questions, detects knowledge gaps, and helps you truly understand what you’re learning. <span className="text-slate-700 font-semibold">The best way to learn anything is to teach it.</span>
          </p>

          <div className="pt-8 flex justify-center opacity-0 animate-fade-in-up-delay-2">
            <Link
              to="/session"
              className="relative overflow-hidden group bg-[#7C3AED] text-white font-bold py-4 px-12 rounded-[14px] text-lg shadow-xl shadow-violet-600/20 hover:shadow-violet-600/40 transition-all duration-300 transform hover:-translate-y-1 border border-violet-500/20"
            >
              <span className="relative z-10 flex items-center gap-3">
                Start Learning Session
                <svg className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              {/* Premium Shimmer effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:animate-shine bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 z-0"></div>
              {/* Hover highlight overlay */}
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300 z-0"></div>
            </Link>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
