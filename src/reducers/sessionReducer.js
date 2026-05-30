export const initialState = {
  sessionId: "",
  topic: "",
  status: "",
  question: "",
  message: "",
  rounds: [],
  currentScore: 0,
  currentGaps: [],
  followUp: "",
  loading: false,
  sessionComplete: false,
  error: null, // { message: string, type: 'network'|'500'|'503'|'400'|'rate-limited', details?: any, retryFn?: Function }
  finalResult: null,
};

export const sessionReducer = (state, action) => {
  switch (action.type) {
    case 'START_SESSION':
      return {
        ...initialState,
        sessionId: action.payload.sessionId,
        topic: action.payload.topic,
        status: action.payload.status,
        question: action.payload.question,
        message: action.payload.message,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      };
    case 'UPDATE_SESSION_REPLY': {
      // Destructure variables inside a dedicated lexical block to avoid scope leaking (ESLint fix)
      const { round, finalScore, status, sessionComplete } = action.payload;
      return {
        ...state,
        rounds: [...state.rounds, round],
        currentScore: finalScore,
        currentGaps: round.gaps || [],
        followUp: round.followUp || "",
        question: round.followUp || state.question, // update the active question to the followUp
        status: status,
        sessionComplete: sessionComplete,
        message: round.message || "",
        error: null, // Clear any previous transient errors on success
      };
    }
    case 'SET_FINAL_RESULT':
      return {
        ...state,
        finalResult: action.payload,
        sessionComplete: true,
      };
    case 'RESET_SESSION':
      return initialState;
    default:
      return state;
  }
};

