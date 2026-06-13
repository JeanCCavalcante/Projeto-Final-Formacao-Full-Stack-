import { Injectable } from '@angular/core';
import { UserRegister } from '../models/users';
import { FormationEnum } from '../enums/select-mapping';

@Injectable({
  providedIn: 'root',
})
export class MappingService {
  toUserModel(apiFriendlyUser: any): UserRegister {
    return {
      name: apiFriendlyUser.name,
      email: apiFriendlyUser.email,
      password: apiFriendlyUser.password || null,
      role: apiFriendlyUser.papel,
      acessibilityFormation: apiFriendlyUser.formacao_acessibilidade === FormationEnum.SIM,
      companyYears: apiFriendlyUser.anos_empresa,
      department: apiFriendlyUser.departamento,
      area: apiFriendlyUser.area_atuacao,
    };
  }

  toApiFriendlyFormat(user: UserRegister): any {
    return {
      name: user.name,
      email: user.email,
      password: user.password,
      papel: user.role,
      formacao_acessibilidade: user.acessibilityFormation ? FormationEnum.SIM : FormationEnum.NAO,
      anos_empresa: user.companyYears,
      departamento: user.department,
      area_atuacao: user.area,
    };
  }
}
