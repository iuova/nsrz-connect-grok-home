import { Request, Response, RequestHandler } from 'express';
import { findUserByEmail } from '../models/user';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';

export const login: RequestHandler = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await findUserByEmail(email);
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Неверные учетные данные' });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    res.json({ token, user: { id: user.id, email: user.email, role: user.role, status: user.status } });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

export const getCurrentUser: RequestHandler = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Пользователь не авторизован' });
  }
  res.json(req.user);
};