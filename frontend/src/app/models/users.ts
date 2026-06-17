import { AreaEnum, DepartmentEnum, RoleEnum } from '../enums/select-mapping';

export interface AuthLoginResponse {
  token: string;
  user: {
    user_id: string;
    name: string;
    email: string;
    papel: RoleEnum;
  };
}

export type DecodedUser = AuthLoginResponse & { _id: string; expiresIn: number };

export interface AuthRegisterResponse {
  message: string;
  user: {
    _id: number;
    name: string;
    email: string;
    papel: RoleEnum;
  };
}

export interface BackendUser {
  _id: string;
  name: string;
  email: string;
  papel: RoleEnum;
  formacao_acessibilidade: 'Sim' | 'Não';
  anos_empresa: number;
  departamento: DepartmentEnum;
  area_atuacao: AreaEnum;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoggedUser {
  _id: string;
  name: string;
  email: string;
  role: RoleEnum;
  acessibilityFormation: boolean;
  companyYears: number;
  department: DepartmentEnum;
  area: AreaEnum;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserRegistration {
  name: string;
  email: string;
  password: string;
  role: RoleEnum;
  acessibilityFormation: boolean;
  companyYears: number;
  department: DepartmentEnum;
  area: AreaEnum;
}

export type UserProfileUpdate = Partial<Omit<LoggedUser, '_id'>> & {
  password?: string;
};

export type UserFormType =
  | { type: 'login'; formValue: UserLogin }
  | { type: 'register'; formValue: UserRegistration }
  | { type: 'profile'; formValue: UserProfileUpdate };

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
