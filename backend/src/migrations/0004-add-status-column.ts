import { Database } from "sqlite3";

export const up = async (db: Database) => {
  await db.run("ALTER TABLE users ADD COLUMN status TEXT DEFAULT 'active'");
};

export const down = async (db: Database) => {
  console.warn("SQLite does not support dropping columns easily");
}; 