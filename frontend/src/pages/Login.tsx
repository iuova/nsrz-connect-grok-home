import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Button, Container, TextField, Typography } from '@mui/material';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/admin');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка входа');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Вход в НСРЗ Коннект
        </Typography>
        <TextField
          label="Электронная почта"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          InputLabelProps={{
            sx: {
              top: -2,
              fontSize: '0.875rem',
              '&.Mui-focused': { color: '#007aff' },
            },
          }}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '&:hover fieldset': { borderColor: '#007aff' },
              '&.Mui-focused fieldset': { borderColor: '#007aff' },
            },
          }}
        />
        <TextField
          label="Пароль"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputLabelProps={{
            sx: {
              top: -2,
              fontSize: '0.875rem',
              '&.Mui-focused': { color: '#007aff' },
            },
          }}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '&:hover fieldset': { borderColor: '#007aff' },
              '&.Mui-focused fieldset': { borderColor: '#007aff' },
            },
          }}
        />
        <Button
          variant="contained"
          fullWidth
          onClick={handleLogin}
          sx={{ bgcolor: '#007aff', '&:hover': { bgcolor: '#005bb5' }, borderRadius: 2 }}
        >
          Войти
        </Button>
      </Box>
    </Container>
  );
}

export default Login;