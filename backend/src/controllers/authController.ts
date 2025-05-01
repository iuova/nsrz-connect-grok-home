import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail } from '../models/user';
              
export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password, role } = req.body;
  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      res.status(400).json({ error: 'User already exists' });
      return;
    }
    const userId = await createUser({ email, password, role });
    res.status(201).json({ id: userId, email, role });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
              
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  try {
    console.log('JWT_SECRET:', process.env.JWT_SECRET);
    const user = await findUserByEmail(email);
    if (!user) {
      res.status(400).json({ error: 'Invalid credentials' });
      return;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ error: 'Invalid credentials' });
      return;
    }
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    res.json({ token, user: { id: user.id, email, role: user.role } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};