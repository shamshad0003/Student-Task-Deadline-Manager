const Course = require('../models/courseModel');
const { courseSchemas } = require('../utils/validationSchemas');
const { verifyCourseOwnership } = require('../utils/ownershipHelper');

const getCourses = async (req, res, next) => {
    try {
        const courses = await Course.findAllByUser(req.user.id);
        res.json(courses);
    } catch (error) {
        next(error);
    }
};

const getCourse = async (req, res, next) => {
    const { id } = req.params;
    try {
        const course = await verifyCourseOwnership(id, req.user.id);
        res.json(course);
    } catch (error) {
        next(error);
    }
};

const createCourse = async (req, res, next) => {
    try {
        const { error, value } = courseSchemas.create.validate(req.body);
        if (error) {
            const err = new Error(error.details[0].message);
            err.status = 400;
            throw err;
        }

        const { name, description } = value;
        const courseId = await Course.create(req.user.id, name, description);
        res.status(201).json({ id: courseId, name, description });
    } catch (error) {
        next(error);
    }
};

const updateCourse = async (req, res, next) => {
    const { id } = req.params;
    try {
        await verifyCourseOwnership(id, req.user.id);

        const { error, value } = courseSchemas.update.validate(req.body);
        if (error) {
            const err = new Error(error.details[0].message);
            err.status = 400;
            throw err;
        }

        const { name, description } = value;
        await Course.update(id, name, description);
        res.json({ message: "Course updated" });
    } catch (error) {
        next(error);
    }
}

const deleteCourse = async (req, res, next) => {
    const { id } = req.params;
    try {
        await verifyCourseOwnership(id, req.user.id);
        await Course.delete(id);
        res.json({ message: "Course deleted" });
    } catch (error) {
        next(error);
    }
}

module.exports = { getCourses, getCourse, createCourse, updateCourse, deleteCourse };
