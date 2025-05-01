import express from 'express';
import { getNews, addNews, updateNewsItem, deleteNewsItem, publishMultiple } from '../controllers/newsController';
import { authenticate, authorize } from '../middlewares/auth';

const router = express.Router();

router.get('/', getNews);
router.post('/', authenticate, authorize(['admin', 'news_manager']), addNews);
router.put('/:id', authenticate, authorize(['admin', 'news_manager']), updateNewsItem);
router.delete('/:id', authenticate, authorize(['admin', 'news_manager']), deleteNewsItem);
router.post('/publish', authenticate, authorize(['admin', 'news_manager']), publishMultiple);

export default router;