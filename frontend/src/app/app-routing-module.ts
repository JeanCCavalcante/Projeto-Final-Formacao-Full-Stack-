import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { authGuard } from './guards/auth-guard';
import { Account } from './routes/account/account';
import { Analytics } from './routes/analytics/analytics';
import { TasksList } from './routes/tasks-list/tasks-list';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'analytics',
    pathMatch: 'full',
  },
  {
    path: 'analytics',
    component: Analytics,
    canActivate: [authGuard],
    data: {
      title: 'Métricas | ',
    },
  },
  {
    path: 'tasks',
    component: TasksList,
    canActivate: [authGuard],
    data: {
      title: 'Tarefas |',
    },
  },
  {
    path: 'account',
    component: Account,
    canActivate: [authGuard],
    data: {
      title: 'Perfil |',
    },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
