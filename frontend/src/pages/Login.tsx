import { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Container, TextField, Button, Typography, Box, Paper } from '@mui/material';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Ошибка входа');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
        <Paper sx={{ p: 4, width: '100%', maxWidth: 400, borderRadius: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, textAlign: 'center' }}>
            Вход в НСРЗ Коннект
          </Typography>
          {error && (
            <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
              {error}
            </Typography>
          )}
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Пароль"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 2, bgcolor: '#007aff', '&:hover': { bgcolor: '#005bb5' } }}
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