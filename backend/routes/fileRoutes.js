const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const upload = require('../config/multerConfig');
const authMiddleware = require('../middleware/authMiddleware');

// All file routes are protected
router.use(authMiddleware);

// Upload a file to a specific course
router.post('/course/:courseId', upload.single('file'), fileController.uploadFile);

// Get all files for a specific course
router.get('/course/:courseId', fileController.getCourseFiles);

// Delete a specific file
router.delete('/:id', fileController.deleteFile);

module.exports = router;
