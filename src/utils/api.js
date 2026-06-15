import axios from 'axios';

// Shared axios instance with the API base URL pre-configured.
// This app uses userId + role from localStorage only — no JWT tokens.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://pharmalink-back-end.onrender.com',
});

// If the server ever returns 401, clear the local session and force re-login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('userId');
      localStorage.removeItem('userRole');
      localStorage.removeItem('signupRole');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

export default api;
