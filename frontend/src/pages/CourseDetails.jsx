import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import courseService from '../services/courseService';
import taskService from '../services/taskService';
import TaskCard from '../components/tasks/TaskCard';
import TaskForm from '../components/tasks/TaskForm';
import CourseMaterials from '../components/courses/CourseMaterials';
import LoadingState from '../components/courses/LoadingState';
import { TaskCardSkeleton } from '../components/shared/Skeleton';
import toast from 'react-hot-toast';

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Task Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Search state
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCourseData();
  }, [id]);

  const fetchCourseData = async () => {
    setLoading(true);
    try {
      const [courseData, taskData] = await Promise.all([
        courseService.getCourseById(id),
        taskService.getTasksByCourse(id)
      ]);
      setCourse(courseData);
      setTasks(sortTasks(taskData));
    } catch (err) {
      setError('Failed to load course information. Please check your connection.');
      toast.error('Error fetching course data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sortTasks = (taskList) => {
    // Sort logic: Pending first, then by due date
    return [...taskList].sort((a, b) => {
      if (a.status === b.status) {
        return new Date(a.due_date) - new Date(b.due_date);
      }
      return a.status === 'pending' ? -1 : 1;
    });
  };

  const handleAddTaskClick = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  const handleEditTaskClick = (task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleSaveTask = async (formData) => {
    setActionLoading(true);
    try {
      if (editingTask) {
        await taskService.updateTask(editingTask.id, formData);
        toast.success('Task updated');
      } else {
        await taskService.createTask(id, formData);
        toast.success('Task created');
      }
      setIsFormOpen(false);
      // Refresh task list
      const newTaskData = await taskService.getTasksByCourse(id);
      setTasks(sortTasks(newTaskData));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong while saving the task.');
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (task) => {
    const newStatus = task.status === 'pending' ? 'completed' : 'pending';
    const oldTasks = [...tasks];
    
    try {
      // Optimistic UI update with re-sorting
      const updatedTasks = tasks.map(t => t.id === task.id ? { ...t, status: newStatus } : t);
      setTasks(sortTasks(updatedTasks));
      
      await taskService.updateTaskStatus(task.id, newStatus);
      toast.success(newStatus === 'completed' ? 'Task completed! 🎉' : 'Task marked as pending');
    } catch (err) {
      // Revert on error
      setTasks(oldTasks);
      toast.error('Failed to update task status.');
      console.error(err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Delete this task? This action cannot be undone.')) {
      try {
        await taskService.deleteTask(taskId);
        setTasks(tasks.filter(t => t.id !== taskId));
        toast.success('Task deleted');
      } catch (err) {
        toast.error('Could not delete the task.');
        console.error(err);
      }
    }
  };

  if (loading && !course) return <LoadingState />;

  if (error || !course) {
    return (
      <div className="max-w-7xl mx-auto py-20 px-4 text-center">
        <div className="bg-red-50 inline-flex p-6 rounded-full mb-6">
            <svg className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        </div>
        <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">{error || 'Course not found'}</h2>
        <Link to="/dashboard" className="inline-flex items-center px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold hover:bg-indigo-600 dark:hover:bg-indigo-100 transition-all">
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Dynamic Breadcrumbs / Back Link */}
      <div className="mb-8 overflow-hidden">
        <Link to="/dashboard" className="text-sm font-black text-gray-400 hover:text-indigo-600 transition-all flex items-center mb-6 group w-fit uppercase tracking-widest">
          <svg className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
          </svg>
          Back to list
        </Link>

        {/* Hero Header */}
        <div className="relative bg-white dark:bg-slate-800 p-8 sm:p-12 rounded-[2.5rem] shadow-xl shadow-indigo-900/5 border border-gray-100 dark:border-slate-700 overflow-hidden group">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-indigo-50 dark:bg-indigo-900/20 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="flex-grow">
              <div className="flex items-center space-x-3 mb-4">
                <span className="bg-indigo-600 text-white text-[10px] uppercase font-black px-3 py-1.5 rounded-lg tracking-[0.2em] shadow-lg shadow-indigo-200">
                  {course.description || 'ACTIVE COURSE'}
                </span>
                <span className="text-gray-300">|</span>
                <span className="text-gray-400 text-xs font-black uppercase tracking-widest">
                    {tasks.filter(t => t.status === 'pending').length} Active Deadlines
                </span>
              </div>
              <h1 className="text-4xl sm:text-6xl font-black text-gray-900 dark:text-white tracking-tighter leading-none mb-4 break-words">
                {course.name}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 font-medium max-w-2xl text-lg leading-relaxed">
                Stay on top of your semester. Add tasks, set deadlines, and track your progress through this course.
              </p>
            </div>
            
            <button
              onClick={handleAddTaskClick}
              className="flex-shrink-0 px-10 py-5 bg-gray-900 dark:bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-[0.15em] shadow-2xl shadow-gray-900/20 hover:bg-indigo-600 dark:hover:bg-white dark:hover:text-gray-900 active:scale-95 transition-all outline-none focus:ring-4 focus:ring-indigo-100 flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
              </svg>
              New Task
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-8 mt-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between px-4 pb-4 border-b border-gray-100 dark:border-slate-800 gap-4">
          <div className="flex items-end gap-3">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Timeline</h2>
            <span className="text-gray-300 dark:text-gray-600 font-medium mb-1">/</span>
            <span className="text-indigo-600 font-black text-sm uppercase tracking-widest mb-1">
                {tasks.length} Total
            </span>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Search Input */}
            <div className="relative w-full sm:w-64 group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Find a task..."
                className="block w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-slate-900 border-2 border-gray-100 dark:border-slate-700 rounded-xl text-xs font-bold placeholder-gray-400 focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-500 transition-all dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="hidden sm:flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm shadow-amber-200"></span>
                <span>Pending</span>
              </div>
              <div className="flex items-center space-x-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-sm shadow-green-200"></span>
                <span>Done</span>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
             {[1, 2, 3, 4].map((i) => (
              <TaskCardSkeleton key={i} />
            ))}
          </div>
        ) : tasks.length > 0 ? (
          (() => {
            const filteredTasks = tasks.filter(task => 
              task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
              task.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );

            if (filteredTasks.length === 0) {
              return (
                <div className="py-20 text-center animate-fade-in">
                  <div className="bg-gray-50 dark:bg-slate-800 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-gray-300">
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">No tasks found</h3>
                  <p className="text-gray-500 dark:text-gray-400 font-medium">
                    We couldn't find any tasks matching "{searchTerm}"
                  </p>
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="mt-6 text-xs font-black text-indigo-600 hover:underline uppercase tracking-widest"
                  >
                    Reset Filter
                  </button>
                </div>
              );
            }

            return (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up">
                {filteredTasks.map(task => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    onEdit={handleEditTaskClick}
                    onDelete={handleDeleteTask}
                    onToggleStatus={handleToggleStatus}
                  />
                ))}
              </div>
            );
          })()
        ) : (
          <div className="bg-white rounded-[2.5rem] border-4 border-dashed border-gray-100 p-16 sm:p-24 text-center transition-all hover:border-indigo-100 group">
            <div className="relative inline-block mb-8">
                <div className="absolute inset-0 bg-indigo-100 rounded-full scale-110 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-gray-50 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-2 text-gray-200 group-hover:text-indigo-600 transition-colors">
                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                </div>
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Clean Slate!</h3>
            <p className="text-gray-400 font-medium mb-10 max-w-sm mx-auto text-lg leading-relaxed">
                You don't have any tasks scheduled for this course yet.
            </p>
            <button
              onClick={handleAddTaskClick}
              className="px-10 py-4 bg-indigo-50 text-indigo-700 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-lg shadow-indigo-100"
            >
              Add first task
            </button>
          </div>
        )}
      </div>

      {/* Course Materials Section */}
      <CourseMaterials courseId={id} />

      {/* Task Form Modal */}
      {isFormOpen && (
        <TaskForm
          task={editingTask}
          onSave={handleSaveTask}
          onCancel={() => setIsFormOpen(false)}
          isLoading={actionLoading}
        />
      )}
    </div>
  );
};

export default CourseDetails;
