import { Request, Response } from 'express';
import { createNews, getPublishedNews } from '../models/news';

export const addNews = async (req: Request, res: Response) => {
  const { title, content, published } = req.body;
  const author_id = (req as any).user.id;
  try {
    const newsId = await createNews({ title, content, author_id, published });
    res.status(201).json({ id: newsId, title, content, published });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
              
export const getNews = async (req: Request, res: Response) => {
  try {
    const news = await getPublishedNews();
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};