import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MtxGridColumn } from '@ng-matero/extensions';
import { DataService } from '@shared/services/data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {

  public myRoles: string[] = [];
  public pageIndex: number = 1;
  public pageSize: number = 10;
  public pageDisplay: number = 10;
  public totalRow: number;
  public filter: string = '';
  public users: any[];

      constructor(private cdr: ChangeDetectorRef, private toast : ToastrService,
        private _dataService : DataService ) {}
  EXAMPLE_DATA: any[] = [
    {
      position: 1,
      name: 'Boron',
      tag: [
        {
          color: 'red',
          value: [1, 2],
        },
      ],
      weight: 10.811,
      symbol: 'B',
      gender: 'male',
      mobile: '13198765432',
      tele: '567891234',
      city: 'Berlin',
      address: 'Bernauer Str.111,13355',
      date: '1423456765768',
      website: 'www.matero.com',
      company: 'matero',
      email: 'Boron@gmail.com',
      status: false,
      cost: 4
    },
    {
      position: 2,
      name: 'Helium',
      tag: [
        {
          color: 'blue',
          value: [3, 4],
        },
      ],
      weight: 8.0026,
      symbol: 'He',
      gender: 'female',
      mobile: '13034676675',
      tele: '80675432',
      city: 'Shanghai',
      address: '88 Songshan Road',
      date: '1423456765768',
      website: 'www.matero.com',
      company: 'matero',
      email: 'Helium@gmail.com',
      status: true,
      cost: 5
    },
    {
      position: 3,
      name: 'Nitrogen',
      tag: [
        {
          color: 'yellow',
          value: [5, 6],
        },
      ],
      weight: 14.0067,
      symbol: 'N',
      gender: 'male',
      mobile: '15811112222',
      tele: '345678912',
      city: 'Sydney',
      address: 'Circular Quay, Sydney NSW 2000',
      date: '1423456765768',
      website: 'www.matero.com',
      company: 'matero',
      email: 'Nitrogen@gmail.com',
      status: true,
      cost: 2
    },
  ];
  ngOnInit() {this.loadData();}

  columns: MtxGridColumn[] = [
    { header: 'Tên đăng nhập', field: 'UserName', sortable: true },
    { header: 'Họ tên', field: 'FullName', sortable: true },
    { header: 'Ngày sinh', field: 'BirthDay', sortable: true },
    {
      header: '',
      field: 'operation',
      width: '160px',
      pinned: 'right',
      right: '0px',
      type: 'button',
      buttons: [
        {
          type: 'icon',
          text: 'copy',
          icon: 'file_copy',
          tooltip: 'copy',
          disabled: true,
          click: () => {
            alert('copy');
          },
        },
        {
          type: 'icon',
          text: 'edit',
          icon: 'edit',
          tooltip: 'Edit',
          click: () => {
            alert('edit');
          },
        },
        {
          type: 'icon',
          text: 'delete',
          icon: 'delete',
          tooltip: 'Delete',
          color: 'warn',
          pop: true,
          popTitle: 'Confirm delete?',
          click: () => {
            alert('delete');
          },
        },
      ],
    },
  ];

  loadData() {
    this._dataService.get('/api/appUser/getlistpaging?page=' + this.pageIndex + '&pageSize=' + this.pageSize + '&filter=' + this.filter)
      .subscribe((response: any) => {
        this.users = response.Items;
        this.pageIndex = response.PageIndex;
        this.pageSize = response.PageSize;
        this.totalRow = response.TotalRows;
      });
      console.log(this.users);
  }
}
