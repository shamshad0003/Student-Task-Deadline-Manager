import React, { useState, useEffect } from 'react';

const CourseForm = ({ course, onSave, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    course_name: '',
    course_code: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (course) {
      setFormData({
        course_name: course.name,
        course_code: course.description || '',
      });
    } else {
      setFormData({
        course_name: '',
        course_code: '',
      });
    }
  }, [course]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.course_name.trim()) {
      return setError('Course Name is required');
    }

    onSave(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-600 bg-opacity-50 backdrop-blur-sm transition-opacity" 
        onClick={onCancel}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl transform transition-all sm:max-w-lg sm:w-full overflow-hidden border border-gray-100 dark:border-slate-700">
        <form onSubmit={handleSubmit}>
          <div className="bg-white dark:bg-slate-800 p-6 sm:p-8">
            <div className="mb-6 flex justify-between items-center border-b border-gray-100 dark:border-slate-700 pb-4">
              <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                {course ? 'Edit Course' : 'Add New Course'}
              </h3>
              <button 
                type="button" 
                onClick={onCancel}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                title="Close"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
                <p className="text-sm text-red-700 font-bold">{error}</p>
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label htmlFor="course_name" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Course Name
                </label>
                <input
                  type="text"
                  name="course_name"
                  id="course_name"
                  value={formData.course_name}
                  onChange={handleChange}
                  className="block w-full border-gray-200 dark:border-slate-700 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white p-4 border bg-gray-50/50 dark:bg-slate-900/50 transition-all text-base"
                  placeholder="e.g. Data Structures & Algorithms"
                  required
                  disabled={isLoading}
                  autoFocus
                />
              </div>

              <div>
                <label htmlFor="course_code" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Course Code
                </label>
                <input
                  type="text"
                  name="course_code"
                  id="course_code"
                  value={formData.course_code}
                  onChange={handleChange}
                  className="block w-full border-gray-200 dark:border-slate-700 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white p-4 border bg-gray-50/50 dark:bg-slate-900/50 transition-all text-base"
                  placeholder="e.g. CS201"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-slate-900/50 px-6 py-4 sm:px-8 sm:flex sm:flex-row-reverse gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex justify-center rounded-xl border border-transparent shadow-lg px-6 py-3 bg-indigo-600 text-base font-bold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                course ? 'Update Course' : 'Create Course'
              )}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="mt-3 w-full inline-flex justify-center rounded-xl border border-gray-300 shadow-sm px-6 py-3 bg-white text-base font-bold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseForm;
