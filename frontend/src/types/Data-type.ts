export interface DataType {
  key?: React.Key;
  id?: number;
  name: string;
  surname: string;
  email: string;
  password?: string;
  phone: string;
  age: number;
  country: string;
  district: string;
  role: string;
  created_at?: string;
  updated_at?: string;
}
