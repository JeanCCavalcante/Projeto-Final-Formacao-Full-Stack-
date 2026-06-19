import { TaskPriorityEnum, TaskStatusEnum } from '../enums/select-mapping';

export interface Task {
  _id: string;
  title: string;
  description: string;
  priority: TaskPriorityEnum;
  status: TaskStatusEnum;
  mentorResponsible: string;
  menteeId?: string;
  startDate?: Date | string;
  completionDate?: Date | string;
  feedback?: string;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}

export type TaskCreate = Omit<Task, '_id' | 'createdAt' | 'updatedAt'>;

export type TaskUpdate = Partial<Omit<Task, '_id' | 'createdAt' | 'updatedAt' | 'userId'>>;
