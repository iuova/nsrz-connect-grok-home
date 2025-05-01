import { Request, Response, RequestHandler } from 'express';
import { findUserByEmail } from '../models/user';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '../models/user';
import db from '../config/database';

export const login: RequestHandler = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email и пароль обязательны' });
  }
  try {
    const user = await findUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Неверные учетные данные' });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    res.json({ token, user: { id: user.id, email: user.email, role: user.role, status: user.status } });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

export const getCurrentUser: RequestHandler = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Пользователь не авторизован' });
  }
  res.json(req.user);
};

export const register: RequestHandler = async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return res.status(400).json({ error: 'Email, пароль и роль обязательны' });
  }
  if (!['employee', 'admin', 'news_manager'].includes(role)) {
    return res.status(400).json({ error: 'Недопустимая роль' });
  }
  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    db.run(
      'INSERT INTO users (email, password, role, status) VALUES (?, ?, ?, ?)',
      [email, hashedPassword, role, 'active'],
      function (err) {
        if (err) {
          return res.status(500).json({ error: 'Ошибка сервера' });
        }
        res.status(201).json({ message: 'Пользователь зарегистрирован' });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};