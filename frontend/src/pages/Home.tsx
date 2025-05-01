import { useContext, useEffect } from 'react'; // Добавлен импорт useEffect
import { AuthContext } from '../contexts/AuthContext';
import { Container, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4">Welcome, {user.email}</Typography>
        <Typography variant="body1">This is the NSRZ Connect homepage.</Typography>
      </Box>
    </Container>
  );
}

export default Home;