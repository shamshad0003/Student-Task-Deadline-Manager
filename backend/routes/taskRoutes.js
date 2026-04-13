const express = require('express');
const router = express.Router();
const { getTasks, getTask, createTask, updateTask, updateTaskStatus, deleteTask, getTaskStats } = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// Note: create and getTasks are handled in courseRoutes for nested structure
// These are for direct access if needed, or specifically for operations on existing tasks

router.get('/stats', getTaskStats);
router.get('/:id', getTask);
router.put('/:id', updateTask);
router.patch('/:id/status', updateTaskStatus);
router.delete('/:id', deleteTask);

module.exports = router;
