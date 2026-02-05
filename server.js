require("dotenv").config();

console.log("✅ RUNNING FILE:", __filename);
console.log("✅ Running server.js from:", __filename);

const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Log every request (helps debugging)
app.use((req, res, next) => {
  console.log("➡️ Request:", req.method, req.url);
  next();
});

// Home route
app.get("/", (req, res) => {
  res.send("Student Task Deadline Manager API running");
});

// Import DB pool
const pool = require("./db");

// ✅ TEST DB ROUTE (this is NOT a page, it's an API endpoint)
app.get("/test-db", (req, res) => {
  console.log("🛠️ Testing DB connection...");
  pool.query("SELECT NOW() AS serverTime", (err, rows) => {
    if (err) {
      console.error("❌ Database query failed:", err.message);
      return res.status(500).json({
        message: "Database query failed ❌",
        error: err.message,
      });
    }

    console.log("✅ Query successful:", rows);
    res.json({
      message: "Cloud MySQL connection verified ✅",
      serverTime: rows[0].serverTime,
    });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
