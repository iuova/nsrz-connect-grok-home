import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { findUserById } from '../models/user';

export const authenticate: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ error: 'Токен не предоставлен' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; role: string };
    const user = await findUserById(decoded.id);
    if (!user) {
      res.status(401).json({ error: 'Пользователь не найден' });
      return;
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Недействительный токен' });
  }
};

export const authorize = (roles: string[]): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ error: 'Доступ запрещён' });
      return;
    }
    next();
  };
};