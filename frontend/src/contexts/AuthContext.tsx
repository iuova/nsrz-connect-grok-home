import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { User } from '../types';
              
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}
              
export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
});
              
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
              
  const login = async (email: string, password: string) => {
    const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
    setUser(res.data.user);
    localStorage.setItem('token', res.data.token);
  };
              
  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };
              
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => setUser(res.data));
    }
  }, []);
              
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};