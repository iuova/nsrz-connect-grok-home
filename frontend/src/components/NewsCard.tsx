import { Card, CardContent, Typography } from '@mui/material';
import { News } from '../types';
              
interface NewsCardProps {
  news: News;
}
              
function NewsCard({ news }: NewsCardProps) {
  return (
    <Card sx={{ mb: 2, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6">{news.title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {news.content}
        </Typography>
      </CardContent>
    </Card>
  );
}
              
export default NewsCard;