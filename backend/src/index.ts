import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import newsRoutes from './routes/newsRoutes';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';

// Настраиваем dotenv
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/news', newsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});