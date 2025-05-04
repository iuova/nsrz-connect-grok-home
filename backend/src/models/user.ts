import db from '../config/database';

export interface User {
  id: number;
  firstname: string,
  lastname: string,
  midlename: string,
  email: string;
  password: string;
  role: 'employee' | 'admin' | 'news_manager';
  status: 'active' | 'blocked';
  created_at?: string;
}

export const findUserById = async (id: number): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE id = ?', [id], (err, row: User | undefined) => {
      if (err) reject(err);
      resolve(row || null);
    });
  });
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row: User | undefined) => {
      if (err) reject(err);
      resolve(row || null);
    });
  });
};