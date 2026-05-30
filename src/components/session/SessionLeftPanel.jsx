/**
 * SessionLeftPanel Component
 * 
 * Displays the user's workspace where they read Socratic questions and type their explanations.
 * Supports character constraints (max 2000 characters), validation display, and session completion states.
 */
export default function SessionLeftPanel({
  state,
  replyInput,
  setReplyInput,
  validationError,
  setValidationError,
  isSubmitBlocked,
  handleReplySubmit,
  handleFinishSession,
  isDesktop,
  leftPanelWidth
}) {
  return (
    <div 
      className="bg-white border-r border-slate-200 flex flex-col h-screen overflow-hidden relative shrink-0"
      style={isDesktop ? { width: `${leftPanelWidth}%` } : { width: '100%' }}
    >
      {/* Premium top accent border gradient */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#10B981]"></div>
      
      {/* Sticky header showcasing the active topic */}
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10 mt-1">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Your Explanation Workspace</h2>
          <p className="text-xs text-slate-500 mt-0.5">Teach the concept in your own words.</p>
        </div>
        <span className="bg-[#7C3AED]/10 text-[#7C3AED] border border-[#7C3AED]/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
          {state.topic}
        </span>
      </div>

      <div className="flex-1 p-6 flex flex-col justify-between overflow-y-auto space-y-4">
        {!state.sessionComplete ? (
          <div className="space-y-4">
            {/* Display active question from AI */}
            <div className="bg-[#F5F3FF] border border-[#EDE9FE] p-5 rounded-[16px]">
              <span className="text-xs font-bold text-[#7C3AED] uppercase tracking-wider block mb-1">AI Question</span>
              <p className="text-slate-800 font-semibold leading-relaxed text-sm md:text-base">
                {state.question || "Explain what you know about this topic."}
              </p>
            </div>

            {/* User explanation text area */}
            <div className="relative">
              <textarea
                value={replyInput}
                onChange={(e) => {
                  setReplyInput(e.target.value);
                  if (validationError) setValidationError('');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (e.ctrlKey) {
                      // Ctrl+Enter: manually insert a newline at the cursor position
                      e.preventDefault();
                      const el = e.target;
                      const start = el.selectionStart;
                      const end = el.selectionEnd;
                      const newValue = replyInput.slice(0, start) + '\n' + replyInput.slice(end);
                      setReplyInput(newValue);
                      // Restore cursor position after React re-renders
                      requestAnimationFrame(() => {
                        el.selectionStart = el.selectionEnd = start + 1;
                      });
                    } else {
                      // Plain Enter: submit the explanation
                      e.preventDefault();
                      handleReplySubmit();
                    }
                  }
                }}
                disabled={state.loading}
                className="w-full h-64 p-5 border border-slate-200 rounded-[16px] focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent resize-none transition-all shadow-inner text-slate-800 placeholder-slate-400 bg-[#F9FAFB]"
                placeholder="Explain the concept here in detail..."
                maxLength={2000}
              />
              <div className="flex justify-between items-center mt-2 text-xs text-slate-400 px-1">
                {/* Character count reminder */}
                <span className={replyInput.length > 1900 ? "text-[#EF4444] font-bold" : "font-medium"}>
                  {replyInput.length} / 2000 chars
                </span>
                {validationError && (
                  <span className="text-[#EF4444] font-semibold flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    {validationError}
                  </span>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Concluded/completed feedback state */
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 py-12 animate-fade-in-up">
            <div className="w-24 h-24 bg-[#10B981]/10 rounded-full flex items-center justify-center mb-2 shadow-inner">
              <svg className="w-12 h-12 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-black text-slate-800">Session Concluded</h3>
            <p className="text-slate-500 max-w-sm leading-relaxed text-sm md:text-base">
              You've reached the end of this learning session. Review your final scores and detailed feedback!
            </p>
          </div>
        )}

        <div className="space-y-3 pt-4">
          {state.sessionComplete ? (
            <div className="bg-[#10B981]/10 border border-[#10B981]/20 p-5 rounded-[16px] text-slate-800 text-sm flex items-center justify-between">
              <div>
                <p className="font-bold text-[#10B981] text-base flex items-center gap-1.5">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Evaluation Complete!
                </p>
                <p className="text-xs text-slate-500 mt-0.5">The session is completed. Check your final scores.</p>
              </div>
              <button
                onClick={handleFinishSession}
                className="cursor-pointer bg-[#10B981] hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-[12px] transition-all shadow-lg shadow-[#10B981]/20 hover:-translate-y-0.5"
              >
                View Final Results
              </button>
            </div>
          ) : (
            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleFinishSession}
                className="cursor-pointer w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-4 rounded-[14px] transition-all"
              >
                Finish Early
              </button>
              <button
                onClick={handleReplySubmit}
                disabled={state.loading || isSubmitBlocked}
                className="cursor-pointer flex-1 relative overflow-hidden group bg-[#7C3AED] text-white font-bold py-4 rounded-[14px] shadow-xl shadow-violet-600/20 hover:shadow-violet-600/40 transition-all duration-300 transform hover:-translate-y-0.5 border border-violet-500/20 disabled:opacity-50 disabled:hover:translate-y-0"
              >
                <div className="absolute inset-0 -translate-x-full group-hover:animate-shine bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 z-0"></div>
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300 z-0"></div>
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {state.loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <span>Submit Explanation</span>
                  )}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
