import { BreakpointObserver } from '@angular/cdk/layout';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.html',
})
export class App implements AfterViewInit {
  @ViewChild(MatSidenav)
  sidenav: MatSidenav | null = null;

  constructor(private readonly observer: BreakpointObserver) {}

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
