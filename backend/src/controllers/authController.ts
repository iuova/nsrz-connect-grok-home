import { Request, Response, RequestHandler } from 'express';
import { findUserByEmail } from '../models/user';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import db from '../config/database';

export const login: RequestHandler = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await findUserByEmail(email);
    if (!user || user.password !== password) {
      res.status(401).json({ error: 'Неверные учетные данные' });
      return;
    }
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    res.json({ token, user: { id: user.id, email: user.email, role: user.role, status: user.status } });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

export const getCurrentUser: RequestHandler = async (req, res) => {
  if (!req.user) {
    res.status(401).json({ error: 'Пользователь не авторизован' });
    return;
  }
  res.json(req.user);
};

export const register: RequestHandler = async (req, res) => {
  const { email, password, role } = req.body;
  if (!['employee', 'admin', 'news_manager'].includes(role)) {
    res.status(400).json({ error: 'Недопустимая роль' });
    return;
  }
  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      res.status(400).json({ error: 'Пользователь с таким email уже существует' });
      return;
    }
    db.run(
      'INSERT INTO users (email, password, role, status) VALUES (?, ?, ?, ?)',
      [email, password, role, 'active'],
      function (err) {
        if (err) {
          res.status(500).json({ error: 'Ошибка сервера' });
          return;
        }
        res.status(201).json({ message: 'Пользователь зарегистрирован' });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};