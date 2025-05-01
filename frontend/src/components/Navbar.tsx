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
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          NSRZ Connect
        </Typography>
        {user && (
          <>
            <Button color="inherit" component={Link} to="/">
              Home
            </Button>
            <Button color="inherit" component={Link} to="/news">
              News
            </Button>
            <Button color="inherit" component={Link} to="/departments">
              Structure
            </Button>
            <Button color="inherit" component={Link} to="/employees">
              Directory
            </Button>
            <Button color="inherit" component={Link} to="/vacations">
              Vacations
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
              
export default Navbar;