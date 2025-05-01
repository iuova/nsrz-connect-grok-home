import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
          НСРЗ Коннект
        </Typography>
        {user ? (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button color="inherit" component={Link} to="/">
              Главная
            </Button>
            <Button color="inherit" component={Link} to="/news">
              Новости
            </Button>
            <Button color="inherit" component={Link} to="/departments">
              Структура
            </Button>
            <Button color="inherit" component={Link} to="/employees">
              Справочник
            </Button>
            <Button color="inherit" component={Link} to="/vacations">
              Отпуска
            </Button>
            {(user.role === 'admin' || user.role === 'news_manager') && (
              <Button color="inherit" component={Link} to="/admin">
                Администрирование
              </Button>
            )}
            <Button color="inherit" onClick={handleLogout}>
              Выйти
            </Button>
          </Box>
        ) : (
          <Button color="inherit" component={Link} to="/login">
            Войти
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;