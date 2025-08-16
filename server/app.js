const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
require('./connection/conn'); // MongoDB connection

const userApis = require('./controllers/user');
const taskApis = require('./controllers/task');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173", // frontend origin
    credentials: true,
}));

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to Taskifyy API');
});

app.use("/api/v1", userApis);
app.use("/api/v1", taskApis);

// 404 handler for unmatched routes
app.use((req, res, next) => {
    res.status(404).json({ error: "Route not found" });
});

// Global error handler (optional)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal server error" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on PORT = ${PORT}`);
});