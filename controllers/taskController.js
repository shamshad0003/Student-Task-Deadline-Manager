const Task = require('../models/taskModel');
const Course = require('../models/courseModel');

const getTasks = async (req, res) => {
    const { courseId } = req.params;
    try {
        // Check ownership
        const course = await Course.findById(courseId);
        if (!course || course.user_id !== req.user.id) {
            return res.status(403).json({ message: "Access denied" });
        }

        const tasks = await Task.findAllByCourse(courseId);
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getTask = async (req, res) => {
    const { id } = req.params;
    try {
        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        // Verify ownership via course
        const course = await Course.findById(task.course_id);
        if (!course || course.user_id !== req.user.id) {
            return res.status(403).json({ message: "Access denied" });
        }

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const createTask = async (req, res) => {
    const { courseId } = req.params;
    const { title, description, dueDate } = req.body;

    if (!title) {
        return res.status(400).json({ message: "Task Title is required" });
    }

    try {
        const course = await Course.findById(courseId);
        if (!course || course.user_id !== req.user.id) {
            return res.status(403).json({ message: "Access denied" });
        }

        // Format date for MySQL if provided
        let formattedDate = dueDate;
        if (dueDate) {
            formattedDate = new Date(dueDate).toISOString().slice(0, 19).replace('T', ' ');
        }

        const taskId = await Task.create(courseId, title, description, formattedDate);
        res.status(201).json({ id: taskId, title, description, due_date: formattedDate, status: 'pending' });
    } catch (error) {
        console.error("Create Task Error:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, description, dueDate, status } = req.body;

    try {
        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        const course = await Course.findById(task.course_id);
        if (!course || course.user_id !== req.user.id) {
            return res.status(403).json({ message: "Access denied" });
        }

        // Format date for MySQL if provided
        let formattedDate = dueDate;
        if (dueDate) {
            formattedDate = new Date(dueDate).toISOString().slice(0, 19).replace('T', ' ');
        }

        await Task.update(id, title, description, formattedDate, status || task.status);
        res.json({ message: "Task updated" });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const updateTaskStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // 'pending' or 'completed'

    try {
        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        const course = await Course.findById(task.course_id);
        if (!course || course.user_id !== req.user.id) {
            return res.status(403).json({ message: "Access denied" });
        }

        await Task.updateStatus(id, status);
        res.json({ message: "Task status updated" });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

const deleteTask = async (req, res) => {
    const { id } = req.params;
    try {
        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        const course = await Course.findById(task.course_id);
        if (!course || course.user_id !== req.user.id) {
            return res.status(403).json({ message: "Access denied" });
        }

        await Task.delete(id);
        res.json({ message: "Task deleted" });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = { getTasks, getTask, createTask, updateTask, updateTaskStatus, deleteTask };
