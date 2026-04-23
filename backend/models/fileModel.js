const db = require('../config/db');

const File = {
    create: async (courseId, filename, originalName, filePath, fileType, fileSize) => {
        const [result] = await db.promise().query(
            'INSERT INTO files (course_id, filename, original_name, file_path, file_type, file_size) VALUES (?, ?, ?, ?, ?, ?)',
            [courseId, filename, originalName, filePath, fileType, fileSize]
        );
        return result.insertId;
    },

    findByCourse: async (courseId) => {
        const [rows] = await db.promise().query(
            'SELECT * FROM files WHERE course_id = ? ORDER BY created_at DESC',
            [courseId]
        );
        return rows;
    },

    findById: async (id) => {
        const [rows] = await db.promise().query(
            'SELECT * FROM files WHERE id = ?',
            [id]
        );
        return rows[0];
    },

    delete: async (id) => {
        const [result] = await db.promise().query(
            'DELETE FROM files WHERE id = ?',
            [id]
        );
        return result.affectedRows;
    }
};

module.exports = File;
