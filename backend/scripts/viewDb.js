const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

async function viewDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
      rejectUnauthorized: false,
    }
  });

  try {
    console.log('\n--- 👥 USERS ---');
    const [users] = await connection.query('SELECT id, username, email, created_at FROM users');
    console.table(users);

    console.log('\n--- 📚 COURSES ---');
    const [courses] = await connection.query('SELECT id, user_id, name, description FROM courses');
    console.table(courses);

    console.log('\n--- ✅ TASKS ---');
    const [tasks] = await connection.query('SELECT id, course_id, title, status, due_date FROM tasks');
    console.table(tasks);

  } catch (error) {
    console.error('Error reading database:', error);
  } finally {
    await connection.end();
  }
}

viewDatabase();
