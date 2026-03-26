const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

async function fixSchema() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: { rejectUnauthorized: false }
    });

    try {
        console.log("Altering tasks table...");
        await connection.query("ALTER TABLE tasks MODIFY COLUMN due_date DATETIME");
        console.log("Success: due_date column changed to DATETIME.");
    } catch (error) {
        console.error("Error altering table:", error.message);
    } finally {
        await connection.end();
    }
}

fixSchema();
