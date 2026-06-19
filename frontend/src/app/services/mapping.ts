import { Injectable } from '@angular/core';

import { BackendUser, LoggedUser, UserProfileUpdate, UserRegistration } from '../models/users';
import { FormationEnum, TaskPriorityEnum, TaskStatusEnum } from '../enums/select-mapping';
import { Task, TaskCreate, TaskUpdate } from '../models/tasks';

@Injectable({
  providedIn: 'root',
})
export class MappingService {
  toUserModel(apiUser: BackendUser): LoggedUser {
    return {
      _id: apiUser._id,
      name: apiUser.name,
      email: apiUser.email,
      role: apiUser.papel,
      acessibilityFormation: apiUser.formacao_acessibilidade === FormationEnum.SIM,
      companyYears: apiUser.anos_empresa,
      department: apiUser.departamento,
      area: apiUser.area_atuacao,
    };
  }

  toApiFriendlyFormat(user: UserRegistration | UserProfileUpdate): any {
    const result: any = {};
    if (user.name !== undefined) result.name = user.name;
    if (user.email !== undefined) result.email = user.email;
    if (user.password !== undefined) result.password = user.password;
    if (user.role !== undefined) result.papel = user.role;
    if (user.acessibilityFormation !== undefined)
      result.formacao_acessibilidade = user.acessibilityFormation
        ? FormationEnum.SIM
        : FormationEnum.NAO;
    if (user.companyYears !== undefined) result.anos_empresa = user.companyYears;
    if (user.department !== undefined) result.departamento = user.department;
    if (user.area !== undefined) result.area_atuacao = user.area;
    return result;
  }

  toTask(backendTask: any): Task {
    return {
      _id: backendTask._id,
      title: backendTask.titulo,
      description: backendTask.descricao,
      priority: backendTask.prioridade as TaskPriorityEnum,
      status: backendTask.status_atual as TaskStatusEnum,
      mentorResponsible: backendTask.mentor_responsavel,
      menteeId: backendTask.mentorado,
      startDate: backendTask.data_inicio,
      completionDate: backendTask.data_conclusao,
      feedback: backendTask.feedback_conclusao_mentorado,
      userId: backendTask.user_id,
      createdAt: backendTask.createdAt,
      updatedAt: backendTask.updatedAt,
    };
  }

  toBackendTask(task: Partial<Task> | TaskCreate | TaskUpdate): any {
    const result: any = {};
    if (task.title !== undefined) result.titulo = task.title;
    if (task.description !== undefined) result.descricao = task.description;
    if (task.priority !== undefined) result.prioridade = task.priority;
    if (task.status !== undefined) result.status_atual = task.status;
    if (task.mentorResponsible !== undefined) result.mentor_responsavel = task.mentorResponsible;
    if (task.menteeId !== undefined) result.mentorado = task.menteeId;
    if (task.startDate !== undefined) result.data_inicio = task.startDate;
    if (task.completionDate !== undefined) result.data_conclusao = task.completionDate;
    if (task.feedback !== undefined) result.feedback_conclusao_mentorado = task.feedback;
    if ('userId' in task && task.userId !== undefined) {
      result.user_id = task.userId;
    }
    return result;
  }
}
