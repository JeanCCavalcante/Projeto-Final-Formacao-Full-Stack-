import { inject, Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Data } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RouteDataService {
  private readonly route = inject(ActivatedRoute);

  get(): Data {
    return this.getRouteSnapshot().data;
  }

  private getRouteSnapshot(): ActivatedRouteSnapshot {
    let route = this.route;

    while (route.firstChild) {
      route = route.firstChild;
    }

    return route.snapshot;
  }
}
