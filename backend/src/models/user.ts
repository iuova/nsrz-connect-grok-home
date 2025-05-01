import db from '../config/database';
import bcrypt from 'bcryptjs';
import { UserModel } from "./schemas"; // Предполагается, что модель UserModel определена здесь
              
export interface User {
  id?: number;
  email: string;
  password: string;
  role: 'employee' | 'admin' | 'news_manager';
}

// Интерфейс для this в колбэке SQLite
interface SQLiteRunResult {
  lastID: number;
  changes: number;
}
              
export const createUser = async (user: User): Promise<number> => {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  return new Promise<number>((resolve, reject) => {
    db.run(
      'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
      [user.email, hashedPassword, user.role],
      function(this: SQLiteRunResult, err: Error | null) {
        if (err) reject(err);
        resolve(this.lastID);
      }
    );
  });
};
              
export const findUserByEmail = async (email: string): Promise<User | null> => {
  return new Promise<User | null>((resolve, reject) => {
    db.get('SELECT * FROM users WHERE email = ?', [email], (err: Error | null, row: User) => {
      if (err) reject(err);
      resolve(row || null);
    });
  });
};

export const findUserById = async (id: string) => {
  const user = await UserModel.findById(id).exec();
  if (!user) throw new Error("User not found");
  return user;
};