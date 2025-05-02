import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  TextField,
  Grid,
  Card,
  CardContent,
  Pagination,
} from '@mui/material';
import { News as NewsType } from '../types';

function News() {
  const [news, setNews] = useState<NewsType[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchNews();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchNews = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/news', { headers: getAuthHeaders() });
      const sortedNews = res.data.sort(
        (a: NewsType, b: NewsType) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setNews(sortedNews);
    } catch (error) {
      console.error('Ошибка загрузки новостей:', error);
    }
  };

  const filteredNews = useMemo(() => {
    let result = news.filter((item) => item.published);
    if (search) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(
        (item) => item.title.toLowerCase().includes(lowerSearch) || item.content.toLowerCase().includes(lowerSearch)
      );
    }
    return result;
  }, [news, search]);

  const paginatedNews = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredNews.slice(start, end);
  }, [filteredNews, page]);

  const pageCount = Math.ceil(filteredNews.length / itemsPerPage);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          Новости
        </Typography>
        <Box sx={{ mb: 3 }}>
          <TextField
            placeholder="Поиск по новостям"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            fullWidth
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': { borderColor: '#007aff' },
                '&.Mui-focused fieldset': { borderColor: '#007aff' },
              },
            }}
          />
        </Box>
        <Grid container spacing={3}>
          {paginatedNews.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 2,
                  boxShadow: 3,
                  '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-2px)',
                    transition: 'all 0.2s ease-in-out',
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 500 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    {formatDate(item.created_at)}
                  </Typography>
                  <Typography variant="body1">{item.content}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        {pageCount > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination
              count={pageCount}
              page={page}
              onChange={(_e, value) => setPage(value)}
              color="primary"
              sx={{
                '& .MuiPaginationItem-root': {
                  color: '#007aff',
                  '&.Mui-selected': {
                    bgcolor: '#007aff',
                    color: '#fff',
                    '&:hover': { bgcolor: '#005bb5' },
                  },
                  '&:hover': { bgcolor: 'rgba(0, 122, 255, 0.1)' },
                },
              }}
            />
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default News;