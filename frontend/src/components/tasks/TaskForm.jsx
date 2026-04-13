import React, { useState, useEffect } from 'react';

const TaskForm = ({ task, onSave, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
  });
  const [errorPath, setErrorPath] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (task) {
      // Format date for HTML date input (YYYY-MM-DD)
      const date = task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '';
      setFormData({
        title: task.title,
        description: task.description || '',
        dueDate: date,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        dueDate: '',
      });
    }
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setErrorPath('');

    if (!formData.title.trim()) {
      setErrorPath('title');
      return setErrorMessage('Please enter a task title');
    }
    if (!formData.dueDate) {
      setErrorPath('dueDate');
      return setErrorMessage('A due date is required');
    }

    onSave(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (errorPath === name) {
      setErrorPath('');
      setErrorMessage('');
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Semi-transparent Backdrop with Blur */}
      <div 
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity duration-300" 
        onClick={onCancel}
      ></div>

      {/* Modern Modal Container */}
      <div className="relative bg-white rounded-3xl shadow-2xl transform transition-all sm:max-w-md sm:w-full overflow-hidden border border-gray-100 flex flex-col">
        {/* Header */}
        <div className="bg-gray-50/50 px-8 py-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-2xl font-black text-gray-900 tracking-tight">
            {task ? 'Edit Task' : 'New Task'}
          </h3>
          <button 
            type="button" 
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all"
            title="Close"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="px-8 py-8 space-y-6">
            {errorMessage && !errorPath && (
              <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm font-bold border border-red-100 animate-shake">
                {errorMessage}
              </div>
            )}

            {/* Title Input */}
            <div className="space-y-2">
              <label htmlFor="title" className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                Task Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                value={formData.title}
                onChange={handleChange}
                className={`block w-full border-2 transition-all duration-200 rounded-2xl p-4 text-base font-medium placeholder-gray-300 outline-none ${
                    errorPath === 'title' 
                    ? 'border-red-200 bg-red-50/30 focus:border-red-400' 
                    : 'border-gray-50 bg-gray-50/50 focus:border-indigo-500 focus:bg-white focus:shadow-inner'
                }`}
                placeholder="What needs to be done?"
                required
                disabled={isLoading}
                autoFocus
              />
              {errorPath === 'title' && <p className="text-[10px] text-red-500 font-black uppercase tracking-wider ml-1">{errorMessage}</p>}
            </div>

            {/* Description Input */}
            <div className="space-y-2">
              <label htmlFor="description" className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                Description <span className="text-[10px] opacity-50 font-medium">(Optional)</span>
              </label>
              <textarea
                name="description"
                id="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                className="block w-full border-2 border-gray-50 bg-gray-50/50 focus:border-indigo-500 focus:bg-white focus:shadow-inner transition-all duration-200 rounded-2xl p-4 text-base font-medium placeholder-gray-300 outline-none resize-none"
                placeholder="Add more details..."
                disabled={isLoading}
              />
            </div>

            {/* Date Input */}
            <div className="space-y-2">
              <label htmlFor="dueDate" className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                id="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className={`block w-full border-2 transition-all duration-200 rounded-2xl p-4 text-base font-medium outline-none ${
                    errorPath === 'dueDate' 
                    ? 'border-red-200 bg-red-50/30 focus:border-red-400' 
                    : 'border-gray-50 bg-gray-50/50 focus:border-indigo-500 focus:bg-white focus:shadow-inner'
                }`}
                required
                disabled={isLoading}
              />
              {errorPath === 'dueDate' && <p className="text-[10px] text-red-500 font-black uppercase tracking-wider ml-1">{errorMessage}</p>}
            </div>
          </div>
          
          {/* Footer Actions */}
          <div className="bg-gray-50/50 px-8 py-6 flex flex-col sm:flex-row-reverse gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full sm:w-auto inline-flex items-center justify-center rounded-2xl bg-gray-900 px-8 py-4 text-sm font-black text-white transition-all hover:bg-indigo-600 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-gray-900/10"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </div>
              ) : (
                <span>{task ? 'Update Changes' : 'Create Task'}</span>
              )}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl px-8 py-4 text-sm font-black text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all font-bold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
