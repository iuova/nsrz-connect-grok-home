import express from 'express';
import { RequestHandler } from 'express';
import { getNews, addNews, updateNewsItem, deleteNewsItem, publishMultiple } from '../controllers/newsController';
import { authenticate, authorize } from '../middlewares/auth';

const router = express.Router();

router.get('/', getNews as RequestHandler);
router.post('/', authenticate, authorize(['admin', 'news_manager']), addNews as RequestHandler);
router.put('/:id', authenticate, authorize(['admin', 'news_manager']), updateNewsItem as RequestHandler);
router.delete('/:id', authenticate, authorize(['admin', 'news_manager']), deleteNewsItem as RequestHandler);
router.post('/publish', authenticate, authorize(['admin', 'news_manager']), publishMultiple as RequestHandler);

export default router;