import { Component, OnInit } from '@angular/core';
import {AbstractComponent} from '../../shared/abstract-component';
import {Employee} from '../../entities/employee';
import {Observable} from 'rxjs';
import {FormControl, FormGroup} from '@angular/forms';
import {ChartDataSets, ChartOptions, ChartType} from 'chart.js';
import {Color, Label} from 'ng2-charts';
import {ConsumeitemDataPage} from '../../entities/consumeitem';
import {ReportService} from '../../services/report.service';
import {EmployeeService} from '../../services/employee.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {map, startWith} from 'rxjs/operators';
import {PageRequest} from '../../shared/page-request';
import {DateHelper} from '../../shared/date-helper';
import {LoggedUser} from "../../shared/logged-user";
import {ServiceService} from "../../services/service.service";
import {Printorder} from "../../entities/printorder";
import {PrintorderService} from "../../services/printorder.service";
import {Service} from "../../entities/service";
import {Billpayment} from "../../entities/billpayment";
import {BillpaymentService} from "../../services/billpayment.service";
import {Consumeitempayment} from '../../entities/consumeitempayment';
import {ConsumeitempaymentService} from "../../services/consumeitempayment.service";
import {Rentalpayment} from "../../entities/rentalpayment";
import {RentalpaymentService} from "../../services/rentalpayment.service";
import {Servicepayment} from "../../entities/servicepayment";
import {ServicepaymentService} from "../../services/servicepayment.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends AbstractComponent implements OnInit {

  employee: number;
  employees: Employee[] = [];
  services: Service[] = [];
  services5: Service[] = [];
  printorders: Printorder[] = [];
  printorders5: Printorder[] = [];
  filteredOptions: Observable<Employee[]>;

  data: any[] = [];
  tableData: any[] = [];
  displayedColumns: string[] = ['code', 'basicsalary', 'epfamount', 'netsalary', 'alowances', 'paydate'];



  public barChartOptions: ChartOptions = {
    responsive: true,
    legend: {display: true}
  };
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'line';
  public barChartLegend = true;
  public barChartPlugins = [];
  public lineChartColors: Color[] = [{
    backgroundColor: 'rgba(0, 0, 255, 0.3)',
  },
  ];

  public barChartData: ChartDataSets[] = [
    {data: [], label: 'Net Salary'},
    {data: [], label: 'Allowances'},
    { data: [], label: 'Basic Salary' },
    { data: [], label: 'EPF' }
  ];
   datapage: ConsumeitemDataPage;
   servicesDisplayedColumns: string[];
   printordersDervicesDisplayedColumns: string[];
   billPayments: number;
   rentalPayments: number;
   concumePayments: number;
   servicePayments: number;

  public IbarChartOptions: ChartOptions = {
    responsive: true,
    legend: { display: false }
  };
  public IbarChartLabels: Label[] = [];
  public IbarChartType: ChartType = 'horizontalBar';
  public IbarChartLegend = true;
  public IbarChartPlugins = [];
  public IlineChartColors: Color[] = [{
    backgroundColor: 'rgba(0, 255, 0, 0.3)',
  },
  ];
  Idata: any[] = [];
  public IbarChartData: ChartDataSets[] = [
    { data: [], label: 'Count' }
  ];
  private Idatapage: ConsumeitemDataPage;


  constructor(
    private reportService: ReportService,
    private serviceService: ServiceService,
    private printorderService: PrintorderService,
    private billpaymentService: BillpaymentService,
    private consumeitempaymentService: ConsumeitempaymentService,
    private rentalpaymentService: RentalpaymentService,
    private servicepaymentService: ServicepaymentService,
    private employeeService: EmployeeService,
    private snackBar: MatSnackBar,
  ) {
    super();
  }


  async ngOnInit(): Promise<void> {
    await this.loadData();
    this.refreshData();
  }

  updatePrivileges(): any {
  }


  range  = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  get startField(): FormControl{
    return this.range.controls.start as FormControl;
  }

  get endField(): FormControl{
    return this.range.controls.end as FormControl;
  }

  async loadData(): Promise<any> {

    const pageRequest = new PageRequest();
    pageRequest.addSearchCriteria('startDate', DateHelper.getDateAsString(this.startField.value));
    pageRequest.addSearchCriteria('endtDate', DateHelper.getDateAsString(this.endField.value));
    if (LoggedUser.user.employee){
      console.log(LoggedUser.user);
      this.employee = LoggedUser.user.employee.id;
    }else {
      this.employee = 6;
    }

    this.data = await this.reportService.getAllPayRollByEmployee(this.employee, pageRequest);

    this.barChartLabels = [];
    this.barChartData[0].data = [];

    for (const d of this.data) {
      this.barChartLabels.push(d.paydate);
      this.barChartData[0].data.push(d.netsalary);
      this.barChartData[1].data.push(d.alowances);
      this.barChartData[2].data.push(d.basicsalary);
      this.barChartData[3].data.push(d.epfamount);
    }

    this.printordersDervicesDisplayedColumns = ['code', 'more'];
    this.services = await this.serviceService.getAllInProgress();
    this.printorders = await this.printorderService.getAllOrdered();


    this.billPayments = await this.billpaymentService.getSumof30();
    this.rentalPayments = await this.rentalpaymentService.getSumof30();
    this.concumePayments = await this.consumeitempaymentService.getSumof30();
    this.servicePayments = await this.servicepaymentService.getSumof30();

    this.Idatapage = await this.reportService.getAllConsumeItem(pageRequest);
    this.Idata = this.Idatapage.content;

    this.IbarChartLabels = [];
    this.IbarChartData[0].data = [];

    for (const d of this.Idata){
      this.IbarChartLabels.push(d.name);
      this.IbarChartData[0].data.push(d.qty);
    }
  }
}
