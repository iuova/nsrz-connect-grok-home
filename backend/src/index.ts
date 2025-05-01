import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import newsRoutes from './routes/newsRoutes';
import departmentRoutes from './routes/departmentRoutes';
import employeeRoutes from './routes/employeeRoutes';
import vacationRoutes from './routes/vacationRoutes';
import exportRoutes from './routes/exportRoutes';
              
dotenv.config();
              
const app = express();
const PORT = process.env.PORT || 5000;
              
app.use(cors({
  origin: 'http://localhost:5173', // адрес вашего фронтенда (Vite обычно использует порт 5173)
  credentials: true
}));
app.use(express.json());
              
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/vacations', vacationRoutes);
app.use('/api/export', exportRoutes);
              
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});