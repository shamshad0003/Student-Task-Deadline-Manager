import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Check if API URL is configured
if (!import.meta.env.VITE_API_URL) {
  console.error('VITE_API_URL is not defined in environment variables');
}

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
    // Check for network errors or unreachable server
    if (!error.response) {
      toast.error('Network error: Cannot reach the server. Please check your connection or VITE_API_URL.');
    } else if (error.response.status === 401) {
      // Check for 401 Unauthorized errors
      // Don't redirect if we are already on the login page to avoid loops
      if (!window.location.pathname.includes('/login')) {
        // Clear session data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        window.location.href = '/login?reason=unauthorized';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

