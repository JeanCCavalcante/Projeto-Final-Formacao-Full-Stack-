import { Injectable } from '@angular/core';
import { BackendUser, LoggedUser, UserProfileUpdate, UserRegistration } from '../models/users';
import { FormationEnum } from '../enums/select-mapping';

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
}
