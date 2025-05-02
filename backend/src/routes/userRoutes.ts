import express from 'express';
import { Database } from 'sqlite3';
import { authenticate } from '../middlewares/auth';
import { getDb } from '../config/database';

const router = express.Router();
const db: Database = getDb();

// Получение всех пользователей (только для админа)
router.get('/', authenticate, (req, res) => {
  const user = (req as any).user;
  if (user.role !== 'admin') {
    return res.status(403).json({ error: 'Доступ запрещён' });
  }
  db.all('SELECT id, email, role FROM users', [], (err, rows) => {
    if (err) {
      console.error('Ошибка при получении пользователей:', err);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }
    res.json(rows);
  });
});

export default router;