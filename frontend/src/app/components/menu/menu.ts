import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Observable } from 'rxjs';

import { Data, UserInfo } from '../../shared/data';
import { UsersService } from '../../services/users';

@Component({
  selector: 'app-menu',
  standalone: false,
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu implements OnInit {
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger = new MatMenuTrigger();

  userId: number = 0;
  loggedAccount$: Observable<UserInfo> | null = null;

  constructor(
    private readonly data: Data,
    private readonly usersService: UsersService,
  ) {
    this.userId = this.data.id;
  }

  onClickingAvatar() {
    this.trigger.openMenu();
  }

  ngOnInit(): void {
    this.loggedAccount$ = this.usersService.fetchLoggedUser(this.userId);
  }
}
