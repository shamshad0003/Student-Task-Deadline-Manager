const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./config/db");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// JSON Syntax Error Handler
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      message: "Invalid JSON format in request body",
      error: err.message,
      tip: "Ensure your request body is a valid JSON object, e.g., {\"key\": \"value\"}"
    });
  }
  next();
});

// URL Trimmer Middleware (Fixes 404s from accidental newlines/whitespaces)
app.use((req, res, next) => {
  if (req.url.includes('%0A') || req.url.includes('%0D') || /\s/.test(req.url)) {
    const cleanUrl = decodeURIComponent(req.url).trim();
    req.url = cleanUrl;
  }
  next();
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

// Request Logger Middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Test Route
app.get("/", (req, res) => {
  res.send("Student Task & Deadline Manager API is running");
});

// Custom 404 Handler
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found. Did you forget the '/api' prefix?",
    requestedUrl: req.originalUrl,
    method: req.method,
    availablePrefixes: ["/api/auth", "/api/courses", "/api/tasks"]
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
