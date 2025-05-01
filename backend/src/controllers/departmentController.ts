import { Request, Response } from 'express';
import { createDepartment, getDepartments } from '../models/department';
              
export const addDepartment = async (req: Request, res: Response) => {
  const { name, parent_id } = req.body;
  try {
    const deptId = await createDepartment({ name, parent_id });
    res.status(201).json({ id: deptId, name, parent_id });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
              
export const getAllDepartments = async (req: Request, res: Response) => {
  try {
    const departments = await getDepartments();
    res.json(departments);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};