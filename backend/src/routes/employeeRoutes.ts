import express from 'express';
import { addEmployee, getAllEmployees } from '../controllers/employeeController';
import { authenticate, authorize } from '../middlewares/auth';
              
const router = express.Router();
              
router.get('/', getAllEmployees);
router.post('/', authenticate, authorize(['admin']), addEmployee);
              
export default router;