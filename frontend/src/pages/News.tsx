import { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Box } from '@mui/material';
import NewsCard from '../components/NewsCard';
import { News } from '../types';
              
function NewsPage() {
  const [news, setNews] = useState<News[]>([]);
              
  useEffect(() => {
    axios.get('http://localhost:5000/api/news').then((res) => setNews(res.data));
  }, []);
              
  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4">News</Typography>
        {news.map((item) => (
          <NewsCard key={item.id} news={item} />
        ))}
      </Box>
    </Container>
  );
}
              
export default NewsPage;