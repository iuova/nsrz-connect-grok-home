import { Request, Response } from 'express';
import { createVacation, getVacations } from '../models/vacation';
              
export const addVacation = async (req: Request, res: Response) => {
  const { employee_id, total_days, used_days, start_date, end_date } = req.body;
  try {
    const vacId = await createVacation({ employee_id, total_days, used_days, start_date, end_date });
    res.status(201).json({ id: vacId, employee_id, total_days, used_days, start_date, end_date });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
              
export const getEmployeeVacations = async (req: Request, res: Response) => {
  const { employee_id } = req.params;
  try {
    const vacations = await getVacations(Number(employee_id));
    res.json(vacations);
  } catch (error) { // Исправлено с of(error) на catch(error)
    res.status(500).json({ error: 'Server error' });
  }
};