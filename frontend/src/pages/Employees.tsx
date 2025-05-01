import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  TableContainer,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Employee } from '../types';

function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/employees').then((res) => setEmployees(res.data));
  }, []);

  const handleExport = () => {
    axios
      .get('http://localhost:5000/api/export/employees/excel', { responseType: 'blob' })
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'справочник_сотрудников.xlsx');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error('Ошибка при экспорте:', error);
        alert('Не удалось экспортировать данные');
      });
  };

  const handleRowClick = (employee: Employee) => {
    setSelectedEmployee(employee);
  };

  const handleCloseDialog = () => {
    setSelectedEmployee(null);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          Справочник телефонов
        </Typography>
        <Button
          variant="contained"
          onClick={handleExport}
          sx={{ mb: 3, bgcolor: '#007aff', '&:hover': { bgcolor: '#005bb5' } }}
        >
          Экспортировать в Excel
        </Button>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>ФИО</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Должность</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Телефон</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Статус</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((emp) => (
                <TableRow
                  key={emp.id}
                  hover
                  onClick={() => handleRowClick(emp)}
                  sx={{ cursor: 'pointer', transition: 'background-color 0.2s' }}
                >
                  <TableCell>{emp.full_name}</TableCell>
                  <TableCell>{emp.position}</TableCell>
                  <TableCell>{emp.email}</TableCell>
                  <TableCell>{emp.phone}</TableCell>
                  <TableCell>{emp.status === 'active' ? 'Активен' : 'В отпуске'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Dialog open={!!selectedEmployee} onClose={handleCloseDialog}>
          <DialogTitle>Карточка сотрудника</DialogTitle>
          <DialogContent>
            {selectedEmployee && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="body1">
                  <strong>ФИО:</strong> {selectedEmployee.full_name}
                </Typography>
                <Typography variant="body1">
                  <strong>Должность:</strong> {selectedEmployee.position}
                </Typography>
                <Typography variant="body1">
                  <strong>Email:</strong> {selectedEmployee.email}
                </Typography>
                <Typography variant="body1">
                  <strong>Телефон:</strong> {selectedEmployee.phone}
                </Typography>
                <Typography variant="body1">
                  <strong>Статус:</strong> {selectedEmployee.status === 'active' ? 'Активен' : 'В отпуске'}
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} variant="outlined">
              Закрыть
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}

export default Employees;