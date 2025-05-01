import db from '../config/database';
              
export interface Vacation {
  id?: number;
  employee_id: number;
  total_days: number;
  used_days: number;
  start_date: string;
  end_date: string;
}
              
export const createVacation = async (vac: Vacation): Promise<number> => {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO vacations (employee_id, total_days, used_days, start_date, end_date) VALUES (?, ?, ?, ?, ?)',
      [vac.employee_id, vac.total_days, vac.used_days, vac.start_date, vac.end_date],
      function (err) {
        if (err) reject(err);
        resolve(this.lastID);
      }
    );
  });
};
              
export const getVacations = async (employee_id: number): Promise<Vacation[]> => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM vacations WHERE employee_id = ?', [employee_id], (err, rows: Vacation[]) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};