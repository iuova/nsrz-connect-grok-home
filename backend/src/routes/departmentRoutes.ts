import express from 'express';
import { addDepartment, getAllDepartments } from '../controllers/departmentController';
import { authenticate, authorize } from '../middlewares/auth';
              
const router = express.Router();
              
router.get('/', getAllDepartments);
router.post('/', authenticate, authorize(['admin']), addDepartment);
              
export default router;