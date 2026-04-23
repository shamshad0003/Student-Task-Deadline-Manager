import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import courseService from '../services/courseService';
import taskService from '../services/taskService';
import CourseCard from '../components/courses/CourseCard';
import CourseForm from '../components/courses/CourseForm';
import EmptyState from '../components/courses/EmptyState';
import { CourseCardSkeleton, StatsSkeleton } from '../components/shared/Skeleton';
import StatsCard from '../components/dashboard/StatsCard';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal/Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setStatsLoading(true);
    try {
      const [coursesData, statsData] = await Promise.all([
        courseService.getCourses(),
        taskService.getTaskStats()
      ]);
      setCourses(coursesData);
      setStats(statsData);
    } catch (err) {
      setError('Failed to load dashboard data.');
      toast.error('Failed to sync dashboard');
      console.error(err);
    } finally {
      setLoading(false);
      setStatsLoading(false);
    }
  };

  const handleCreateClick = () => {
    setEditingCourse(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (course) => {
    setEditingCourse(course);
    setIsFormOpen(true);
  };

  const handleSaveCourse = async (formData) => {
    setFormLoading(true);
    try {
      if (editingCourse) {
        await courseService.updateCourse(editingCourse.id, formData);
        toast.success('Course updated successfully!');
      } else {
        await courseService.createCourse(formData);
        toast.success('Course created successfully!');
      }
      setIsFormOpen(false);
      fetchDashboardData(); // Refresh everything
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save course.');
      console.error(err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteCourse = async (id) => {
    if (window.confirm('Are you sure you want to delete this course? All associated tasks will be lost.')) {
      try {
        await courseService.deleteCourse(id);
        setCourses(courses.filter(c => c.id !== id));
        toast.success('Course deleted');
        // Refresh stats since tasks might have been deleted
        const newStats = await taskService.getTaskStats();
        setStats(newStats);
      } catch (err) {
        toast.error('Failed to delete course.');
        console.error(err);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">
            Dashboard
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 mt-1 font-medium italic">
            "Your persistence today is your success tomorrow."
          </p>
        </div>
        <button
          onClick={handleCreateClick}
          className="inline-flex items-center px-8 py-4 border border-transparent text-sm font-black rounded-2xl text-white bg-indigo-600 hover:bg-gray-900 shadow-2xl shadow-indigo-200 transition-all active:scale-95 uppercase tracking-widest"
        >
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
          </svg>
          Add Course
        </button>
      </div>

      {/* Analytics Section */}
      {statsLoading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <StatsCard 
            title="Total Tasks" 
            value={stats.total} 
            color="indigo"
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
          />
          <StatsCard 
            title="Pending" 
            value={stats.pending} 
            color="amber"
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            description="Active"
          />
          <StatsCard 
            title="Completed" 
            value={stats.completed} 
            color="emerald"
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>}
            description={`Done (${stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%)`}
          />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-8 bg-red-50 border-l-4 border-red-400 p-4 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3 flex-grow">
              <p className="text-sm font-black text-red-700">{error}</p>
            </div>
            <div className="ml-auto">
              <button onClick={fetchDashboardData} className="text-xs font-black text-red-700 uppercase tracking-widest hover:underline">
                Sync Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Course List Section */}
      <div className="mt-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 border-b border-gray-100 dark:border-slate-800 pb-4 gap-4">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Your Courses</h2>
              <span className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{courses.length} Active</span>
            </div>
            
            {/* Search Input */}
            <div className="relative w-full md:w-80 group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by name or code..."
                className="block w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700 rounded-2xl text-sm font-bold placeholder-gray-400 focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-500 transition-all dark:text-white shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <CourseCardSkeleton key={i} />
            ))}
          </div>
        ) : courses.length > 0 ? (
          (() => {
            const filteredCourses = courses.filter(course => 
              course.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
              course.code?.toLowerCase().includes(searchTerm.toLowerCase())
            );

            if (filteredCourses.length === 0) {
              return (
                <div className="py-20 text-center animate-fade-in">
                  <div className="bg-gray-100 dark:bg-slate-800 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-gray-400">
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">No results found</h3>
                  <p className="text-gray-500 dark:text-gray-400 font-medium">
                    We couldn't find any courses matching "{searchTerm}"
                  </p>
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="mt-6 text-sm font-black text-indigo-600 hover:underline uppercase tracking-widest"
                  >
                    Clear Search
                  </button>
                </div>
              );
            }

            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-slide-up">
                {filteredCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteCourse}
                  />
                ))}
              </div>
            );
          })()
        ) : (
          <EmptyState onAddClick={handleCreateClick} />
        )}
      </div>

      {/* Course Form Modal */}
      {isFormOpen && (
        <CourseForm
          course={editingCourse}
          onSave={handleSaveCourse}
          onCancel={() => setIsFormOpen(false)}
          isLoading={formLoading}
        />
      )}
    </div>
  );
};

export default Dashboard;
