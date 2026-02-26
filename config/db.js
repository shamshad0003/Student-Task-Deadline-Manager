// config/db.js
const mysql = require("mysql2");
require("dotenv").config();

// Create database connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: (process.env.DB_SSL === 'true' || process.env.NODE_ENV === 'production' || process.env.DB_HOST?.includes('aivencloud.com')) ? {
    rejectUnauthorized: false,
  } : false,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// For pool, we don't need manual connect() call
// The pool handles it automatically on first query.
// But we can test it:
db.getConnection((err, connection) => {
  if (err) {
    console.error("Database pool connection failed:", err.message);
  } else {
    console.log("Database pool connected successfully!");
    connection.release();
  }
});

module.exports = db;


