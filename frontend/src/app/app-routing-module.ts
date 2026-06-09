import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Overview } from './pages/overview/overview';
import { Customers } from './pages/customers/customers';
import { Integrations } from './pages/integrations/integrations';
import { Settings } from './pages/settings/settings';
import { Account } from './pages/account/account';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';

const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'overview',
  },
  {
    path: 'overview',
    component: Overview,
  },
  {
    path: 'customers',
    component: Customers,
  },
  {
    path: 'integrations',
    component: Integrations,
  },
  {
    path: 'settings',
    component: Settings,
  },
  {
    path: 'account',
    component: Account,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
