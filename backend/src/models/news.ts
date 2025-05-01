import db from '../config/database';

export interface News {
  id?: number;
  title: string;
  content: string;
  author_id: number;
  published: boolean;
  created_at?: string;
  author_email?: string;
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

export const getAllNews = async (): Promise<News[]> => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT n.*, u.email as author_email 
       FROM news n 
       JOIN users u ON n.author_id = u.id`,
      (err, rows) => {
        if (err) reject(err);
        resolve(rows as News[]);
      }
    );
  });
};

export const updateNews = async (id: number, news: Partial<News>): Promise<void> => {
  return new Promise((resolve, reject) => {
    const { title, content, published } = news;
    db.run(
      'UPDATE news SET title = ?, content = ?, published = ? WHERE id = ?',
      [title, content, published, id],
      (err) => {
        if (err) reject(err);
        resolve();
      }
    );
  });
};

export const deleteNews = async (id: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM news WHERE id = ?', [id], (err) => {
      if (err) reject(err);
      resolve();
    });
  });
};

export const publishMultipleNews = async (ids: number[]): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE news SET published = 1 WHERE id IN (${ids.map(() => '?').join(',')})`,
      ids,
      (err) => {
        if (err) reject(err);
        resolve();
      }
    );
  });
};