import { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Box, List, ListItem, ListItemText } from '@mui/material';
import { Department } from '../types';
              
function Departments() {
  const [departments, setDepartments] = useState<Department[]>([]);
              
  useEffect(() => {
    axios.get('http://localhost:5000/api/departments').then((res) => setDepartments(res.data));
  }, []);
              
  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4">Organizational Structure</Typography>
        <List>
          {departments.map((dept) => (
            <ListItem key={dept.id}>
              <ListItemText primary={dept.name} secondary={`Parent ID: ${dept.parent_id || 'None'}`} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
}
              
export default Departments;