import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#007aff', // Голубой акцент, как в iOS
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ff2d55', // Мягкий красный для акцентов
    },
    background: {
      default: '#f5f5f7', // Светло-серый фон, как в macOS
      paper: '#ffffff', // Белый для карточек и поверхностей
    },
    text: {
      primary: '#1d1d1f', // Тёмный текст для читаемости
      secondary: '#6e6e73', // Серый для второстепенного текста
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      color: '#1d1d1f',
    },
    body1: {
      color: '#1d1d1f',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10, // Закруглённые углы, как в iOS
          textTransform: 'none', // Без верхнего регистра
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)', // Мягкая тень
          transition: 'all 0.2s ease-in-out', // Плавные переходы
          '&:hover': {
            boxShadow: '0 3px 6px rgba(0,0,0,0.15)', // Усиленная тень при наведении
            transform: 'translateY(-1px)', // Лёгкий подъём
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12, // Закруглённые углы для карточек
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)', // Мягкая тень
          transition: 'box-shadow 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)', // Усиленная тень
          },
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff', // Белый фон для панели навигации
          color: '#1d1d1f',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

export default theme;