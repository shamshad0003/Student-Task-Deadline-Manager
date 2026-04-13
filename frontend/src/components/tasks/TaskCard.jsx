import React from 'react';

const TaskCard = ({ task, onEdit, onDelete, onToggleStatus }) => {
  const isCompleted = task.status === 'completed';

  const formatDate = (dateString) => {
    if (!dateString) return 'No date set';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusStyles = () => {
    return isCompleted 
      ? 'bg-green-100 text-green-700 border-green-200 shadow-sm' 
      : 'bg-amber-100 text-amber-700 border-amber-200 shadow-sm';
  };

  return (
    <div className={`group bg-white rounded-2xl shadow-sm border transition-all duration-300 p-6 hover:shadow-xl ${isCompleted ? 'border-green-100 opacity-75' : 'border-gray-100'}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start space-x-4 flex-grow">
          {/* Status Toggle Button */}
          <div className="mt-1">
            <button
              onClick={() => onToggleStatus(task)}
              className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 transform active:scale-90 ${
                isCompleted 
                  ? 'bg-green-500 border-green-500 text-white shadow-md' 
                  : 'bg-white border-gray-300 hover:border-indigo-500 hover:bg-indigo-50'
              }`}
              title={isCompleted ? 'Mark as Pending' : 'Mark as Completed'}
            >
              {isCompleted ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <div className="w-1.5 h-1.5 bg-gray-200 rounded-full group-hover:bg-indigo-400 transition-colors"></div>
              )}
            </button>
          </div>

          <div className="flex-grow min-w-0">
            <h4 className={`text-xl font-bold tracking-tight transition-all duration-300 ${isCompleted ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
              {task.title}
            </h4>
            
            {task.description && (
              <p className={`mt-2 text-sm max-w-md line-clamp-2 transition-all duration-300 ${isCompleted ? 'text-gray-300' : 'text-gray-500 font-medium'}`}>
                {task.description}
              </p>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black border uppercase tracking-widest ${getStatusStyles()}`}>
                {task.status}
              </span>
              
              <div className="flex items-center text-xs text-gray-400 font-bold uppercase tracking-wider bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                <svg className="mr-1.5 h-3.5 w-3.5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDate(task.due_date)}
              </div>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center space-x-1 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => onEdit(task)}
            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
            title="Edit Task"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
            title="Delete Task"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
