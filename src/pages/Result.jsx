import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

/**
 * Result Page Component
 * 
 * Displays the final score and knowledge gaps after completing a session.
 * Features:
 * - A circular progress gauge calculated dynamically from SVG metrics.
 * - Score config mapper to render different styles for Mastered, Almost There, etc.
 * - Knowledge gap filters that extract unique gap listings from the session context.
 */

const Result = () => {
  // Update page headers dynamically on mount for SEO indexing optimization
  useEffect(() => {
    document.title = "Socratic Evaluation Results | Teach It Back";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "View your final topic mastery score and map of identified knowledge gaps. Analyze explanations and review feedback for deeper understanding.");
    }
  }, []);

  const { state, dispatch } = useSession();
  const navigate = useNavigate();
  const [animateProgress, setAnimateProgress] = useState(false);

  // If no session exists or has been completed, redirect back home on initial load
  useEffect(() => {
    if (!state.sessionId && !state.finalResult) {
      navigate('/');
    }
    // Trigger animation slightly after mount for the gauge
    setTimeout(() => setAnimateProgress(true), 300);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Extract score, topic, and status from either finalResult or active session state
  const score = state.finalResult?.finalScore ?? state.currentScore;
  const topic = state.finalResult?.topic || state.topic;
  
  // Extract and combine all unique knowledge gaps from all rounds
  const rounds = state.finalResult?.rounds || state.rounds || [];
  const allGaps = Array.from(
    new Set(rounds.flatMap(r => r.gaps || []))
  ).filter(Boolean);

  const hasParticipated = rounds.length > 0;

  const handleTryAgain = () => {
    dispatch({ type: 'RESET_SESSION' });
    navigate('/session');
  };

  const handleGoHome = () => {
    dispatch({ type: 'RESET_SESSION' });
    navigate('/');
  };

  // Determine styling and labels based on score
  const getScoreConfig = (score) => {
    if (!hasParticipated) {
      return { 
        strokeColor: 'text-slate-300',
        textColor: 'text-slate-400',
        badgeStyle: 'bg-slate-100 text-slate-500 border-slate-200', 
        label: 'Not Started', 
        criteria: "You haven't started teaching yet! Jump back in and explain the topic to test your knowledge." 
      };
    }
    if (score >= 9) return { 
      strokeColor: 'text-[#10B981]',
      textColor: 'text-[#10B981]',
      badgeStyle: 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20 shadow-[0_0_15px_rgba(16,185,129,0.3)]', 
      label: 'Mastered', 
      criteria: 'Deep, accurate explanation using correct terminology.' 
    };
    if (score >= 7) return { 
      strokeColor: 'text-[#3B82F6]',
      textColor: 'text-[#3B82F6]',
      badgeStyle: 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20', 
      label: 'Almost There', 
      criteria: 'Mostly correct with minor gaps remaining.' 
    };
    if (score >= 4) return { 
      strokeColor: 'text-[#F59E0B]',
      textColor: 'text-[#F59E0B]',
      badgeStyle: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20', 
      label: 'Getting There', 
      criteria: 'Some correct ideas but key gaps remain.' 
    };
    return { 
      strokeColor: 'text-[#EF4444]',
      textColor: 'text-[#EF4444]',
      badgeStyle: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20', 
      label: 'Just Starting', 
      criteria: 'Missing core concepts or contains factual errors.' 
    };
  };

  const scoreConfig = getScoreConfig(score);
  
  // SVG Math for Circular Gauge
  const radius = 74;
  const circumference = 2 * Math.PI * radius;
  // If not participated, show 0 progress, otherwise animate to the actual score
  const dashoffset = circumference - ((animateProgress && hasParticipated ? score : 0) / 10) * circumference;

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col justify-between">
      <Navbar />

      <div className="flex-1 py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
        {/* Subtle dynamic background highlights */}
        <div className="absolute w-[800px] h-[800px] bg-[#7C3AED]/5 rounded-full blur-[140px] -top-80 -left-60 animate-float pointer-events-none"></div>
        <div className="absolute w-[800px] h-[800px] bg-[#10B981]/5 rounded-full blur-[140px] -bottom-80 -right-60 animate-float-delayed pointer-events-none"></div>

        <div className="max-w-4xl w-full space-y-10 relative z-10">
          
          {/* Header Section */}
          <div className="text-center animate-fade-in-up">
            <h1 className="text-5xl font-black text-slate-900 tracking-tight">Final Review</h1>
            <p className="text-lg text-slate-500 mt-4 max-w-xl mx-auto">
              Here is your Socratic evaluation on <span className="font-bold text-[#7C3AED] bg-violet-50 px-2 py-0.5 rounded-md">"{topic}"</span>.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in-up-delay-1">
            
            {/* Circular Gauge Card (Left/Top) */}
            <div className="lg:col-span-5 bg-white/90 backdrop-blur-xl rounded-[32px] border border-slate-200/80 p-10 shadow-2xl shadow-violet-500/10 flex flex-col items-center text-center">
              <h3 className="text-2xl font-black text-slate-800 mb-2">Mastery Score</h3>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                {scoreConfig.criteria}
              </p>
              
              <div className="relative flex items-center justify-center group">
                {/* Glow behind the circle if mastered */}
                {score >= 9 && hasParticipated && (
                  <div className="absolute inset-0 bg-[#10B981]/20 rounded-full blur-[30px] animate-pulse"></div>
                )}
                
                {/* Premium SVG Gauge */}
                <svg className="w-56 h-56 transform -rotate-90 relative z-10 drop-shadow-sm">
                  {/* Background Track */}
                  <circle
                    cx="112" cy="112" r={radius}
                    stroke="currentColor" strokeWidth="16" fill="transparent"
                    className="text-slate-100"
                  />
                  {/* Progress Line */}
                  <circle
                    cx="112" cy="112" r={radius}
                    stroke="currentColor" strokeWidth="16" fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashoffset}
                    strokeLinecap="round"
                    className={`transition-all duration-[1500ms] ease-out ${scoreConfig.strokeColor}`}
                  />
                </svg>
                
                {/* Score Text in Center */}
                <div className="absolute flex flex-col items-center justify-center z-20 transition-transform duration-300 group-hover:scale-110">
                  <span className={`text-6xl font-black ${scoreConfig.textColor} tracking-tighter`}>{hasParticipated ? score : '-'}</span>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">out of 10</span>
                </div>
              </div>

              <div className="mt-8">
                <span className={`inline-flex items-center px-5 py-2 rounded-full text-sm font-black uppercase tracking-wider border transition-all ${scoreConfig.badgeStyle}`}>
                  {score >= 9 && hasParticipated && <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                  {scoreConfig.label}
                </span>
              </div>
            </div>

            {/* Knowledge Gaps Card (Right/Bottom) */}
            <div className="lg:col-span-7 bg-white/90 backdrop-blur-xl rounded-[32px] border border-slate-200/80 p-8 md:p-10 shadow-2xl shadow-violet-500/10 h-full flex flex-col">
              <h3 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
                <span className="text-violet-600 bg-violet-100 p-2.5 rounded-xl shadow-sm border border-violet-200">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                </span> 
                Identified Knowledge Gaps
              </h3>

              <div className="flex-1 flex flex-col justify-center">
                {!hasParticipated ? (
                  <div className="text-center py-12 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[24px]">
                    <div className="bg-slate-200/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <h4 className="text-slate-700 font-black text-lg">No Answers Provided</h4>
                    <p className="text-sm text-slate-500 mt-2 px-6 max-w-sm mx-auto leading-relaxed">You haven't explained anything yet! Try teaching the AI to discover your knowledge gaps.</p>
                  </div>
                ) : allGaps.length > 0 ? (
                  <div className="space-y-4">
                    {allGaps.map((gap, i) => (
                      <div key={i} className="flex items-start gap-4 bg-gradient-to-r from-red-50 to-white border border-red-100 p-5 rounded-[20px] transition-all hover:shadow-md hover:border-red-200 hover:-translate-y-0.5">
                        <div className="text-red-500 bg-red-100 p-2 rounded-xl shrink-0 shadow-sm border border-red-200 mt-0.5">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        </div>
                        <p className="text-slate-700 text-[15px] font-medium leading-relaxed pt-1">{gap}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gradient-to-b from-emerald-50 to-emerald-50/20 border-2 border-dashed border-emerald-200 rounded-[24px]">
                    <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-500 shadow-sm border border-emerald-200">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <h4 className="text-emerald-600 font-black text-lg">Perfect Score! No Gaps</h4>
                    <p className="text-sm text-slate-500 mt-2 px-6 max-w-sm mx-auto leading-relaxed">Incredibly explained! You have a firm, sound understanding of this topic and no missing core concepts.</p>
                  </div>
                )}
              </div>
            </div>
            
          </div>

          {/* Navigation Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-5 pt-6 animate-fade-in-up-delay-2">
            <button
              onClick={handleTryAgain}
              className="cursor-pointer w-full sm:w-auto bg-white border-2 border-slate-200 text-slate-700 hover:border-[#7C3AED] hover:text-[#7C3AED] hover:bg-violet-50 font-black py-4 px-10 rounded-[16px] transition-all duration-300 shadow-sm flex items-center justify-center gap-3 group"
            >
              <svg className="w-5 h-5 transition-transform group-hover:-rotate-180 duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              Try Again
            </button>
            <button
              onClick={handleGoHome}
              className="cursor-pointer w-full sm:w-auto relative overflow-hidden group bg-[#7C3AED] text-white font-black py-4 px-12 rounded-[16px] shadow-xl shadow-violet-600/20 hover:shadow-violet-600/40 transition-all duration-300 transform hover:-translate-y-1 border border-violet-500/20 flex items-center justify-center gap-3"
            >
              <div className="absolute inset-0 -translate-x-full group-hover:animate-shine bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 z-0"></div>
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300 z-0"></div>
              <span className="relative z-10 flex items-center gap-2">
                Back to Home
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1.5 duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </span>
            </button>
          </div>
          
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Result;

