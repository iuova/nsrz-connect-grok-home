import { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Box, Card, CardContent, Divider } from '@mui/material';
import { News } from '../types';

function NewsPage() {
  const [news, setNews] = useState<News[]>([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/news').then((res) => setNews(res.data));
  }, []);

  // Форматирование даты в читаемый вид (например, "1 мая 2025")
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          Новости
        </Typography>
        {news.length === 0 ? (
          <Typography variant="body1">Нет доступных новостей</Typography>
        ) : (
          news.map((item) => (
            <Card key={item.id} sx={{ mb: 2, borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
                  {item.content}
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="caption" color="text.secondary">
                  Опубликовано: {formatDate(item.created_at)}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                  Автор: {item.author_email}
                </Typography>
              </CardContent>
            </Card>
          ))
        )}
      </Box>
    </Container>
  );
}

export default NewsPage;