const db = require('../config/db');

const User = {
    create: async (username, email, passwordHash) => {
        const [result] = await db.promise().query(
            'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
            [username, email, passwordHash]
        );
        return result.insertId;
    },

    findByEmail: async (email) => {
        const [rows] = await db.promise().query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        return rows[0];
    },

    findById: async (id) => {
        const [rows] = await db.promise().query(
            'SELECT id, username, email FROM users WHERE id = ?',
            [id]
        );
        return rows[0];
    }
};

module.exports = User;
