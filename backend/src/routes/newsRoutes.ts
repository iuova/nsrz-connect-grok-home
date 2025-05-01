import express from 'express';
import { addNews, getNews } from '../controllers/newsController';
import { authenticate, authorize } from '../middlewares/auth';
             
const router = express.Router();
             
router.get('/', getNews);
router.post('/', authenticate, authorize(['admin', 'news_manager']), addNews);
             
export default router;