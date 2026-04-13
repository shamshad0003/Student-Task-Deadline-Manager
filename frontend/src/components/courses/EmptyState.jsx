import React from 'react';

const EmptyState = ({ onAddClick }) => {
  return (
    <div className="card-premium p-12 sm:p-20 min-h-[450px] flex flex-col items-center justify-center text-center overflow-hidden relative group">
      {/* Decorative background element */}
      <div className="absolute top-0 left-0 -mt-20 -ml-20 w-64 h-64 bg-indigo-50 rounded-full opacity-30 group-hover:scale-110 transition-transform duration-700"></div>
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="bg-indigo-600 p-8 rounded-[2.5rem] mb-10 shadow-2xl shadow-indigo-200 group-hover:rotate-6 transition-transform">
          <svg
            className="h-14 w-14 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>
        <h3 className="text-3xl font-black text-gray-900 tracking-tighter mb-4">No courses yet</h3>
        <p className="text-gray-400 font-medium mt-1 max-w-sm text-lg leading-relaxed">
          Start your journey by adding your first course. We'll help you organize tasks and hit every deadline.
        </p>
        <button
          onClick={onAddClick}
          className="mt-12 px-10 py-5 bg-gray-900 text-white btn-premium shadow-2xl shadow-gray-300 hover:bg-indigo-600 flex items-center gap-3"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
          </svg>
          Add First Course
        </button>
      </div>
    </div>
  );
};

export default EmptyState;
