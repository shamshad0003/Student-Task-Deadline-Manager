import api from './api';

/**
 * Task Service
 * Handles API interactions for task management.
 * All functions return the raw data or throw an error for the caller to handle.
 */

const taskService = {
  /**
   * Fetch all tasks associated with a specific course.
   */
  getTasksByCourse: async (courseId) => {
    const response = await api.get(`/courses/${courseId}/tasks`);
    return response.data;
  },

  /**
   * Create a new task for a course.
   * @param {string} courseId
   * @param {object} taskData - { title, description, dueDate }
   */
  createTask: async (courseId, taskData) => {
    const response = await api.post(`/courses/${courseId}/tasks`, taskData);
    return response.data;
  },

  /**
   * Update an existing task's core details.
   */
  updateTask: async (id, taskData) => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  /**
   * Specifically update the status of a task (pending/completed).
   */
  updateTaskStatus: async (id, status) => {
    const response = await api.patch(`/tasks/${id}/status`, { status });
    return response.data;
  },

  /**
   * Delete a task by ID.
   */
  deleteTask: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  /**
   * Get user task statistics
   */
  getTaskStats: async () => {
    const response = await api.get('/tasks/stats');
    return response.data;
  },
};

export default taskService;
