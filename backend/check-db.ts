import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function checkDatabase() {
  const db = await open({
    filename: '/Users/mac/Projects/nsrz-connect-grok/backend/database.db',
    driver: sqlite3.Database,
  });

  // Пример запроса: выбор всех пользователей
  const users = await db.all('SELECT * FROM users');
  console.log('Users:', users);

  await db.close();
}

checkDatabase().catch(console.error); 