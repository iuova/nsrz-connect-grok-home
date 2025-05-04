import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import fs from 'fs';

async function migrate(): Promise<void> {
  const db = await open({
    filename: '/Users/mac/Projects/nsrz-connect-grok/backend/database.db', // Update with your DB path
    driver: sqlite3.Database
  });

  // Create migrations table if it doesn't exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Get already executed migrations
  const executedMigrations = await db.all('SELECT name FROM migrations');
  const executedNames = new Set(executedMigrations.map(m => m.name));

  // Read migration files
  const migrationFiles = fs.readdirSync(path.join(__dirname, 'src/migrations'))
    .filter(file => file.endsWith('.ts'))
    .sort();

  // Run new migrations
  for (const file of migrationFiles) {
    if (!executedNames.has(file)) {
      console.log(`Running migration: ${file}`);
      const migration = require(`./src/migrations/${file}`);
      await migration.up(db);
      await db.run('INSERT INTO migrations (name) VALUES (?)', [file]);
      console.log(`Completed migration: ${file}`);
    }
  }

  await db.close();
}

migrate().catch(console.error); 