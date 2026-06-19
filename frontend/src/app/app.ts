import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';

import { filter, Subject, takeUntil } from 'rxjs';

import { AuthService } from './services/auth';
import { RouteDataService } from './services/route-data';
import { AuthStateService } from './services/auth-state';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  private readonly authService = inject(AuthService);
  private readonly routeDataService = inject(RouteDataService);
  private readonly router = inject(Router);
  private readonly title = inject(Title);

  protected loggedUser = inject(AuthStateService).loggedUser;

  ngOnInit(): void {
    this.authService.init();
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$),
      )
      .subscribe((_) =>
        this.title.setTitle(`${this.routeDataService.get()['title']} Dashboard | Focus`),
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
