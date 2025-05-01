import express from 'express';
import { exportEmployeesExcel, exportDepartmentsWord } from '../controllers/exportController';
import { authenticate } from '../middlewares/auth';
              
const router = express.Router();
              
router.get('/employees/excel', authenticate, exportEmployeesExcel);
router.get('/departments/word', authenticate, exportDepartmentsWord);
              
export default router;