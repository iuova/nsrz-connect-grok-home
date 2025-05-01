import { Card, CardContent, Typography } from '@mui/material';
import { News } from '../types';

interface NewsCardProps {
  news: News;
}

function NewsCard({ news }: NewsCardProps) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          {news.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {news.content}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default NewsCard;