import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Home from './pages/Home';
import News from './pages/News';
import Departments from './pages/Departments';
import Employees from './pages/Employees';
import Vacations from './pages/Vacations';
              
function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/news" element={<News />} />
        <Route path="/departments" element={<Departments />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/vacations" element={<Vacations />} />
      </Routes>
    </>
  );
}
              
export default App;