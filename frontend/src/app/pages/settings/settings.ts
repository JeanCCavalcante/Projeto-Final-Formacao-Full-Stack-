import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Data, NotificationSetting } from '../../shared/data';
import { UsersService } from '../../services/users';

@Component({
  selector: 'app-settings',
  standalone: false,
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings implements OnInit {
  userId: number = 0;

  notificationSettings$: Observable<NotificationSetting> | null = null;

  constructor(
    private readonly data: Data,
    private readonly usersService: UsersService,
  ) {
    this.userId = this.data.id;
  }

  ngOnInit(): void {
    this.notificationSettings$ = this.usersService.fetchNotificationSettings(this.userId);
  }
}
