import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getHistory } from '../services/api';
import { useSession } from '../context/SessionContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Configure the client-side items layout limit for history pages
const ITEMS_PER_PAGE = 10;

const History = () => {
  // Update page headers dynamically on mount for SEO indexing optimization
  useEffect(() => {
    document.title = "Your Study History & Learning Log | Teach It Back";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Track your past Socratic learning sessions and review identified cognitive knowledge gaps to monitor your long-term memory mastery.");
    }
  }, []);

  const { dispatch } = useSession();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const data = await getHistory();
        // The API returns { sessions: [ ... ] } or [ ... ] directly
        const list = data.sessions || data || [];
        setSessions(list);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Could not load your history. Make sure the backend server is running.");
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleViewDetails = (session) => {
    // Inject the historical session data as the finalResult so Result.jsx can render it perfectly!
    dispatch({ type: 'SET_FINAL_RESULT', payload: session });
    navigate('/result');
  };

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      // Fallback to original string if parsing fails
      return dateStr;
    }
  };

  const totalPages = Math.ceil(sessions.length / ITEMS_PER_PAGE);
  const paginatedSessions = sessions.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col justify-between">
      <Navbar />

      <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
        {/* Dynamic background blur elements */}
        <div className="absolute w-80 h-80 bg-[#4F46E5]/5 rounded-full blur-[100px] -top-20 -left-20 animate-pulse"></div>
        <div className="absolute w-80 h-80 bg-[#E0E7FF]/20 rounded-full blur-[100px] -bottom-20 -right-20 animate-pulse delay-500"></div>

        <div className="max-w-4xl w-full relative z-10 space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-black text-slate-800 mt-2 tracking-tight">Learning History</h1>
            </div>
            <Link to="/" className="text-[#4F46E5] hover:text-indigo-700 font-bold transition-colors text-sm flex items-center gap-1.5 bg-white border border-slate-200 shadow-sm px-4 py-2 rounded-[8px]">
              <span>&larr;</span> Back to Home
            </Link>
          </div>

          {error && (
            <div className="bg-[#EF4444]/10 border border-[#EF4444]/20 p-5 rounded-[12px] text-[#EF4444] text-sm flex flex-col gap-2 shadow-sm">
              <p className="font-bold flex items-center gap-1.5">
                <span>⚠️</span> Failed to load history
              </p>
              <p className="text-xs">{error}</p>
            </div>
          )}

          <div className="bg-white shadow border border-slate-200/80 rounded-[12px] overflow-hidden transition-all duration-300">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <svg className="animate-spin h-8 w-8 text-[#4F46E5]" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-sm text-slate-400 font-semibold">Loading learning sessions...</p>
              </div>
            ) : sessions.length > 0 ? (
              <>
                <ul className="divide-y divide-slate-100">
                  {paginatedSessions.map((session, index) => {
                    const score = session.finalScore ?? 0;
                    const isHigh = score >= 9;
                    const isMid = score >= 4 && score < 9;
                    const scoreBg = isHigh ? 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 rounded-[8px]' : isMid ? 'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20 rounded-[8px]' : 'bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20 rounded-[8px]';
                    const roundsCount = session.rounds?.length || 0;

                    return (
                      <li
                        key={session.sessionId || index}
                        onClick={() => handleViewDetails(session)}
                        className="p-6 hover:bg-slate-50/80 transition-all duration-200 cursor-pointer flex justify-between items-center group"
                      >
                        <div className="space-y-1">
                          <h3 className="text-base font-bold text-slate-800 group-hover:text-[#4F46E5] transition-colors">
                            {session.topic}
                          </h3>
                          <p className="text-xs text-slate-400 font-medium">
                            {formatDate(session.createdAt)} &bull; {roundsCount} {roundsCount === 1 ? 'Round' : 'Rounds'}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className={`px-4 py-2 font-black text-sm ${scoreBg}`}>
                            {score}/10
                          </div>
                          <span className="text-slate-350 group-hover:text-[#4F46E5] transition-colors font-bold text-lg">&rarr;</span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                
                {/* Premium Pagination Controls */}
                {totalPages > 1 && (
                  <div className="border-t border-slate-100 p-4 bg-slate-50/50 flex items-center justify-between">
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className="cursor-pointer px-4 py-2 flex items-center gap-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-[8px] shadow-sm hover:bg-slate-50 hover:text-[#4F46E5] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <span>&larr;</span> Previous
                    </button>
                    
                    <div className="text-sm font-bold text-slate-500">
                      Page <span className="text-slate-800">{currentPage}</span> of <span className="text-slate-800">{totalPages}</span>
                    </div>

                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className="cursor-pointer px-4 py-2 flex items-center gap-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-[8px] shadow-sm hover:bg-slate-50 hover:text-[#4F46E5] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Next <span>&rarr;</span>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 px-6 space-y-4">
                <span className="text-4xl">📚</span>
                <h3 className="text-slate-850 font-bold text-base">No learning sessions yet</h3>
                <p className="text-slate-400 text-xs max-w-sm mx-auto leading-relaxed">Teach concepts to our Socratic AI to build up your history and test your knowledge!</p>
                <Link
                  to="/session"
                  className="inline-block bg-[#4F46E5] hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-[8px] text-xs shadow transition-all mt-2"
                >
                  Start Learning Session
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default History;

