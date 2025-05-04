import type { Database } from 'sqlite';

export async function up(db: Database): Promise<void> {
  await db.run(`
    UPDATE users 
    SET firstname = 'Unknown',
        lastname = 'User',
        midlename = ''
    WHERE firstname IS NULL OR lastname IS NULL
  `);
}