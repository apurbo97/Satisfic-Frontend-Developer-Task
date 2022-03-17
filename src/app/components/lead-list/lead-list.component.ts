import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ApiServiceService } from 'src/app/service/api-service.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { AddLeadComponent } from '../add-lead/add-lead.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SelectionModel } from '@angular/cdk/collections';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LeadDetailsComponent } from '../lead-details/lead-details.component';

export interface lead {
  title: string;
  firstName: number;
  lastName: number;
  email: string;
  id: string;
  assignee: string;
  leadStatus: string;
  phone: string;
}

@Component({
  selector: 'app-lead-list',
  templateUrl: './lead-list.component.html',
  styleUrls: ['./lead-list.component.scss'],
})
export class LeadListComponent implements OnInit {
  loading = false;
  tableData: any;
  filterValue: any;
  displayedColumns: string[] = [
    'select',
    'id',
    'title',
    'firstName',
    'lastName',
    'email',
    'assignee',
    'leadStatus',
    'phone',
    'action',
  ];

  statuss = ['New', 'Pending', 'Not Intrested', 'Complete'];
  ratings = ['1', '2', '3', '4', '5'];

  Lables = ['All', 'assignee', 'leadStatus'];

  form = new FormGroup({
    title: new FormControl('', [Validators.required]),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    assignee: new FormControl('', [Validators.required]),
    leadStatus: new FormControl('', [Validators.required]),
    leadSource: new FormControl('', [Validators.required]),
    leadRating: new FormControl('', [Validators.required]),
    phone: new FormControl('', [
      Validators.required,
      Validators.min(1000000000),
      Validators.max(9999999999),
    ]),
    companyName: new FormControl('', [Validators.required]),
    industry: new FormControl('', [Validators.required]),
    adressLine1: new FormControl('', [Validators.required]),
    adressLine2: new FormControl(''),
    city: new FormControl('', [Validators.required]),
    state: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
    zipcode: new FormControl('', [
      Validators.required,
      Validators.min(100000),
      Validators.max(999999),
    ]),
  });

  public dataSource = new MatTableDataSource<lead>();
  selection = new SelectionModel<lead>(true, []);
  user: any;

  @ViewChild(MatSort)
  sort: MatSort = new MatSort();
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  constructor(
    private apiService: ApiServiceService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.user = localStorage.getItem('user_details');
    if (this.user) {
      this.loadLeadList();
      this.user = JSON.parse(this.user);
    }
  }

  loadLeadList() {
    this.loading = true;
    this.apiService.getAllLeads().subscribe((data) => {
      if (data) {
        this.dataSource.data = data as lead[];
        this.dataSource.paginator = this.paginator;
        this.tableData = data;
        this.loading = false;
      }
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  filterByLable(value: string) {
    if (value === 'All') {
      const filterValue = '';
      this.dataSource.filter = filterValue.trim().toLowerCase();
      this.filterValue = [];
    } else
      this.filterValue = new Set(this.tableData.map((ele: any) => ele[value]));
  }

  filterByValue(value: string) {
    const filterValue = value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public addLead(): void {
    this.form.reset();
    const dialogRef = this.dialog.open(AddLeadComponent, {
      disableClose: true,
      width: '80%',
      data: { form: this.form, statuss: this.statuss, ratings: this.ratings },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result?.status) {
        this.loadLeadList();
        this.openSnackBar(result.status, 'Close');
      }
    });
  }

  viewLead(id: number, type: string): void {
    this.form.reset();
    const dialogRef = this.dialog.open(LeadDetailsComponent, {
      disableClose: true,
      width: '80%',
      data: {
        id: id,
        type: type,
        form: this.form,
        statuss: this.statuss,
        ratings: this.ratings,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result?.status) {
        this.loadLeadList();
        this.openSnackBar(result.status, 'Close');
      }
    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  deleteLead(id: number) {
    this.apiService.deleteLead(id.toString()).subscribe((res) => {
      if (res) {
        this.loadLeadList();
        this.openSnackBar('Lead Deleted.', 'Close');
      }
    });
  }

  bulkDelete() {
    this.selection.selected.forEach((element) => {
      this.deleteLead(parseInt(element.id));
    });
  }

  bulkModify(status: string) {
    this.apiService
      .updateBulkLead(this.selection.selected, { leadStatus: status })
      .subscribe(
        (res) => {
          if (res) {
            this.loadLeadList();
            this.openSnackBar('Lead Status Updated.', 'Close');
          }
        },
        (err) => {
          this.openSnackBar(err, 'Close');
        }
      );
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }
}
