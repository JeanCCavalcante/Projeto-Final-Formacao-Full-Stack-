import { RoleEnum, DepartmentEnum, AreaEnum } from '../enums/user';

export interface SelectOption<T = string> {
  label: string;
  value: T;
}

export const RoleOptions: SelectOption<RoleEnum>[] = [
  { label: 'Mentorado', value: RoleEnum.MENTORADO },
  { label: 'Mentor', value: RoleEnum.MENTOR },
];

export const DepartmentOptions: SelectOption<DepartmentEnum>[] = [
  { label: 'Tecnologia', value: DepartmentEnum.TECNOLOGIA },
  { label: 'Produto', value: DepartmentEnum.PRODUTO },
  { label: 'Marketing', value: DepartmentEnum.MARKETING },
  { label: 'Pessoas e Cultura', value: DepartmentEnum.PESSOAS_CULTURA },
];

export const AreaOptions: SelectOption<AreaEnum>[] = [
  { label: 'Desenvolvedor Back-end', value: AreaEnum.DEV_BACK_END },
  { label: 'QA', value: AreaEnum.QA },
  { label: 'Produto', value: AreaEnum.PRODUTO },
  { label: 'UX/UI Designer', value: AreaEnum.UX_UI_DESIGNER },
  { label: 'Data Engineer', value: AreaEnum.DATA_ENGINEER },
  { label: 'Desenvolvedor Front-end', value: AreaEnum.DEV_FRONT_END },
  { label: 'Desenvolvedor Mobile', value: AreaEnum.DEV_MOBILE },
];
