import { Request, Response, RequestHandler } from 'express';
import { createNews, getAllNews, updateNews, deleteNews, publishMultipleNews } from '../models/news';

export const getNews: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const news = await getAllNews();
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

export const addNews: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const { title, content, published } = req.body;
  if (!req.user) {
    res.status(401).json({ error: 'Пользователь не авторизован' });
    return;
  }
  const author_id = req.user.id;
  const author_email = req.user.email;
  try {
    const newsId = await createNews({ title, content, author_id: Number(author_id), published });
    if (newsId === undefined) {
      res.status(500).json({ error: 'Не удалось создать новость' });
      return;
    }
    const news = { id: newsId, title, content, author_id, published, author_email };
    res.status(201).json(news);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

export const updateNewsItem: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { title, content, published } = req.body;
  try {
    await updateNews(Number(id), { title, content, published });
    res.json({ message: 'Новость обновлена' });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

export const deleteNewsItem: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    await deleteNews(Number(id));
    res.json({ message: 'Новость удалена' });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

export const publishMultiple: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    res.status(400).json({ error: 'Не указаны ID новостей' });
    return;
  }
  try {
    await publishMultipleNews(ids);
    res.json({ message: 'Новости опубликованы' });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};