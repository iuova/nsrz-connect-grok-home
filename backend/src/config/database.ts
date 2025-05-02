import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    // Создание таблицы users
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('employee', 'admin', 'news_manager')),
        status TEXT NOT NULL CHECK(status IN ('active', 'blocked')),
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);
    // Создание таблицы news
    db.run(`
      CREATE TABLE IF NOT EXISTS news (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        author_id INTEGER NOT NULL,
        published BOOLEAN NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (author_id) REFERENCES users(id)
      )
    `);
  }
});

export function getDb(): sqlite3.Database {
  return new sqlite3.Database('/Users/mac/Projects/nsrz-connect-grok/backend/database.db');
}

export default db;