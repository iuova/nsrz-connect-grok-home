import { Request, Response } from 'express';
import XLSX from 'xlsx';
import { Document, Packer, Paragraph } from 'docx';
import { getEmployees } from '../models/employee';
import { getDepartments } from '../models/department';
              
export const exportEmployeesExcel = async (req: Request, res: Response) => {
  try {
    const employees = await getEmployees();
    const worksheet = XLSX.utils.json_to_sheet(employees);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Employees');
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    res.setHeader('Content-Disposition', 'attachment; filename=employees.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
              
export const exportDepartmentsWord = async (req: Request, res: Response) => {
  try {
    const departments = await getDepartments();
    const doc = new Document({
      sections: [{
        children: departments.map((dept) => new Paragraph(`Department: ${dept.name}`)),
      }],
    });
    const buffer = await Packer.toBuffer(doc);
    res.setHeader('Content-Disposition', 'attachment; filename=departments.docx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};