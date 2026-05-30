import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const startSession = async (topic) => {
  const response = await api.post('/api/session/start', { topic });
  return response.data;
};

export const sendReply = async (sessionId, userText) => {
  const response = await api.post('/api/session/reply', { sessionId, userText });
  return response.data;
};

export const endSession = async (sessionId) => {
  const response = await api.post('/api/session/end', { sessionId });
  return response.data;
};

export const getHistory = async () => {
  const response = await api.get('/api/session/history');
  return response.data;
};

export const checkHealth = async () => {
  const response = await api.get('/api/health');
  return response.data;
};

export default { startSession, sendReply, endSession, getHistory, checkHealth };

