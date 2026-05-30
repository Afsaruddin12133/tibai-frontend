/**
 * SessionErrorBanner Component
 * 
 * Renders the top alert overlay during an active Socratic session.
 * Handled error types:
 * - 'inappropriate': Warning banner style if user triggers content guards.
 * - 'rate-limited': Prompt overload limits.
 * - 'network' / '503': Disconnection retries and exponential fallbacks.
 */
export default function SessionErrorBanner({ error }) {
  if (!error) return null;

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-2xl px-4 animate-bounce">
      <div className={`p-4 rounded-[12px] shadow-2xl flex items-center justify-between gap-4 border ${
        error.type === 'inappropriate' 
          ? 'bg-orange-50 border-orange-300 text-orange-900 shadow-orange-500/10' 
          : 'bg-slate-900 border-slate-800 text-white'
      }`}>
        <div className="flex items-center gap-3">
          {/* Selective icon choice based on the error type */}
          <span className={`text-xl ${error.type === 'inappropriate' ? 'text-orange-500' : 'text-violet-300'}`}>
            {error.type === 'inappropriate' ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            ) : error.type === 'rate-limited' ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            )}
          </span>
          <div>
            <p className="text-xs text-violet-300 font-bold uppercase tracking-wider">System Alert</p>
            <p className="text-sm font-medium">{error.message}</p>
            {error.details && <p className="text-xs text-slate-400 font-mono mt-1">{error.details}</p>}
          </div>
        </div>

        {/* Retry/Cancel actions defined by the calling retry wrapper */}
        <div className="flex gap-2 text-white">
          {error.retryFn && (
            <button
              onClick={error.retryFn}
              className="cursor-pointer bg-[#7C3AED] hover:bg-violet-500 text-xs px-3 py-1.5 rounded-[8px] font-bold transition-all"
            >
              Retry
            </button>
          )}
          {error.cancelFn && (
            <button
              onClick={error.cancelFn}
              className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-xs px-3 py-1.5 rounded-[8px] font-bold transition-all text-slate-300"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
