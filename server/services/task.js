const Task = require('../models/task');
const User = require('../models/user');

// Add Task
const addTask = async(req, res) => {
    try {
        const { title, description, status = "yetToStart", priority = "low" } = req.body;
        const user = req.user; // authMiddleware se aana chahiye

        if (!user) return res.status(401).json({ error: "Unauthorized" });

        if (!title || !description) {
            return res.status(400).json({ error: "All fields are required." });
        }
        if (title.length < 3) {
            return res.status(400).json({ error: "Title must be at least 3 characters long." });
        }
        if (description.length < 3) {
            return res.status(400).json({ error: "Description must be at least 3 characters long." });
        }

        const newTask = new Task({
            title,
            description,
            status,
            priority,
            user: user._id
        });

        await newTask.save();

        // Update user's tasks array
        user.tasks = user.tasks || [];
        user.tasks.push(newTask._id);
        await user.save();

        console.log("Task saved:", newTask);

        return res.status(200).json({ success: "Task added successfully.", task: newTask });

    } catch (error) {
        console.error("Add Task Error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Edit Task
const editTask = async(req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status, priority } = req.body;

        if (!title || !description) {
            return res.status(400).json({ error: "All fields are required." });
        }

        const task = await Task.findById(id);

        if (!task) return res.status(404).json({ error: "Task not found" });

        // Optional: check if current user owns the task
        if (req.user && String(task.user) !== String(req.user._id)) {
            return res.status(403).json({ error: "Forbidden" });
        }

        task.title = title;
        task.description = description;
        task.status = status;
        task.priority = priority;
        await task.save();

        return res.status(200).json({ success: "Task updated successfully.", task });

    } catch (error) {
        console.error("Edit Task Error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Get single Task
const getTask = async(req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findById(id);

        if (!task) return res.status(404).json({ error: "Task not found" });

        // Optional: check ownership
        if (req.user && String(task.user) !== String(req.user._id)) {
            return res.status(403).json({ error: "Forbidden" });
        }

        return res.status(200).json({ task });

    } catch (error) {
        console.error("Get Task Error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Get all tasks for logged-in user
const getAllTasks = async(req, res) => {
    try {
        if (!req.user) return res.status(401).json({ error: "Unauthorized" });

        // Fetch tasks for the user
        const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
        console.log("All tasks fetched:", tasks);

        return res.status(200).json({ tasks });

    } catch (error) {
        console.error("Get All Tasks Error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Delete Task
const deleteTask = async(req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findById(id);

        if (!task) return res.status(404).json({ error: "Task not found" });

        // Optional: check ownership
        if (req.user && String(task.user) !== String(req.user._id)) {
            return res.status(403).json({ error: "Forbidden" });
        }

        await task.deleteOne();

        // Remove task from user's tasks array
        await User.findByIdAndUpdate(task.user, { $pull: { tasks: task._id } });

        return res.status(200).json({ success: "Task deleted successfully" });

    } catch (error) {
        console.error("Delete Task Error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    addTask,
    editTask,
    getTask,
    getAllTasks,
    deleteTask
};