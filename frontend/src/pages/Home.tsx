import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Container, Typography, Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            Добро пожаловать, {user.email}
          </Typography>
          <Typography variant="body1">
            Это главная страница портала НСРЗ Коннект. Используйте навигационную панель для доступа к разделам.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}

export default Home;