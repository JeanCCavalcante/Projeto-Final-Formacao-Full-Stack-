import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-page-heading',
  standalone: false,
  templateUrl: './page-heading.html',
})
export class PageHeading {
  @Input() pageTitle: string = '';
}
