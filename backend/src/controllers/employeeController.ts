import { Request, Response } from 'express';
import { createEmployee, getEmployees } from '../models/employee';
              
export const addEmployee = async (req: Request, res: Response) => {
  const { full_name, position, email, phone, status, department_id } = req.body;
  try {
    const empId = await createEmployee({ full_name, position, email, phone, status, department_id });
    res.status(201).json({ id: empId, full_name, position, email, phone, status, department_id });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
              
export const getAllEmployees = async (req: Request, res: Response) => {
  const { department_id } = req.query;
  try {
    const employees = await getEmployees(department_id ? Number(department_id) : undefined);
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};