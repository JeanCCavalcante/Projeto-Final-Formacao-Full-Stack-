import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { Observable, Subscription } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';

import { CustomersInfo } from '../../models/users';
import { Login } from '../../auth/login/login';
import { AuthService } from '../../services/auth';
@Component({
  selector: 'app-customers',
  standalone: false,
  templateUrl: './customers.html',
  styleUrl: './customers.css',
})
export class Customers implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;

  customers$: Observable<CustomersInfo[]> | null = null;

  columns = [
    {
      columnDef: 'id',
      header: 'ID',
      cell: (element: CustomersInfo) => `${element.id}`,
    },
    {
      columnDef: 'name',
      header: 'Name',
      cell: (element: CustomersInfo) => `${element.firstName} ${element.lastName}`,
    },
    {
      columnDef: 'avatar',
      header: 'Avatar',
      cell: (element: CustomersInfo) => `${element.avatar}`,
    },
    {
      columnDef: 'email',
      header: 'Email',
      cell: (element: CustomersInfo) => `${element.email.toLowerCase()}`,
    },
    {
      columnDef: 'location',
      header: 'Location',
      cell: (element: CustomersInfo) =>
        `${element.location.city}, ${element.location.state}, ${element.location.country}`,
    },
    {
      columnDef: 'phone',
      header: 'Phone',
      cell: (element: CustomersInfo) => `${element.phone}`,
    },
    {
      columnDef: 'signedup',
      header: 'Signed Up',
      cell: (element: CustomersInfo) => `${element.createdAt}`,
    },
  ];

  dataSource: MatTableDataSource<CustomersInfo> = new MatTableDataSource<CustomersInfo>([]);
  selection = new SelectionModel<CustomersInfo>(true, []);
  private subscription: Subscription | null = null;

  displayedColumns: Array<string> = ['select'];
  headers: Array<string> = this.columns
    .map((column) => column.columnDef)
    .filter((header) => header !== 'id' && header !== 'avatar');

  constructor(private readonly authService: AuthService) {}

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

  checkboxLabel(row?: CustomersInfo): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  ngOnInit(): void {
    if (!this.customers$) return;
    this.subscription = this.customers$.subscribe((customers) => {
      this.dataSource.data = customers;
    });

    this.displayedColumns.push(...this.headers);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
