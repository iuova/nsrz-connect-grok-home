import { Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Home from './pages/Home';
import News from './pages/News';
import Departments from './pages/Departments';
import Employees from './pages/Employees';
import Vacations from './pages/Vacations';
import Admin from './pages/Admin';
import theme from './styles/theme';

function App() {
  const location = useLocation();
  const hideNavbar = location.pathname === '/login';

  return (
    <ThemeProvider theme={theme}>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/news" element={<News />} />
        <Route path="/departments" element={<Departments />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/vacations" element={<Vacations />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;