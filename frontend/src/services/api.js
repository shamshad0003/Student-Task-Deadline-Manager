import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach the JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check for 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      // Don't redirect if we are already on the login page to avoid loops
      if (!window.location.pathname.includes('/login')) {
        // Clear session data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Force a reload to clear React state if needed, or simply redirect
        // In a more complex app, we'd use a bus or state management, 
        // but for this portfolio project, a clean redirect is clear and safe.
        window.location.href = '/login?reason=unauthorized';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
