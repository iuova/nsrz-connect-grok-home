import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { Box, TextField, Button, Typography, Container, Paper } from '@mui/material';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      alert('Ошибка входа');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
        <Paper sx={{ p: 4, width: '100%', maxWidth: 400, borderRadius: 3 }}>
          <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 600 }}>
            НСРЗ Коннект
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Электронная почта"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
            />
            <TextField
              label="Пароль"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 2, py: 1.5, bgcolor: '#007aff', '&:hover': { bgcolor: '#005bb5' } }}
            >
              Войти
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}

export default Login;