const db = require('../config/db');

const Task = {
    create: async (courseId, title, description, dueDate) => {
        const [result] = await db.promise().query(
            'INSERT INTO tasks (course_id, title, description, due_date) VALUES (?, ?, ?, ?)',
            [courseId, title, description, dueDate]
        );
        return result.insertId;
    },

    findAllByCourse: async (courseId) => {
        const [rows] = await db.promise().query(
            'SELECT * FROM tasks WHERE course_id = ? ORDER BY due_date ASC',
            [courseId]
        );
        return rows;
    },

    findById: async (id) => {
        const [rows] = await db.promise().query(
            'SELECT * FROM tasks WHERE id = ?',
            [id]
        );
        return rows[0];
    },

    update: async (id, title, description, dueDate, status) => {
        const [result] = await db.promise().query(
            'UPDATE tasks SET title = ?, description = ?, due_date = ?, status = ? WHERE id = ?',
            [title, description, dueDate, status, id]
        );
        return result.affectedRows;
    },

    updateStatus: async (id, status) => {
        const [result] = await db.promise().query(
            'UPDATE tasks SET status = ? WHERE id = ?',
            [status, id]
        );
        return result.affectedRows;
    },

    delete: async (id) => {
        const [result] = await db.promise().query(
            'DELETE FROM tasks WHERE id = ?',
            [id]
        );
        return result.affectedRows;
    }
};

module.exports = Task;
