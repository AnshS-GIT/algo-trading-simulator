import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001',
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const runBacktest = async (payload) => {
  const response = await api.post('/backtest/run', payload);
  return response.data;
};

export const getBacktestHistory = async () => {
  const response = await api.get('/backtest/history');
  return response.data;
};

export default api;
