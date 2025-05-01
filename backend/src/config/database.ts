import sqlite3 from 'sqlite3';
import path from 'path';
              
const dbPath = path.resolve(__dirname, '../../database.db');
const db = new sqlite3.Database(dbPath, (err: Error | null) => {
  if (err) {
    console.error('Error connecting to SQLite:', err);
  } else {
    console.log('Connected to SQLite database');
  }
});
              
// Initialize tables
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT,
      role TEXT CHECK(role IN ('employee', 'admin', 'news_manager')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS news (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      content TEXT,
      author_id INTEGER,
      published BOOLEAN,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (author_id) REFERENCES users(id)
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS departments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      parent_id INTEGER,
      FOREIGN KEY (parent_id) REFERENCES departments(id)
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT,
      position TEXT,
      email TEXT UNIQUE,
      phone TEXT,
      status TEXT CHECK(status IN ('active', 'vacation')),
      department_id INTEGER,
      FOREIGN KEY (department_id) REFERENCES departments(id)
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS vacations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employee_id INTEGER,
      total_days INTEGER,
      used_days INTEGER,
      start_date DATE,
      end_date DATE,
      FOREIGN KEY (employee_id) REFERENCES employees(id)
    )
  `);
});
              
export default db;