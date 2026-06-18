import { MAT_CARD_CONFIG } from '@angular/material/card';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { NgApexchartsModule } from 'ng-apexcharts';
import { AvatarModule } from 'ngx-avatars';
import { NgxPhosphorIconsModule } from 'ngx-phosphor-icons';

import { MaterialModule } from '../material-module';
import { App } from './app';
import { AppRoutingModule } from './app-routing-module';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { Avatar } from './components/avatar/avatar';
import { TaskForm } from './components/forms/task-form/task-form';
import { UserForm } from './components/forms/user-form/user-form';
import { Logo } from './components/logo/logo';
import { Menu } from './components/menu/menu';
import { authInterceptor } from './interceptors/auth-interceptor';
import { Account } from './routes/account/account';
import { Analytics } from './routes/analytics/analytics';
import { AnalyticsContent } from './routes/analytics/analytics-content/analytics-content';
import { EffortChart } from './routes/analytics/charts/effort-chart/effort-chart';
import { RhythmChart } from './routes/analytics/charts/rhythm-chart/rhythm-chart';
import { TasksList } from './routes/tasks-list/tasks-list';

@NgModule({
  declarations: [
    Account,
    App,
    Avatar,
    Analytics,
    AnalyticsContent,
    EffortChart,
    Login,
    Logo,
    Menu,
    Register,
    RhythmChart,
    TaskForm,
    TasksList,
    UserForm,
  ],
  imports: [
    AppRoutingModule,
    AvatarModule,
    BrowserModule,
    FormsModule,
    MaterialModule,
    NgApexchartsModule,
    NgxPhosphorIconsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([authInterceptor])),
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline', subscriptSizing: 'dynamic' },
    },
    { provide: MAT_CARD_CONFIG, useValue: { appearance: 'outlined' } },
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
  ],
  bootstrap: [App],
})
export class AppModule {}
