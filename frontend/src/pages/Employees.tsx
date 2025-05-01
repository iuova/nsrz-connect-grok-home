import { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Box, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { Employee } from '../types';
              
function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
              
  useEffect(() => {
    axios.get('http://localhost:5000/api/employees').then((res) => setEmployees(res.data));
  }, []);
              
  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4">Phone Directory</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((emp) => (
              <TableRow key={emp.id}>
                <TableCell>{emp.full_name}</TableCell>
                <TableCell>{emp.position}</TableCell>
                <TableCell>{emp.email}</TableCell>
                <TableCell>{emp.phone}</TableCell>
                <TableCell>{emp.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Container>
  );
}
              
export default Employees;