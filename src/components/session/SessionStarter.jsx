/**
 * SessionStarter Component
 * 
 * This renders the initial UI card where the user enters the topic they want to learn.
 * It enforces a 2,500 character limit on the input and shows error states,
 * such as local validation failures or backend validation (like inappropriate language).
 */
export default function SessionStarter({
  topicInput,
  setTopicInput,
  loading,
  validationError,
  error,
  handleStartSession,
  handleCancelSession
}) {
  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative ambient background highlights */}
      <div className="absolute w-[700px] h-[700px] bg-[#7C3AED]/10 rounded-full blur-[140px] -top-80 -left-60 animate-float pointer-events-none"></div>
      <div className="absolute w-[700px] h-[700px] bg-[#10B981]/10 rounded-full blur-[140px] -bottom-80 -right-60 animate-float-delayed pointer-events-none"></div>

      {/* Main card with backdrop blur and premium borders */}
      <div className="w-full max-w-xl bg-white/80 backdrop-blur-xl border border-slate-200/80 p-8 md:p-10 rounded-[24px] shadow-2xl shadow-violet-500/10 relative z-10 animate-fade-in-up">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black mt-4 text-slate-800 tracking-tight">What do you want to master today?</h2>
          <p className="text-slate-500 mt-3 text-sm md:text-base leading-relaxed">
            Type in any topic. You'll teach it in your own words, and our AI will guide you to true understanding.
          </p>
        </div>

        <form onSubmit={handleStartSession} className="space-y-6">
          <div>
            <label htmlFor="topic" className="block text-sm font-bold text-slate-700 mb-2">What's the topic?</label>
            <div className="relative">
              {/* Textarea replacing the standard text input to support longer prompts */}
              <textarea
                id="topic"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (e.ctrlKey) {
                      // Ctrl+Enter: manually insert a newline at the cursor position
                      e.preventDefault();
                      const el = e.target;
                      const start = el.selectionStart;
                      const end = el.selectionEnd;
                      const newValue = topicInput.slice(0, start) + '\n' + topicInput.slice(end);
                      setTopicInput(newValue);
                      // Restore cursor position after React re-renders
                      requestAnimationFrame(() => {
                        el.selectionStart = el.selectionEnd = start + 1;
                      });
                    } else {
                      // Plain Enter: submit the form
                      e.preventDefault();
                      e.target.closest('form').requestSubmit();
                    }
                  }
                }}
                disabled={loading}
                maxLength={2500}
                rows={4}
                placeholder="e.g., How black holes work, React Hooks, The Cold War..."
                className="w-full bg-[#F9FAFB] border border-slate-200 rounded-[12px] py-4 px-5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent transition-all shadow-inner resize-y min-h-[120px]"
              />
              {/* Floating character counter inside the textarea */}
              <div className="absolute bottom-3 right-4 text-xs font-semibold text-slate-400 pointer-events-none">
                {topicInput.length} / 2500
              </div>
            </div>
            
            {/* Local client-side input validation error */}
            {validationError && (
              <p className="text-[#EF4444] text-xs mt-2 font-medium flex items-center gap-1.5 animate-fade-in-up">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {validationError}
              </p>
            )}
          </div>

          {/* Backend API session-starting errors (e.g. Inappropriate language detection) */}
          {error && (
            <div className={`p-4 rounded-[12px] text-sm space-y-2 animate-fade-in-up border ${
              error.type === 'inappropriate' ? 'bg-orange-50 border-orange-200 text-orange-800' : 'bg-[#EF4444]/10 border-[#EF4444]/20 text-[#EF4444]'
            }`}>
              <p className="font-bold flex items-center gap-1.5">
                {error.type === 'inappropriate' ? (
                  <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {error.type === 'inappropriate' ? 'Inappropriate Content Detected' : 'Error starting session'}
              </p>
              <p className="text-xs font-medium leading-relaxed">{error.message}</p>
              {error.retryFn && (
                <button
                  type="button"
                  onClick={error.retryFn}
                  className="text-xs text-[#7C3AED] hover:underline font-semibold"
                >
                  Retry connection
                </button>
              )}
            </div>
          )}

          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={handleCancelSession}
              className="cursor-pointer w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold py-4 rounded-[14px] transition-all duration-200"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer flex-1 relative overflow-hidden group bg-[#7C3AED] text-white font-bold py-4 rounded-[14px] shadow-xl shadow-violet-600/20 hover:shadow-violet-600/40 transition-all duration-300 transform hover:-translate-y-0.5 border border-violet-500/20 disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {/* Shine highlight effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:animate-shine bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 z-0"></div>
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300 z-0"></div>
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Initializing...</span>
                  </>
                ) : (
                  <span>Start Session</span>
                )}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
