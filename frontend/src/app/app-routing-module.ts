import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { App } from './app';
import { Account } from './pages/account/account';
import { Customers } from './pages/customers/customers';
import { Integrations } from './pages/integrations/integrations';
import { Overview } from './pages/overview/overview';
import { Settings } from './pages/settings/settings';
import { AuthGuardService } from './services/auth-guard';

const routes: Routes = [
  {
    path: '',
    component: App,
    data: {
      title: '[SLOGAN]',
    },
  },
  {
    path: 'overview',
    component: Overview,
    canActivate: [AuthGuardService],
    data: {
      title: 'Métricas',
    },
  },
  {
    path: 'customers',
    component: Customers,
    canActivate: [AuthGuardService],
    data: {
      title: 'Mentorados',
    },
  },
  {
    path: 'integrations',
    component: Integrations,
    canActivate: [AuthGuardService],
    data: {
      title: 'Tarefas',
    },
  },
  {
    path: 'settings',
    component: Settings,
    canActivate: [AuthGuardService],
    data: {
      title: 'Configurações',
    },
  },
  {
    path: 'account',
    component: Account,
    canActivate: [AuthGuardService],
    data: {
      title: 'Minha Conta',
    },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
