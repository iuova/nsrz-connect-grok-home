import db from '../config/database';
              
export interface Employee {
  id?: number;
  full_name: string;
  position: string;
  email: string;
  phone: string;
  status: 'active' | 'vacation';
  department_id: number;
}
              
export const createEmployee = async (emp: Employee): Promise<number> => {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO employees (full_name, position, email, phone, status, department_id) VALUES (?, ?, ?, ?, ?, ?)',
      [emp.full_name, emp.position, emp.email, emp.phone, emp.status, emp.department_id],
      function (err) {
        if (err) reject(err);
        resolve(this.lastID);
      }
    );
  });
};
              
export const getEmployees = async (department_id?: number): Promise<Employee[]> => {
  return new Promise((resolve, reject) => {
    const query = department_id
      ? 'SELECT * FROM employees WHERE department_id = ?'
      : 'SELECT * FROM employees';
    db.all(query, department_id ? [department_id] : [], (err, rows: Employee[]) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};