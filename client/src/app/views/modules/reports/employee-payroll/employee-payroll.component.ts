import { Component, OnInit } from '@angular/core';
import {AbstractComponent} from "../../../../shared/abstract-component";
import {FormControl, FormGroup} from "@angular/forms";
import {ChartDataSets, ChartOptions, ChartType} from "chart.js";
import {Color, Label} from "ng2-charts";
import {ConsumeitemDataPage} from "../../../../entities/consumeitem";
import {ReportService} from "../../../../services/report.service";
import {PageRequest} from "../../../../shared/page-request";
import {ReportHelper} from "../../../../shared/report-helper";
import {DateHelper} from "../../../../shared/date-helper";
import {EmployeeService} from "../../../../services/employee.service";
import {Employee, EmployeeDataPage} from "../../../../entities/employee";
import {Observable} from "rxjs";
import {map, startWith} from "rxjs/operators";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-employee-payroll',
  templateUrl: './employee-payroll.component.html',
  styleUrls: ['./employee-payroll.component.scss']
})
export class EmployeePayrollComponent extends AbstractComponent implements OnInit {

  employees: Employee[] = [];
  filteredOptions: Observable<Employee[]>;

  range  = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  employee = new FormControl('');
  searchemployee = new FormControl('');

  get startField(): FormControl{
    return this.range.controls.start as FormControl;
  }

  get endField(): FormControl{
    return this.range.controls.end as FormControl;
  }

  data: any[] = [];
  tableData: any[] = [];
  displayedColumns: string[] = ['code', 'basicsalary', 'epfamount', 'netsalary', 'alowances', 'paydate'];


  public barChartOptions: ChartOptions = {
    responsive: true,
    legend: { display: true }
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
    { data: [], label: 'Net Salary' },
    { data: [], label: 'Allowances' },
    { data: [], label: 'Basic Salary' },
    { data: [], label: 'EPF' }
  ];
  private datapage: ConsumeitemDataPage;

  constructor(
    private reportService: ReportService,
    private employeeService: EmployeeService,
    private snackBar: MatSnackBar,
  ) {
    super();
    this.filteredOptions = this.searchemployee.valueChanges
      .pipe(
        startWith(''),
        map(employee => employee ? this._filterEmployee(employee) : this.employees.slice())
      );
  }

  private _filterEmployee(value: string): Employee[] {
    const filterValue = value.toLowerCase();
    return this.employees.filter(employee => employee.code.toLowerCase().indexOf(filterValue) === 0);
  }

  async ngOnInit(): Promise<void> {
    await this.loadData();
    this.refreshData();
  }

  async loadData(): Promise<any> {
    this.employeeService.getAll(new PageRequest()).then((employeeDataPage) => {
      this.employees = employeeDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    if (this.employee.value){
     const pageRequest = new PageRequest();
     pageRequest.addSearchCriteria('startDate', DateHelper.getDateAsString(this.startField.value));
     pageRequest.addSearchCriteria('endtDate', DateHelper.getDateAsString(this.endField.value));
     this.data = await this.reportService.getAllPayRollByEmployee(this.employee.value.id, pageRequest);
   }

    this.barChartLabels = [];
    this.barChartData[0].data = [];
    this.barChartData[1].data = [];
    this.barChartData[2].data = [];
    this.barChartData[3].data = [];

    for (const d of this.data){
      this.barChartLabels.push(d.paydate);
      this.barChartData[0].data.push(d.netsalary);
      this.barChartData[1].data.push(d.alowances);
      this.barChartData[2].data.push(d.basicsalary);
      this.barChartData[3].data.push(d.epfamount);

    /*  this.barChartLabels.unshift(d.paydate);
      this.barChartData[0].data.unshift(d.netsalary);
      this.barChartData[1].data.unshift(d.alowances);*/
    }

    // Table Data
    // this.tableData = await this.reportService.getDistrictWiseStudentCountTable();
  }


  setSearchValue(option: any): void {
    console.log(option);
    this.employee.patchValue(option);
    this.loadData();
  }

  updatePrivileges(): any {
  }

  print(): void {
    ReportHelper.print('report');
  }

  reset(): void {
    this.employee.reset();
    this.searchemployee.reset();
    this.range.reset();
    this.loadData();
  }
}
