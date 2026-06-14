import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { forkJoin, map, Observable, Subject, takeUntil } from 'rxjs';

import { Application } from '../../models/users';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-integrations',
  standalone: false,
  templateUrl: './integrations.html',
  styleUrl: './integrations.css',
})
export class Integrations implements OnDestroy, AfterViewInit {
  private readonly destroy$ = new Subject<void>();
  integrations$: Observable<Application[]> | null = null;

  userId: number = 0;
  userApplications: Array<number> = [];
  dataSource: MatTableDataSource<Application> = new MatTableDataSource<Application>([]);

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;

  constructor(private readonly authService: AuthService) {}

  /*   ngOnInit(): void {
    forkJoin([
      this.integrationsService.fetchIntegrations(),
      this.integrationsService.fetchIntegrationsByUser(this.userId),
    ])
      .pipe(
        map(([integrations, ids]) => {
          this.userApplications = ids;
          this.dataSource.data = integrations.filter((integration) =>
            ids.includes(+integration.id)
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
    this.integrations$ = this.dataSource.connect();
  } */

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
