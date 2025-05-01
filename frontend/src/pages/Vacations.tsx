import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Container, Typography, Box, List, ListItem, ListItemText } from '@mui/material';
import { AuthContext } from '../contexts/AuthContext';
import { Vacation } from '../types';
              
function Vacations() {
  const { user } = useContext(AuthContext);
  const [vacations, setVacations] = useState<Vacation[]>([]);
              
  useEffect(() => {
    if (user) {
      axios.get(`http://localhost:5000/api/vacations/${user.id}`).then((res) => setVacations(res.data));
    }
  }, [user]);
              
  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4">Vacation Information</Typography>
        <List>
          {vacations.map((vac) => (
            <ListItem key={vac.id}>
              <ListItemText
                primary={`Days: ${vac.total_days - vac.used_days} remaining`}
                secondary={`From ${vac.start_date} to ${vac.end_date}`}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
}
              
export default Vacations;