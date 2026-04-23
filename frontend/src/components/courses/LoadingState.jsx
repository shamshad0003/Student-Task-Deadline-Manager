import React from 'react';

const LoadingState = ({ message = 'Syncing your data...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-32 space-y-8 animate-fade-in">
      <div className="relative group">
        <div className="absolute inset-0 bg-indigo-100 dark:bg-indigo-900/20 rounded-full scale-150 blur-2xl opacity-50 animate-pulse"></div>
        <div className="relative overflow-hidden w-20 h-20 bg-white dark:bg-slate-800 rounded-[2rem] shadow-xl border border-gray-100 dark:border-slate-700 flex items-center justify-center">
            <svg className="animate-spin h-10 w-10 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-10" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        </div>
      </div>
      <div className="text-center">
        <p className="text-xl font-black text-gray-900 dark:text-white tracking-tighter mb-1">{message}</p>
        <p className="text-sm font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] animate-pulse">Please wait a moment</p>
      </div>
    </div>
  );
};

export default LoadingState;
