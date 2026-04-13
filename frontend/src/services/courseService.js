import api from './api';

/**
 * Course Service
 * Fields Mapping:
 * - UI: course_name  -> Backend: name
 * - UI: course_code  -> Backend: description
 */

const courseService = {
  getCourses: async () => {
    const response = await api.get('/courses');
    return response.data;
  },

  getCourseById: async (id) => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },

  createCourse: async (courseData) => {
    const payload = {
      name: courseData.course_name,
      description: courseData.course_code || '',
    };
    const response = await api.post('/courses', payload);
    return response.data;
  },

  updateCourse: async (id, courseData) => {
    const payload = {
      name: courseData.course_name,
      description: courseData.course_code || '',
    };
    const response = await api.put(`/courses/${id}`, payload);
    return response.data;
  },

  deleteCourse: async (id) => {
    const response = await api.delete(`/courses/${id}`);
    return response.data;
  },
};

export default courseService;
