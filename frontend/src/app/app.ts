import { BreakpointObserver } from '@angular/cdk/layout';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

import { Login } from './auth/login/login';
import { AuthService } from './services/auth';
import { AuthStateService } from './services/auth-state';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.html',
})
export class App implements OnInit, AfterViewInit {
  @ViewChild(MatSidenav)
  sidenav: MatSidenav | null = null;

  constructor(
    private readonly observer: BreakpointObserver,
    private readonly authService: AuthService,
    private readonly authStateService: AuthStateService
  ) {}

  ngOnInit() {
    /*     if (!this.authStateService.isLoggedIn()) {
      this.authService.openAuthModal(Login);
    } */
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
