const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register
const register = async(req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        if (password.length < 6) {
            return res
                .status(400)
                .json({ error: "Password must be at least 6 characters long" });
        }

        const existingUser = await User.findOne({
            $or: [{ email }, { username }],
        });

        if (existingUser) {
            return res.status(400).json({ error: "User already exists!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        return res.status(201).json({ success: "User registered successfully" });
    } catch (error) {
        console.error("Register error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Login
const login = async(req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

        if (!process.env.JWT_SECRET)
            return res.status(500).json({ error: "JWT secret is not set" });

        const token = jwt.sign({ id: user._id, email: user.email },
            process.env.JWT_SECRET, { expiresIn: "30d" }
        );

        res.cookie("taskifyyUserToken", token, {
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        });

        return res
            .status(200)
            .json({ success: "User logged in successfully", token });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Logout
const logout = async(req, res) => {
    try {
        res.clearCookie("taskifyyUserToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        });
        return res.status(200).json({ success: "User logged out successfully" });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Get user details with tasks
const userDetails = async(req, res) => {
    try {
        const { user } = req;

        const userData = await User.findById(user._id)
            .populate("tasks")
            .select("-password");

        if (!userData) return res.status(404).json({ error: "User not found" });

        const tasksByStatus = {
            yetToStart: [],
            inProgress: [],
            completed: [],
        };

        userData.tasks.forEach((task) => {
            if (task.status === "yetToStart") tasksByStatus.yetToStart.push(task);
            else if (task.status === "inProgress") tasksByStatus.inProgress.push(task);
            else tasksByStatus.completed.push(task);
        });

        return res.status(200).json({
            success: "Successfully fetched user tasks",
            tasks: tasksByStatus,
        });
    } catch (error) {
        console.error("UserDetails error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { register, login, logout, userDetails };