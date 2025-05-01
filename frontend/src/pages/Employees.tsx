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
} from '@mui/material';
import { Employee } from '../types';

function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([]);

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
        link.setAttribute('download', 'employees.xlsx');
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

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Справочник телефонов
        </Typography>
        <Button variant="contained" onClick={handleExport} sx={{ mb: 2 }}>
          Экспорт в Excel
        </Button>
        <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ФИО</TableCell>
                <TableCell>Должность</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Телефон</TableCell>
                <TableCell>Статус</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((emp) => (
                <TableRow key={emp.id} hover>
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
      </Box>
    </Container>
  );
}

export default Employees;