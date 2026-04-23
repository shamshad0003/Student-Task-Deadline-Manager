const path = require('path');
const fs = require('fs');
const File = require('../models/fileModel');

const fileController = {
    uploadFile: async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }

            const { courseId } = req.params;
            const { filename, originalname, mimetype, size } = req.file;

            // Generate a relative path for the client
            const relativePath = `/uploads/${filename}`;

            const fileId = await File.create(
                courseId, 
                filename, 
                originalname, 
                relativePath, 
                mimetype, 
                size
            );

            res.status(201).json({
                message: 'File uploaded successfully',
                file: {
                    id: fileId,
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
            const files = await File.findByCourse(courseId);
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
            const file = await File.findById(id);
            if (!file) {
                return res.status(404).json({ message: 'File not found' });
            }

            const absolutePath = path.join(__dirname, '../uploads', file.filename);

            // 2. Delete from disk
            if (fs.existsSync(absolutePath)) {
                fs.unlinkSync(absolutePath);
            }

            // 3. Delete from DB
            await File.delete(id);

            res.json({ message: 'File deleted successfully' });
        } catch (error) {
            console.error('Delete file error:', error);
            res.status(500).json({ message: 'Server error during file deletion' });
        }
    }
};

module.exports = fileController;
