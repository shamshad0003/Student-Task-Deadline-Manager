import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/login');
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="glass-effect sticky top-0 z-[100] border-b border-gray-200/50 dark:border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-24">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center mr-4 group-hover:rotate-12 transition-transform shadow-xl shadow-indigo-500/20">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <span className="text-3xl font-black tracking-tighter text-gray-900 dark:text-white">
                Task<span className="text-indigo-600">Sync</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                      isActive(link.path) 
                        ? 'bg-gray-900 text-white shadow-xl shadow-gray-200 dark:bg-white dark:text-gray-900 dark:shadow-none' 
                        : 'text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-amber-400'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="h-8 w-px bg-gray-100 mx-6 dark:bg-gray-800"></div>
                <div className="flex items-center space-x-5">
                  <button
                    onClick={toggleTheme}
                    className="p-3.5 text-gray-500 hover:text-indigo-600 bg-gray-50 dark:bg-slate-800/50 dark:text-gray-400 dark:hover:text-amber-400 rounded-2xl transition-all border border-transparent hover:border-indigo-100 dark:hover:border-amber-900/30"
                    title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
                  >
                    {isDarkMode ? (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707m12.728 12.728L5.636 5.636" />
                        <circle cx="12" cy="12" r="5" strokeWidth="2.5" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                    )}
                  </button>
                  <div className="flex flex-col items-end mr-2">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Authenticated</span>
                    <span className="text-sm font-black text-gray-900 dark:text-gray-100 leading-none">{user?.username}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-3.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-2xl transition-all group"
                    title="Sign Out"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="px-8 py-3 text-sm font-black text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-all uppercase tracking-widest"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-10 py-4 bg-indigo-600 text-white text-xs font-black rounded-2xl hover:bg-gray-900 shadow-2xl shadow-indigo-500/20 transition-all active:scale-95 uppercase tracking-[0.2em]"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMenu}
              className="p-3.5 rounded-2xl bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 transition-all outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden animate-fade-in">
          <div className="px-4 pt-2 pb-6 space-y-2 bg-white dark:bg-slate-900 border-t border-gray-50 dark:border-slate-800 shadow-2xl">
            {isAuthenticated ? (
              <>
                <div className="px-4 py-4 mb-2 bg-gray-50 dark:bg-gray-800 rounded-2xl flex justify-between items-center">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Authenticated user</p>
                      <p className="text-lg font-black text-gray-900 dark:text-white">{user?.username}</p>
                    </div>
                    <button
                      onClick={toggleTheme}
                      className="p-3 bg-white dark:bg-gray-700 shadow-sm border border-gray-100 dark:border-gray-600 rounded-xl"
                    >
                      {isDarkMode ? (
                        <svg className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707m12.728 12.728L5.636 5.636" />
                          <circle cx="12" cy="12" r="5" strokeWidth="2.5" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                      )}
                    </button>
                </div>
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-4 rounded-2xl text-base font-black uppercase tracking-widest ${
                      isActive(link.path) 
                        ? 'bg-indigo-600 text-white' 
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-4 rounded-2xl text-base font-black text-red-500 hover:bg-red-50 uppercase tracking-widest flex items-center gap-3"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Log Out Session
                </button>
              </>
            ) : (
              <div className="pt-4 space-y-3">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block w-full px-4 py-4 rounded-2xl text-center text-base font-black text-gray-900 bg-gray-50 uppercase tracking-widest"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="block w-full px-4 py-4 rounded-2xl text-center text-base font-black text-white bg-indigo-600 uppercase tracking-widest"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
