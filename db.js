const mysql = require("mysql2");
require("dotenv").config();

console.log("✅ db.js loaded");

const pool = mysql.createPool({
  host: process.env.DB_HOST?.trim(),
  port: Number(String(process.env.DB_PORT).trim()),
  user: process.env.DB_USER?.trim(),
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME?.trim(),
  ssl: { rejectUnauthorized: false },
});

pool.getConnection((err, conn) => {
  if (err) return console.error("❌ MySQL connection failed:", err.message);
  console.log("✅ Connected to MySQL (Aiven)");
  conn.release();
});

module.exports = pool;
