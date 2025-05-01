export interface User {
  id: number;
  email: string;
  role: 'employee' | 'admin' | 'news_manager';
}
              
export interface News {
  id: number;
  title: string;
  content: string;
  author_id: number;
  published: boolean;
  created_at: string;
}
              
export interface Department {
  id: number;
  name: string;
  parent_id?: number;
}
              
export interface Employee {
  id: number;
  full_name: string;
  position: string;
  email: string;
  phone: string;
  status: 'active' | 'vacation';
  department_id: number;
}
              
export interface Vacation {
  id: number;
  employee_id: number;
  total_days: number;
  used_days: number;
  start_date: string;
  end_date: string;
}