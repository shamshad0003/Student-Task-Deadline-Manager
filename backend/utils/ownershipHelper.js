const Course = require('../models/courseModel');

/**
 * Validates if the given course belongs to the user.
 * @param {string|number} courseId - The ID of the course.
 * @param {string|number} userId - The ID of the authenticated user.
 * @returns {Promise<Object>} - The course object if ownership is verified.
 * @throws {Error} - Custom error with status code if verification fails.
 */
const verifyCourseOwnership = async (courseId, userId) => {
    const course = await Course.findById(courseId);
    
    if (!course) {
        const error = new Error("Course not found");
        error.status = 404;
        throw error;
    }

    if (course.user_id !== userId) {
        const error = new Error("Access denied: You do not own this course");
        error.status = 403;
        throw error;
    }

    return course;
};

module.exports = { verifyCourseOwnership };
