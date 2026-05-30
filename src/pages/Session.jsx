import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import { startSession, sendReply, endSession } from '../services/api';
import SessionStarter from '../components/session/SessionStarter';
import SessionErrorBanner from '../components/session/SessionErrorBanner';
import SessionLeftPanel from '../components/session/SessionLeftPanel';
import SessionRightPanel from '../components/session/SessionRightPanel';

/**
 * Session Page Coordinator
 * 
 * Orchestrates the overall session state and coordinate inputs/subcomponents.
 * Contains mouse dragging logic for panel resizing, API connection fallbacks,
 * and passes states cleanly down to the newly decoupled UI parts.
 */
const Session = () => {
  const { state, dispatch } = useSession();
  const navigate = useNavigate();
  
  const [topicInput, setTopicInput] = useState('');
  const [replyInput, setReplyInput] = useState('');
  const [validationError, setValidationError] = useState('');
  const [isSubmitBlocked, setIsSubmitBlocked] = useState(false);
  const [retryTimer, setRetryTimer] = useState(null);

  // Split-panel width configuration and resize dragging states
  const [leftPanelWidth, setLeftPanelWidth] = useState(45);
  const [isDragging, setIsDragging] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  const chatEndRef = useRef(null);

  // Update page headers dynamically on mount for SEO indexing optimization
  useEffect(() => {
    document.title = "Socratic AI Study Session | Teach It Back";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Engage in an active study session with our Socratic AI. Input any topic, explain it in your own words, and identify cognitive gaps.");
    }
  }, []);

  // Updates layout orientation dynamically when matching desktop display constraints
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Workspace split layout resizing drag mechanics
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const newWidth = (e.clientX / window.innerWidth) * 100;
      if (newWidth > 20 && newWidth < 80) {
        setLeftPanelWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      if (isDragging) setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    e.preventDefault();
  };

  // Scrolls chat feed downward automatically as explanation rounds increment
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.rounds, state.question]);

  // Cleanup timeout retry references when the component is unmounted
  useEffect(() => {
    return () => {
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, [retryTimer]);

  /**
   * Helper that wraps api service callbacks to support loaders,
   * artificial delay timers, and centralized error classification.
   */
  const handleApiCall = async (apiFn, retryCount = 0, minDelayMs = 0) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      // eslint-disable-next-line react-hooks/purity
      const startTime = Date.now();
      const data = await apiFn();
      
      if (minDelayMs > 0) {
        // eslint-disable-next-line react-hooks/purity
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime < minDelayMs) {
          await new Promise(resolve => setTimeout(resolve, minDelayMs - elapsedTime));
        }
      }

      dispatch({ type: 'SET_LOADING', payload: false });
      return data;
    } catch (err) {
      dispatch({ type: 'SET_LOADING', payload: false });
      const status = err.response?.status;
      const data = err.response?.data || {};
      const details = data.details || data.message || err.message;

      let errorObj = {
        message: "An unexpected error occurred. Please check your connection.",
        type: "network",
        details,
        retryFn: () => handleApiCall(apiFn)
      };

      if (status === 500) {
        errorObj = {
          message: "Server error: check configuration",
          type: "500",
          details
        };
      } else if (status === 503) {
        errorObj = {
          message: "AI is busy — trying to reconnect...",
          type: "503",
          retryFn: () => startExponentialRetry(apiFn, retryCount)
        };
      } else if (status === 400) {
        if (data.error === "Inappropriate language detected.") {
          errorObj = {
            message: data.message || "This site does not accept abusive or offensive language. Please rephrase and try again.",
            type: "inappropriate"
          };
        } else {
          errorObj = {
            message: details || "Invalid request.",
            type: "400"
          };
        }
      } else if (status === 429) {
        errorObj = {
          message: "Too many requests. Please wait a moment before trying again.",
          type: "rate-limited"
        };
      }

      dispatch({ type: 'SET_ERROR', payload: errorObj });
      throw err;
    }
  };

  /**
   * Automatically attempts reconnection backoff cycles when encountering 503s
   */
  const startExponentialRetry = (apiFn, currentAttempt) => {
    const nextAttempt = currentAttempt + 1;
    if (nextAttempt > 3) {
      dispatch({
        type: 'SET_ERROR',
        payload: {
          message: "AI is currently unavailable after multiple attempts. Please try again later.",
          type: "503-failed"
        }
      });
      return;
    }

    const timer = setTimeout(async () => {
      try {
        await handleApiCall(apiFn, nextAttempt);
      } catch {
        // Handled internally in wrapper
      }
    }, delay);

    setRetryTimer(timer);

    dispatch({
      type: 'SET_ERROR',
      payload: {
        message: `AI is busy — Retrying in ${delay / 1000} seconds... (Attempt ${nextAttempt}/3)`,
        type: "503",
        isRetrying: true,
        cancelFn: () => {
          clearTimeout(timer);
          dispatch({ type: 'SET_ERROR', payload: null });
        }
      }
    });
  };

  // Begins a fresh Socratic context based on the topic prompt
  const handleStartSession = async (e) => {
    e.preventDefault();
    if (!topicInput.trim()) {
      setValidationError("Please enter a topic to start.");
      return;
    }
    setValidationError("");

    try {
      const data = await handleApiCall(() => startSession(topicInput.trim()), 0, 1000);
      dispatch({ type: 'START_SESSION', payload: data });
    } catch (err) {
      console.error(err);
    }
  };

  // Submits the learner explanation block for Socratic analysis
  const handleReplySubmit = async (e) => {
    e?.preventDefault();
    if (!replyInput.trim()) {
      setValidationError("Please write an explanation first.");
      return;
    }
    if (replyInput.length > 2000) {
      setValidationError("Explanation is too long. Please keep it under 2000 characters.");
      return;
    }
    setValidationError("");
    setIsSubmitBlocked(true);

    try {
      const data = await handleApiCall(() => sendReply(state.sessionId, replyInput.trim()), 0, 1500);
      dispatch({ type: 'UPDATE_SESSION_REPLY', payload: data });
      setReplyInput('');

      setTimeout(() => {
        setIsSubmitBlocked(false);
      }, 1000);
    } catch (err) {
      setIsSubmitBlocked(false);
      console.error(err);
    }
  };

  // Closes the current session and displays evaluation summary
  const handleFinishSession = async () => {
    try {
      const data = await handleApiCall(() => endSession(state.sessionId));
      dispatch({ type: 'SET_FINAL_RESULT', payload: data });
      navigate('/result');
    } catch (err) {
      console.error(err);
    }
  };

  // Resets active session and navigates home
  const handleCancelSession = () => {
    dispatch({ type: 'RESET_SESSION' });
    navigate('/');
  };

  // Render view layout depending on whether the session has initialized
  if (!state.sessionId) {
    return (
      <SessionStarter
        topicInput={topicInput}
        setTopicInput={setTopicInput}
        loading={state.loading}
        validationError={validationError}
        error={state.error}
        handleStartSession={handleStartSession}
        handleCancelSession={handleCancelSession}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col lg:flex-row text-slate-800 relative">
      <SessionErrorBanner error={state.error} />

      <SessionLeftPanel
        state={state}
        replyInput={replyInput}
        setReplyInput={setReplyInput}
        validationError={validationError}
        setValidationError={setValidationError}
        isSubmitBlocked={isSubmitBlocked}
        handleReplySubmit={handleReplySubmit}
        handleFinishSession={handleFinishSession}
        isDesktop={isDesktop}
        leftPanelWidth={leftPanelWidth}
      />

      {/* Resize handle bar separating split layout workspace */}
      <div 
        className={`hidden lg:flex w-1.5 hover:w-2.5 bg-slate-100 hover:bg-violet-200 cursor-col-resize items-center justify-center transition-all duration-200 z-50 shrink-0 ${isDragging ? 'bg-violet-300 w-2.5' : ''}`}
        onMouseDown={handleMouseDown}
      >
        <div className={`h-12 w-1 rounded-full transition-colors ${isDragging ? 'bg-violet-500' : 'bg-slate-300'}`}></div>
      </div>

      <SessionRightPanel
        state={state}
        chatEndRef={chatEndRef}
      />
    </div>
  );
};

export default Session;
