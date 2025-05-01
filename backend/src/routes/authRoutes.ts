import express from 'express';
import { login, getCurrentUser } from '../controllers/authController';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

router.post('/login', login);
router.get('/me', authenticate, getCurrentUser);

export default router;