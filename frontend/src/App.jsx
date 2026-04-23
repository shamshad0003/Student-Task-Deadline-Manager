import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CourseDetails from './pages/CourseDetails';
import NotFound from './pages/NotFound';
import { useTheme } from './context/ThemeContext';

const ThemedToaster = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <Toaster 
      position="top-right"
      toastOptions={{
        className: 'font-bold text-sm rounded-xl py-3 px-5 shadow-2xl',
        duration: 4000,
        style: {
          background: isDarkMode ? '#1e293b' : '#fff',
          color: isDarkMode ? '#f8fafc' : '#111827',
          border: isDarkMode ? '1px solid #334155' : '1px solid #f3f4f6'
        },
      }}
    />
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
        <Layout>
          {/* Toast notifications */}
          <ThemedToaster />
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
            <Route 
              path="/register" 
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              } 
            />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses/:id"
              element={
                <ProtectedRoute>
                  <CourseDetails />
                </ProtectedRoute>
              }
            />

            {/* Root Redirects */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* 404 Page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

