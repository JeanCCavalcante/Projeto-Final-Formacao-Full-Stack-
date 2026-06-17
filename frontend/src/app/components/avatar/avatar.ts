import { Component, input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  standalone: false,
  templateUrl: './avatar.html',
  styleUrl: './avatar.css',
})
export class Avatar {
  loggedUserName = input<string>();
  avatarSize = input<number>(40);
}
