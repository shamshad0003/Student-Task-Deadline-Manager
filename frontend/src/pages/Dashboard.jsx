import { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import api from '../api/axios';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await api.get('/api/courses');
                setCourses(response.data);
            } catch (error) {
                console.error("Failed to fetch courses", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchCourses();
    }, [user]);

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-700">Welcome, {user?.username}</span>
                        <button onClick={logout} className="text-sm text-red-600 hover:text-red-800">Logout</button>
                    </div>
                </div>
            </header>
            <main>
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <div className="px-4 py-6 sm:px-0">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">Your Courses</h2>
                                <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Add Course</button>
                            </div>

                            {courses.length === 0 ? (
                                <div className="border-4 border-dashed border-gray-200 rounded-lg h-64 flex items-center justify-center">
                                    <span className="text-gray-500">No courses found. Create one to get started!</span>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {courses.map(course => (
                                        <div key={course.id} className="bg-white overflow-hidden shadow rounded-lg">
                                            <div className="px-4 py-5 sm:p-6">
                                                <h3 className="text-lg leading-6 font-medium text-gray-900">{course.name}</h3>
                                                <p className="mt-1 max-w-2xl text-sm text-gray-500">{course.description}</p>
                                            </div>
                                            <div className="bg-gray-50 px-4 py-4 sm:px-6">
                                                <button className="text-indigo-600 hover:text-indigo-900">View Tasks</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default Dashboard;
