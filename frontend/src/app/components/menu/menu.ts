import { Component, inject, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { AuthStateService } from '../../services/auth-state';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-menu',
  standalone: false,
  templateUrl: './menu.html',
  styleUrls: ['./menu.css'],
})
export class Menu {
  private readonly authService = inject(AuthService);
  protected loggedUser = inject(AuthStateService).loggedUser;

  @ViewChild(MatMenuTrigger) toolbarMenuTrigger: MatMenuTrigger = new MatMenuTrigger();

  openToolbarMenu(): void {
    this.toolbarMenuTrigger.openMenu();
  }

  signOut(): void {
    if (confirm('Tem certeza que deseja sair?')) {
      this.authService.logout();
    }
  }
}
