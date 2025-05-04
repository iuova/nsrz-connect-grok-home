import express from 'express';
import { Database } from 'sqlite3';
import { authenticate } from '../middlewares/auth';
import { getDb } from '../config/database';
import bcrypt from 'bcrypt';

const router = express.Router();
const db: Database = getDb();

// Получение всех пользователей (только для админа)
router.get('/', authenticate, (req, res) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Доступ запрещён' });
  }

  const { search = '' } = req.query;
  let query = 'SELECT id, email, lastname, firstname, midlename, role, status, created_at FROM users';
  const params = [];

  if (search) {
    query += ' WHERE lastname LIKE ? OR firstname LIKE ? OR email LIKE ?';
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('Ошибка при получении пользователей:', err);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }
    res.json(rows);
  });
});

// Добавление пользователя (только для админа)
router.post('/', authenticate, async (req, res) => {
    const user = (req as any).user;
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Доступ запрещён' });
    }
    const { email, lastname, firstname, midlename, password, role } = req.body;
    if (!email || !lastname || !firstname || !password || !role) {
      return res.status(400).json({ error: 'Email, фамилия, имя, пароль и роль обязательны' });
    }
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      db.run(
        'INSERT INTO users (email, lastname, firstname, midlename, password, role) VALUES (?, ?, ?, ?, ?, ?)',
        [email, lastname, firstname, midlename || null, hashedPassword, role],
        function (err) {
          if (err) {
            console.error('Ошибка при добавлении пользователя:', err);
            return res.status(400).json({ error: 'Пользователь уже существует' });
          }
          res.status(201).json({ id: this.lastID });
        }
      );
    } catch (error) {
      console.error('Ошибка сервера:', error);
      res.status(500).json({ error: 'Ошибка сервера' });
    }
  });
  
  // Обновление пользователя (только для админа)
  router.put('/:id', authenticate, async (req, res) => {
    const user = (req as any).user;
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Доступ запрещён' });
    }
    const { id } = req.params;
    const { email, lastname, firstname, midlename, password, role } = req.body;
    if (!email || !lastname || !firstname || !role) {
      return res.status(400).json({ error: 'Email, фамилия, имя и роль обязательны' });
    }
    try {
      let query = 'UPDATE users SET email = ?, lastname = ?, firstname = ?, midlename = ?, role = ?';
      const params = [email, lastname, firstname, midlename || null, role];
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        query += ', password = ?';
        params.push(hashedPassword);
      }
      query += ' WHERE id = ?';
      params.push(id);
      db.run(query, params, function (err) {
        if (err || this.changes === 0) {
          console.error('Ошибка при обновлении пользователя:', err);
          return res.status(404).json({ error: 'Пользователь не найден' });
        }
        res.json({ message: 'Пользователь обновлён' });
      });
    } catch (error) {
      console.error('Ошибка сервера:', error);
      res.status(500).json({ error: 'Ошибка сервера' });
    }
  });
  
  // Удаление пользователя (только для админа)
  router.delete('/:id', authenticate, (req, res) => {
    const user = (req as any).user;
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Доступ запрещён' });
    }
    const { id } = req.params;
    db.run('DELETE FROM users WHERE id = ?', [id], function (err) {
      if (err || this.changes === 0) {
        console.error('Ошибка при удалении пользователя:', err);
        return res.status(404).json({ error: 'Пользователь не найден' });
      }
      res.json({ message: 'Пользователь удалён' });
    });
  });
  
  export default router;