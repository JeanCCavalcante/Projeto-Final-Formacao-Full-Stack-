import { MAT_CARD_CONFIG } from '@angular/material/card';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

import { provideHttpClient } from '@angular/common/http';
import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgxPhosphorIconsModule } from 'ngx-phosphor-icons';
import { MaterialModule } from '../material-module';

import { App } from './app';
import { AppRoutingModule } from './app-routing-module';
import { Header } from './components/header/header';
import { Menu } from './components/menu/menu';
import { PageHeading } from './components/page-heading/page-heading';
import { SearchBox } from './components/search-box/search-box';
import { Sidebar } from './components/sidebar/sidebar';
import { Account } from './pages/account/account';
import { Customers } from './pages/customers/customers';
import { Integrations } from './pages/integrations/integrations';
import { BarChart } from './pages/overview/charts/bar-chart/bar-chart';
import { DonutChart } from './pages/overview/charts/donut-chart/donut-chart';
import { Overview } from './pages/overview/overview';
import { Settings } from './pages/settings/settings';
import { Data } from './shared/data';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';

@NgModule({
  declarations: [
    App,
    Menu,
    Header,
    Sidebar,
    Overview,
    Customers,
    Integrations,
    Settings,
    Account,
    SearchBox,
    PageHeading,
    BarChart,
    DonutChart,
    Login,
    Register,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    MaterialModule,
    NgApexchartsModule,
    NgxPhosphorIconsModule,
    ReactiveFormsModule,
    RouterOutlet,
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    Data,
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline', subscriptSizing: 'dynamic' },
    },
    { provide: MAT_CARD_CONFIG, useValue: { appearance: 'outlined' } },
  ],
  bootstrap: [App],
})
export class AppModule {}
