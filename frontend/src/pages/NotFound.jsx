import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="relative mb-8">
        <h1 className="text-[12rem] font-black text-gray-100 leading-none select-none">
          404
        </h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-indigo-600 text-white font-black text-2xl px-6 py-3 rounded-2xl shadow-2xl rotate-3">
            PAGE NOT FOUND
          </div>
        </div>
      </div>
      
      <h2 className="text-4xl font-black text-gray-900 tracking-tighter mb-4">
        Lost in the Cloud?
      </h2>
      <p className="text-gray-500 font-medium max-w-md mx-auto mb-10 text-lg">
        The page you're looking for doesn't exist or has been moved to another semester.
      </p>
      
      <Link
        to="/dashboard"
        className="inline-flex items-center px-10 py-5 bg-gray-900 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-gray-900/20 hover:bg-indigo-600 active:scale-95 transition-all"
      >
        <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        Back to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
