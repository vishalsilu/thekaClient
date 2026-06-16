import axios from 'axios';

const rawApiUrl = String(import.meta.env.VITE_API_URL || '').trim();
const apiBaseUrl = rawApiUrl.replace(/\/+$/, '') + (/\/api$/i.test(rawApiUrl) ? '' : '/api');


const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

const initialResumeToken = localStorage.getItem('x-session-token');
if (initialResumeToken) {
  api.defaults.headers.common.Authorization = `Bearer ${initialResumeToken}`;
}

api.interceptors.request.use(
  (config) => {
    const cartToken = localStorage.getItem('x-cart-token');
    const resumeToken = localStorage.getItem('x-session-token');

    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    if (cartToken) {
      config.headers['x-cart-token'] = cartToken;
    }

    if (resumeToken && !config.headers?.Authorization) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${resumeToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

const saveResumeToken = (token) => {
  if (!token) return;
  try {
    localStorage.setItem('x-session-token', token);
  } catch (err) {
    console.warn('[api] Failed to persist session token:', err?.message || err);
  }
};

api.interceptors.response.use(
  (response) => {
    const fallbackToken = response.data?.sessionToken || response.headers['x-debug-session-token'];
    if (fallbackToken) {
      saveResumeToken(fallbackToken);
    }
    return response;
  },
  (error) => Promise.reject(error)
);

export default api;