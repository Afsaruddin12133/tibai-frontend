/**
 * SessionRightPanel Component
 * 
 * Displays Socratic feedback, the conversation feed, and live scores.
 * It renders:
 * - A live score badge and session status badge.
 * - Socratic round dialogue bubbles showing user input side-by-side with AI gaps analysis and feedback.
 * - Loading indicator animations while the AI is analyzing user inputs.
 */
export default function SessionRightPanel({ state, chatEndRef }) {
  // Styles for live status badges based on the session state
  const getStatusBadgeClass = (status) => {
    if (status === 'mastered') return 'text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/20';
    if (status === 'completed') return 'text-[#7C3AED] bg-[#7C3AED]/10 border border-[#7C3AED]/20';
    return 'text-[#F59E0B] bg-[#F59E0B]/10 border border-[#F59E0B]/20';
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0 bg-white">
      {/* Top dashboard stats header */}
      <div className="p-6 border-b border-slate-200 bg-white flex justify-between items-center sticky top-0 z-10 shadow-sm mt-1">
        <div className="flex items-center gap-2">
          <div className="bg-violet-100 p-2 rounded-lg text-violet-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <h2 className="text-base font-bold text-slate-900">Socratic Chat & Feedback</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Status:</span>
            <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide ${getStatusBadgeClass(state.status)}`}>
              {state.status || 'Active'}
            </span>
          </div>
          <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Current Score:</span>
            <span className={`text-2xl font-black ${
              state.currentScore >= 9 
                ? 'text-[#10B981]' 
                : state.currentScore >= 7 
                  ? 'text-[#3B82F6]' 
                  : state.currentScore >= 4 
                    ? 'text-[#F59E0B]' 
                    : 'text-[#EF4444]'
            }`}>
              {state.currentScore}
              <span className="text-lg text-slate-400">/10</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main scrollable chat dialogue flow */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F9FAFB]">
        {/* Initial Greeting Bubble from AI Teacher */}
        <div className="flex justify-start animate-fade-in-up">
          <div className="ai-chat-bubble p-5 shadow-md max-w-[85%] border-t-4 border-t-[#7C3AED] rounded-[16px] rounded-tl-sm bg-white">
            <p className="text-[11px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
              <span className="bg-slate-100 p-1.5 rounded-md text-slate-500">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span> 
              AI Teacher
            </p>
            <p className="text-slate-800 leading-relaxed text-sm">
              {state.message || `Great choice of topic! Let's start the Socratic review. ${state.question}`}
            </p>
          </div>
        </div>

        {/* Dynamic history rounds containing user input & detailed AI analysis */}
        {state.rounds.map((r, index) => (
          <div key={index} className="space-y-6">
            {/* User explanation bubble */}
            <div className="flex justify-end animate-fade-in-up">
              <div className="user-chat-bubble p-5 shadow-md max-w-[85%] bg-[#F5F3FF] border border-[#EDE9FE] rounded-[16px] rounded-tr-sm">
                <p className="text-[11px] font-bold text-[#7C3AED] mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="bg-white p-1.5 rounded-md shadow-sm text-violet-500">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span> 
                  You
                </p>
                <p className="leading-relaxed text-sm whitespace-pre-line text-slate-800">{r.userText}</p>
              </div>
            </div>

            {/* Detailed AI Socratic feedback block */}
            <div className="flex justify-start animate-fade-in-up">
              <div className="ai-chat-bubble p-6 shadow-md max-w-[85%] space-y-4 border-t-4 border-t-[#7C3AED] rounded-[16px] rounded-tl-sm bg-white">
                <div>
                  <p className="text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="bg-slate-100 p-1.5 rounded-md text-slate-500">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </span> 
                    AI Socratic Review (Round {index + 1})
                  </p>
                  
                  {/* Highlighting what the student got right */}
                  <div className="bg-[#10B981]/5 border border-[#10B981]/10 p-4 rounded-[12px] mb-3">
                    <p className="text-[10px] font-bold text-[#10B981] uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg> 
                      What You Got Right
                    </p>
                    <p className="text-slate-800 leading-relaxed text-sm font-medium">{r.whatYouGotRight || r.message}</p>
                  </div>
                </div>

                {/* Score and gaps layout grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 border-t border-slate-100">
                  {/* Round-specific mastery score */}
                  <div className="bg-slate-50 p-4 rounded-[12px] border border-slate-100 flex flex-col justify-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Round Score</p>
                    <p className={`text-3xl font-black mt-1 ${
                      r.score >= 9 
                        ? 'text-[#10B981]' 
                        : r.score >= 7 
                          ? 'text-[#3B82F6]' 
                          : r.score >= 4 
                            ? 'text-[#F59E0B]' 
                            : 'text-[#EF4444]'
                    }`}>
                      {r.score}
                      <span className="text-sm text-slate-400">/10</span>
                    </p>
                    <p className={`text-[10px] font-bold uppercase mt-1 ${
                      r.score >= 9 
                        ? 'text-[#10B981]' 
                        : r.score >= 7 
                          ? 'text-[#3B82F6]' 
                          : r.score >= 4 
                            ? 'text-[#F59E0B]' 
                            : 'text-[#EF4444]'
                    }`}>
                      {r.score >= 9 ? 'Mastered' : r.score >= 7 ? 'Almost There' : r.score >= 4 ? 'Getting There' : 'Just Starting'}
                    </p>
                  </div>

                  {/* List of identified concept gaps */}
                  {r.gaps && r.gaps.length > 0 && (
                    <div className="bg-[#EF4444]/5 p-4 rounded-[12px] border border-[#EF4444]/10 md:col-span-2">
                      <p className="text-[10px] font-bold text-[#EF4444] uppercase tracking-wider flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg> 
                        Identified Gaps
                      </p>
                      <ul className="text-xs text-slate-700 list-disc list-inside mt-2 space-y-1.5 font-medium">
                        {r.gaps.map((gap, i) => (
                          <li key={i} className="leading-relaxed">{gap}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Socratic follow-up questions targeting identified gaps */}
                {r.followUp && !(state.sessionComplete && index === state.rounds.length - 1) && (
                  <div className="bg-[#3B82F6]/5 p-4 rounded-[12px] border border-[#3B82F6]/10 mt-2">
                    <p className="text-[10px] font-bold text-[#3B82F6] uppercase tracking-wider flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg> 
                      Follow-up Question
                    </p>
                    <p className="text-sm font-semibold text-slate-800 mt-1.5 leading-relaxed">{r.followUp}</p>
                  </div>
                )}

                {/* Encouragement banner to keep learner motivated */}
                {(r.encouragement || r.encouragementLine) && (
                  <div className="mt-2 text-sm text-[#7C3AED] font-semibold italic text-center px-4 bg-violet-50 py-2 rounded-[8px]">
                    "{r.encouragement || r.encouragementLine}"
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Analyzing state bubble */}
        {state.loading && (
          <div className="flex justify-start animate-fade-in-up">
            <div className="ai-chat-bubble p-5 shadow-md flex items-center gap-3 border-t-4 border-t-[#7C3AED] rounded-[16px] rounded-tl-sm bg-white">
              <div className="flex space-x-1.5 items-center bg-slate-50 p-2 rounded-lg">
                <div className="w-2 h-2 bg-[#7C3AED] rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-[#7C3AED] rounded-full animate-bounce delay-200"></div>
                <div className="w-2 h-2 bg-[#7C3AED] rounded-full animate-bounce delay-300"></div>
              </div>
              <span className="text-xs text-slate-500 font-semibold tracking-wide">AI is analyzing your explanation...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>
    </div>
  );
}
