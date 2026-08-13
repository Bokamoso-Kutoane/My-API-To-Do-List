const Database = require('better-sqlite3');

const db = new Database('tasks.db');

// Create the table if it doesn't already exist
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    done BOOLEAN NOT NULL DEFAULT 0
  )
`);

// Only seed example tasks if the table is currently empty
const row = db.prepare('SELECT COUNT(*) AS count FROM tasks').get();

if (row.count === 0) {
  const insert = db.prepare('INSERT INTO tasks (title, done) VALUES (?, ?)');
  insert.run('Buy milk', 0);
  insert.run('Finish assignment', 0);
  insert.run('Walk the dog', 1);
  console.log('Seeded 3 example tasks.');
} else {
  console.log(`Tasks table already has ${row.count} row(s) — skipping seed.`);
}

module.exports = db;