import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-search-box',
  standalone: false,
  templateUrl: './search-box.html',
  styleUrl: './search-box.css',
})
export class SearchBox {
  @Input() placeholder: string = '';
}
