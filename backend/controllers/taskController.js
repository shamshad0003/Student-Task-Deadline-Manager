const Task = require('../models/taskModel');
const { taskSchemas } = require('../utils/validationSchemas');
const { verifyCourseOwnership } = require('../utils/ownershipHelper');
const { formatForMySQL } = require('../utils/dateHelper');

const getTasks = async (req, res, next) => {
    const { courseId } = req.params;
    try {
        await verifyCourseOwnership(courseId, req.user.id);
        const tasks = await Task.findAllByCourse(courseId);
        res.json(tasks);
    } catch (error) {
        next(error);
    }
};

const getTask = async (req, res, next) => {
    const { id } = req.params;
    try {
        const task = await Task.findById(id);
        if (!task) {
            const err = new Error("Task not found");
            err.status = 404;
            throw err;
        }

        await verifyCourseOwnership(task.course_id, req.user.id);
        res.json(task);
    } catch (error) {
        next(error);
    }
};

const createTask = async (req, res, next) => {
    const { courseId } = req.params;
    try {
        await verifyCourseOwnership(courseId, req.user.id);

        const { error, value } = taskSchemas.create.validate(req.body);
        if (error) {
            const err = new Error(error.details[0].message);
            err.status = 400;
            throw err;
        }

        const { title, description, dueDate } = value;
        const formattedDate = formatForMySQL(dueDate);

        const taskId = await Task.create(courseId, title, description, formattedDate);
        res.status(201).json({ id: taskId, title, description, due_date: formattedDate, status: 'pending' });
    } catch (error) {
        next(error);
    }
};

const updateTask = async (req, res, next) => {
    const { id } = req.params;
    try {
        const task = await Task.findById(id);
        if (!task) {
            const err = new Error("Task not found");
            err.status = 404;
            throw err;
        }

        await verifyCourseOwnership(task.course_id, req.user.id);

        const { error, value } = taskSchemas.update.validate(req.body);
        if (error) {
            const err = new Error(error.details[0].message);
            err.status = 400;
            throw err;
        }

        const { title, description, dueDate, status } = value;
        const formattedDate = dueDate ? formatForMySQL(dueDate) : task.due_date;

        await Task.update(id, title || task.title, description || task.description, formattedDate, status || task.status);
        res.json({ message: "Task updated" });
    } catch (error) {
        next(error);
    }
};

const updateTaskStatus = async (req, res, next) => {
    const { id } = req.params;
    try {
        const task = await Task.findById(id);
        if (!task) {
            const err = new Error("Task not found");
            err.status = 404;
            throw err;
        }

        await verifyCourseOwnership(task.course_id, req.user.id);

        const { status } = req.body;
        if (!['pending', 'completed'].includes(status)) {
            const err = new Error("Invalid status");
            err.status = 400;
            throw err;
        }

        await Task.updateStatus(id, status);
        res.json({ message: "Task status updated" });
    } catch (error) {
        next(error);
    }
}

const deleteTask = async (req, res, next) => {
    const { id } = req.params;
    try {
        const task = await Task.findById(id);
        if (!task) {
            const err = new Error("Task not found");
            err.status = 404;
            throw err;
        }

        await verifyCourseOwnership(task.course_id, req.user.id);

        await Task.delete(id);
        res.json({ message: "Task deleted" });
    } catch (error) {
        next(error);
    }
}

const getTaskStats = async (req, res, next) => {
    try {
        const stats = await Task.getStatsByUser(req.user.id);
        res.json(stats);
    } catch (error) {
        next(error);
    }
};

module.exports = { getTasks, getTask, createTask, updateTask, updateTaskStatus, deleteTask, getTaskStats };
