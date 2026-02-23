const Course = require('../models/courseModel');

const getCourses = async (req, res) => {
    try {
        const courses = await Course.findAllByUser(req.user.id);
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getCourse = async (req, res) => {
    const { id } = req.params;
    try {
        const course = await Course.findById(id);
        if (!course || course.user_id !== req.user.id) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const createCourse = async (req, res) => {
    const { name, description } = req.body;

    if (!name) {
        return res.status(400).json({ message: "Course Name is required" });
    }

    try {
        const courseId = await Course.create(req.user.id, name, description);
        res.status(201).json({ id: courseId, name, description });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const updateCourse = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    try {
        const course = await Course.findById(id);
        if (!course || course.user_id !== req.user.id) {
            return res.status(404).json({ message: "Course not found" });
        }
        await Course.update(id, name, description);
        res.json({ message: "Course updated" });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

const deleteCourse = async (req, res) => {
    const { id } = req.params;
    try {
        const course = await Course.findById(id);
        if (!course || course.user_id !== req.user.id) {
            return res.status(404).json({ message: "Course not found" });
        }
        await Course.delete(id);
        res.json({ message: "Course deleted" });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = { getCourses, getCourse, createCourse, updateCourse, deleteCourse };
