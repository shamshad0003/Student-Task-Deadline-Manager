const db = require('../config/db');

const Course = {
    create: async (userId, name, description) => {
        const [result] = await db.promise().query(
            'INSERT INTO courses (user_id, name, description) VALUES (?, ?, ?)',
            [userId, name, description]
        );
        return result.insertId;
    },

    findAll: async () => {
        const [rows] = await db.promise().query(
            'SELECT * FROM courses ORDER BY created_at DESC'
        );
        return rows;
    },

    findAllByUser: async (userId) => {
        const [rows] = await db.promise().query(
            'SELECT * FROM courses WHERE user_id = ? ORDER BY created_at DESC',
            [userId]
        );
        return rows;
    },

    findById: async (id) => {
        const [rows] = await db.promise().query(
            'SELECT * FROM courses WHERE id = ?',
            [id]
        );
        return rows[0];
    },

    update: async (id, name, description) => {
        const [result] = await db.promise().query(
            'UPDATE courses SET name = ?, description = ? WHERE id = ?',
            [name, description, id]
        );
        return result.affectedRows;
    },

    delete: async (id) => {
        const [result] = await db.promise().query(
            'DELETE FROM courses WHERE id = ?',
            [id]
        );
        return result.affectedRows;
    }
};

module.exports = Course;
