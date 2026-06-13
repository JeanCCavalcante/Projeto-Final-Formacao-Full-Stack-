import { Component, inject, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { AuthStateService } from '../../services/auth-state';

@Component({
  selector: 'app-menu',
  standalone: false,
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {
  protected loggedUser = inject(AuthStateService).loggedUser;

  @ViewChild(MatMenuTrigger) menuTrigger: MatMenuTrigger = new MatMenuTrigger();

  constructor(private readonly authStateService: AuthStateService) {}

  onClickingAvatar() {
    this.menuTrigger.openMenu();
  }
}
