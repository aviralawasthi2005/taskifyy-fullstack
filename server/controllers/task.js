const express = require('express');
const authMiddleware = require("../middleware/authMiddleware");
const { addTask, editTask, getTask, getAllTasks, deleteTask } = require('../services/task');

const router = express.Router();

// Routes
router.post("/tasks", authMiddleware, addTask); // Create Task
router.put("/tasks/:id", authMiddleware, editTask); // Edit Task
router.get("/tasks", authMiddleware, getAllTasks); // Get All Tasks ✅
router.get("/tasks/:id", authMiddleware, getTask); // Get Task by ID
router.delete("/tasks/:id", authMiddleware, deleteTask); // Delete Task

module.exports = router;