import { BreakpointObserver } from '@angular/cdk/layout';
import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

import { AuthService } from './services/auth';
import { AuthStateService } from './services/auth-state';
import { RouteDataService } from './services/route-data';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.html',
})
export class App implements OnInit, AfterViewInit {
  protected loggedIn = inject(AuthStateService).isLoggedIn;

  @ViewChild(MatSidenav)
  sidenav: MatSidenav | null = null;

  constructor(
    private readonly authService: AuthService,
    private readonly observer: BreakpointObserver,
    private readonly router: Router,
    private readonly routeDataService: RouteDataService,
    private readonly title: Title
  ) {}

  ngOnInit(): void {
    this.authService.init();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((_) => this.title.setTitle(`Focus | ${this.routeDataService.get()['title']}`));
  }

  ngAfterViewInit() {
    this.observer.observe(['(max-width: 800px)']).subscribe((res) => {
      if (res.matches && this.sidenav) {
        this.sidenav.mode = 'over';
        this.sidenav.close();
      } else if (this.sidenav) {
        this.sidenav.mode = 'side';
        this.sidenav.open();
      }
    });
  }
}
