import {
  RoleEnum,
  DepartmentEnum,
  AreaEnum,
  TaskPriorityEnum,
  TaskStatusEnum,
} from '../enums/select-mapping';

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
  { label: 'Back-End', value: AreaEnum.DEV_BACK_END },
  { label: 'QA', value: AreaEnum.QA },
  { label: 'Produto', value: AreaEnum.PRODUTO },
  { label: 'UX/UI Designer', value: AreaEnum.UX_UI_DESIGNER },
  { label: 'Data Engineer', value: AreaEnum.DATA_ENGINEER },
  { label: 'Front-End', value: AreaEnum.DEV_FRONT_END },
  { label: 'Mobile', value: AreaEnum.DEV_MOBILE },
];

export const TaskPriorityOptions: SelectOption<TaskPriorityEnum>[] = [
  { label: 'Baixa', value: TaskPriorityEnum.BAIXA },
  { label: 'Média', value: TaskPriorityEnum.MEDIA },
  { label: 'Alta', value: TaskPriorityEnum.ALTA },
];

export const TaskStatusOptions: SelectOption<TaskStatusEnum>[] = [
  { label: 'Pendente', value: TaskStatusEnum.PENDENTE },
  { label: 'Em andamento', value: TaskStatusEnum.ANDAMENTO },
  { label: 'Concluída', value: TaskStatusEnum.CONCLUIDA },
];
