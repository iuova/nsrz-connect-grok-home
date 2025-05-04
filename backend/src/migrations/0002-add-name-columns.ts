import type { Database } from 'sqlite';

export async function up(db: Database): Promise<void> {
  // Add each column in a separate ALTER TABLE statement
  await db.run(`ALTER TABLE users ADD COLUMN lastname TEXT`);
  await db.run(`ALTER TABLE users ADD COLUMN firstname TEXT`);
  await db.run(`ALTER TABLE users ADD COLUMN midlename TEXT`);
}

export async function down(db: Database): Promise<void> {
  // Note: SQLite doesn't support dropping columns directly
  console.warn('SQLite does not support dropping columns - manual migration required');
}