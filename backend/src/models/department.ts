import db from '../config/database';
              
export interface Department {
  id?: number;
  name: string;
  parent_id?: number;
}
              
export const createDepartment = async (dept: Department): Promise<number> => {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO departments (name, parent_id) VALUES (?, ?)',
      [dept.name, dept.parent_id],
      function (err) {
        if (err) reject(err);
        resolve(this.lastID);
      }
    );
  });
};
              
export const getDepartments = async (): Promise<Department[]> => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM departments', (err, rows: Department[]) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};