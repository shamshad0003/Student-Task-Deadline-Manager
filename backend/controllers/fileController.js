const mysql = require('mysql2/promise');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false }
};

const pool = mysql.createPool(dbConfig);

const fileController = {
    uploadFile: async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }

            const { courseId } = req.params;
            const { filename, originalname, mimetype, size, path: filePath } = req.file;

            // Generate a relative path for the client
            const relativePath = `/uploads/${filename}`;

            const [result] = await pool.query(
                'INSERT INTO files (course_id, filename, original_name, file_path, file_type, file_size) VALUES (?, ?, ?, ?, ?, ?)',
                [courseId, filename, originalname, relativePath, mimetype, size]
            );

            res.status(201).json({
                message: 'File uploaded successfully',
                file: {
                    id: result.insertId,
                    original_name: originalname,
                    file_path: relativePath,
                    file_type: mimetype,
                    file_size: size
                }
            });
        } catch (error) {
            console.error('Upload error:', error);
            res.status(500).json({ message: 'Server error during file upload', error: error.message });
        }
    },

    getCourseFiles: async (req, res) => {
        try {
            const { courseId } = req.params;
            const [files] = await pool.query(
                'SELECT * FROM files WHERE course_id = ? ORDER BY created_at DESC',
                [courseId]
            );

            res.json(files);
        } catch (error) {
            console.error('Fetch files error:', error);
            res.status(500).json({ message: 'Server error while fetching files' });
        }
    },

    deleteFile: async (req, res) => {
        try {
            const { id } = req.params;
            
            // 1. Get file details from DB
            const [files] = await pool.query('SELECT * FROM files WHERE id = ?', [id]);
            if (files.length === 0) {
                return res.status(404).json({ message: 'File not found' });
            }

            const file = files[0];
            const absolutePath = path.join(__dirname, '../../uploads', file.filename);

            // 2. Delete from disk
            if (fs.existsSync(absolutePath)) {
                fs.unlinkSync(absolutePath);
            }

            // 3. Delete from DB
            await pool.query('DELETE FROM files WHERE id = ?', [id]);

            res.json({ message: 'File deleted successfully' });
        } catch (error) {
            console.error('Delete file error:', error);
            res.status(500).json({ message: 'Server error during file deletion' });
        }
    }
};

module.exports = fileController;
