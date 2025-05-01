import db from '../config/database';
              
export interface News {
  id?: number;
  title: string;
  content: string;
  author_id: number;
  published: boolean;
}
              
export const createNews = async (news: News): Promise<number> => {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO news (title, content, author_id, published) VALUES (?, ?, ?, ?)',
      [news.title, news.content, news.author_id, news.published],
      function (err) {
        if (err) reject(err);
        resolve(this.lastID);
      }
    );
  });
};
              
export const getPublishedNews = async (limit: number = 5): Promise<News[]> => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM news WHERE published = 1 ORDER BY created_at DESC LIMIT ?', [limit], (err, rows: News[]) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};