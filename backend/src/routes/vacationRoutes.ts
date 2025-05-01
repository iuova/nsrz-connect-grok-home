import express from 'express';
import { addVacation, getEmployeeVacations } from '../controllers/vacationController';
import { authenticate } from '../middlewares/auth';
              
const router = express.Router();
              
router.get('/:employee_id', authenticate, getEmployeeVacations);
router.post('/', authenticate, addVacation);
              
export default router;