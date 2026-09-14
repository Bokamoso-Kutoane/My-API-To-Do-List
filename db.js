require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function initDB() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS tasks (
                id SERIAL PRIMARY KEY,
                title TEXT NOT NULL,
                done BOOLEAN DEFAULT FALSE
            )
        `);

        const result = await pool.query('SELECT COUNT(*) FROM tasks');
        if (parseInt(result.rows[0].count) === 0) {
            await pool.query(`
                INSERT INTO tasks (title, done) VALUES 
                ('Buy milk', false),
                ('Finish assignment', false),
                ('Walk the dog', true)
            `);
            console.log("Database seeded with 3 example tasks.");
        } else {
            console.log("Database already has tasks, skipping seed.");
        }
    } catch (err) {
        console.error("Database initialization error:", err);
    }
}

initDB();

// --- CRUD REPOSITORY FUNCTIONS ---

async function getAllTasks() {
    const result = await pool.query('SELECT * FROM tasks ORDER BY id ASC');
    return result.rows;
}

async function getTaskById(id) {
    // Postgres uses $1, $2 instead of SQLite's ? for parameters
    const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
    return result.rows[0]; 
}

async function addTask(title, done = false) {
    const result = await pool.query(
        'INSERT INTO tasks (title, done) VALUES ($1, $2) RETURNING *',
        [title, done]
    );
    return result.rows[0];
}

async function updateTask(id, title, done) {
    const result = await pool.query(
        'UPDATE tasks SET title = $1, done = $2 WHERE id = $3 RETURNING *',
        [title, done, id]
    );
    return result.rows[0];
}

async function deleteTask(id) {
    const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
}

module.exports = {
    getAllTasks,
    getTaskById,
    addTask,
    updateTask,
    deleteTask
};
