import React from 'react';
import { Link } from 'react-router-dom';

const CourseCard = ({ course, onEdit, onDelete }) => {
  return (
    <div className="card-premium p-8 group flex flex-col justify-between overflow-hidden relative">
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 -tr-10 -mr-10 w-24 h-24 bg-gray-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div className="bg-indigo-600/5 px-4 py-1.5 rounded-xl text-[10px] font-black text-indigo-600 tracking-[0.15em] uppercase border border-indigo-100 shadow-sm">
            {course.description || 'CORE'}
          </div>
          <div className="flex space-x-1 sm:opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(course)}
              className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all shadow-sm active:scale-90"
              title="Edit"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(course.id)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-white rounded-xl transition-all shadow-sm active:scale-90"
              title="Delete"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
        
        <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tighter leading-tight group-hover:text-indigo-600 transition-colors">
          {course.name}
        </h3>
        <p className="text-sm font-medium text-gray-400 mb-8 line-clamp-2 uppercase tracking-widest text-[10px]">
          {course.description ? `ID: ${course.description}` : 'General Studies'}
        </p>
      </div>

      <div className="relative z-10">
        <Link
          to={`/courses/${course.id}`}
          className="w-full inline-flex items-center justify-center px-6 py-4 bg-gray-50 text-xs font-black rounded-2xl text-gray-900 border border-transparent hover:bg-indigo-600 hover:text-white hover:shadow-xl hover:shadow-indigo-100 transition-all uppercase tracking-[0.2em] active:scale-95 group/btn"
        >
          Explore Tasks
          <svg className="ml-3 h-4 w-4 transform group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;
