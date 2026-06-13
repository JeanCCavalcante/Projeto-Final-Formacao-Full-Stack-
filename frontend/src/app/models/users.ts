import { AreaEnum, DepartmentEnum, RoleEnum } from '../enums/select-mapping';

export interface AuthLoginResponse {
  token: string;
  user: {
    name: string;
    email: string;
    papel: RoleEnum;
  };
}

export interface AuthRegisterResponse {
  message: string;
  user: {
    _id: number;
    name: string;
    email: string;
    papel: RoleEnum;
  };
}

export interface UserRegister {
  name: string;
  email: string;
  password: string;
  role: RoleEnum;
  acessibilityFormation: boolean;
  area: AreaEnum;
  companyYears: number;
  department: DepartmentEnum;
}

export type UserInfo = AuthLoginResponse & { _id: string; expiresIn: number };

export interface Application {
  id: number;
  updatedAt: Date;
  name: string;
  icon: string;
  description: string;
  installs: number;
}

export interface CustomersInfo {
  id: number;
  createdAt: Date;
  firstName: string;
  lastName: string;
  avatar: string;
  email: string;
  location: { city: string; state: string; country: string };
  phone: string;
}

export interface OverviewInfo {
  budget: {
    current: number;
    lastMonth: number;
  };
  totalCustomers: {
    current: number;
    lastMonth: number;
  };
  taskProgress: number;
  totalProfit: number;
  trafficSource: {
    desktop: number;
    tablet: number;
    phone: number;
  };
}

export interface SalesInfo {
  currentYear: Array<number>;
  lastYear: Array<number>;
}

export interface LatestOrder {
  id: string;
  customer: string;
  orderDate: Date;
  status: string;
}

export interface LatestProduct {
  id: string;
  name: string;
  picture: string;
  updatedAt: Date;
}
