import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
import api from '../services/api';
import { isTokenExpired, getTokenRemainingTime } from '../utils/tokenHelper';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const logoutTimerRef = useRef(null);

  const logout = useCallback((reason = '') => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    
    // Clear any existing timer
    if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
        logoutTimerRef.current = null;
    }

    if (reason === 'expired') {
        toast.error('Session expired. Please log in again.');
    }
  }, []);

  // Set up auto-logout timer whenever token changes
  useEffect(() => {
    if (token) {
      if (isTokenExpired(token)) {
        logout('expired');
      } else {
        const remainingTime = getTokenRemainingTime(token);
        
        // Clear previous timer if any
        if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
        
        // Set new timer
        logoutTimerRef.current = setTimeout(() => {
          logout('expired');
        }, remainingTime);
      }
    } else {
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    }

    return () => {
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    };
  }, [token, logout]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (isTokenExpired(token)) {
            logout('expired');
        } else {
            setUser(parsedUser);
        }
      } catch (e) {
        console.error('Failed to parse stored user', e);
        logout();
      }
    }
    setLoading(false);
  }, [token, logout]);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token: newToken, user: newUser } = response.data;
      
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      setToken(newToken);
      setUser(newUser);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed. Please check your credentials.' 
      };
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await api.post('/auth/register', { username, email, password });
      const { token: newToken, user: newUser } = response.data;
      
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      setToken(newToken);
      setUser(newUser);
      return { success: true };
    } catch (error) {
      console.error('Registration Error:', error);
      
      let message = 'Registration failed. Please try again.';
      
      if (error.response) {
        // Server responded with an error
        message = error.response.data.message || message;
      } else if (error.request) {
        // Request was made but no response received
        message = 'Cannot connect to the server. Please check if your backend is running.';
      } else {
        // Something else happened
        message = 'A network error occurred. Please check your connection.';
      }

      return { success: false, message };
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
