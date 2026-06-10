import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SubscriptSizing } from '@angular/material/form-field';
import { Observable } from 'rxjs';

import { UserInfo, Data } from '../../shared/data';
import { UsersService } from '../../services/auth';

@Component({
  selector: 'app-account',
  standalone: false,
  templateUrl: './account.html',
  styleUrl: './account.css',
})
export class Account implements OnInit {
  accountForm!: FormGroup;

  floatLabel = new FormControl('auto');
  subscriptSizing: SubscriptSizing | null = null;

  userId: number = 0;
  loggedAccount$: Observable<UserInfo> | null = null;

  states: Array<string> = [];
  selectedValue: string = '';

  constructor(
    private readonly data: Data,
    private readonly usersService: UsersService,
    private readonly formBuilder: FormBuilder,
  ) {
    this.userId = this.data.id;
  }

  ngOnInit(): void {
    this.loggedAccount$ = this.usersService.fetchLoggedUser(this.userId);
    this.states = this.data.states;
  }
}
