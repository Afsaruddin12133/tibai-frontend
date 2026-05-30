/* eslint-disable react-refresh/only-export-components */
import { createContext, useReducer, useContext } from 'react';
import { sessionReducer, initialState } from '../reducers/sessionReducer';

/**
 * Session Context & Hook Provider
 * 
 * Provides unified, global state access to active learning session configs, 
 * including session ID, subject topic, scores, question history, and API states.
 */

const SessionContext = createContext();

export const useSession = () => {
  return useContext(SessionContext);
};

export const SessionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(sessionReducer, initialState);

  return (
    <SessionContext.Provider value={{ state, dispatch }}>
      {children}
    </SessionContext.Provider>
  );
};
