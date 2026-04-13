const express = require("express");
const cors = require("cors");
require("dotenv").config();
const errorMiddleware = require("./middleware/errorMiddleware");

// Startup Validation
const requiredEnv = ['JWT_SECRET', 'DB_HOST', 'DB_USER', 'DB_NAME'];
const missingEnv = requiredEnv.filter(k => !process.env[k]);
if (missingEnv.length > 0) {
  console.error(`FATAL ERROR: Missing required environment variables: ${missingEnv.join(', ')}`);
  process.exit(1);
}

const app = express();

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  'http://localhost:5177',
  'http://localhost:5178',
  'http://localhost:5179',
  'http://localhost:5180'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.FRONTEND_URL === origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Request Logger (Move to top)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// API Base Route
app.get('/api', (req, res) => {
  res.json({
    message: "Student Task & Deadline Manager API",
    status: "Running",
    version: "1.0.0",
    endpoints: ["/api/auth", "/api/courses", "/api/tasks"]
  });
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

// Global Error Handler
app.use(errorMiddleware);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
