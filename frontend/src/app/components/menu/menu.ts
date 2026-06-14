import { Component, inject, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { AuthStateService } from '../../services/auth-state';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-menu',
  standalone: false,
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {
  protected loggedUser = inject(AuthStateService).loggedUser;

  @ViewChild(MatMenuTrigger) menuTrigger: MatMenuTrigger = new MatMenuTrigger();

  constructor(private readonly authService: AuthService) {}

  openMenu(): void {
    this.menuTrigger.openMenu();
  }

  signOut(): void {
    this.authService.logout();
  }
}
