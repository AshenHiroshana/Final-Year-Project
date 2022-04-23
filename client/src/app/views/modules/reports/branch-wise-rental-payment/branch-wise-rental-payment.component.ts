import { Component, OnInit } from '@angular/core';
import {AbstractComponent} from "../../../../shared/abstract-component";
import {FormControl, FormGroup} from "@angular/forms";
import {ChartDataSets, ChartOptions, ChartType} from "chart.js";
import {Color, Label} from "ng2-charts";
import {ReportService} from "../../../../services/report.service";
import {PageRequest} from "../../../../shared/page-request";
import {DateHelper} from "../../../../shared/date-helper";
import {ReportHelper} from "../../../../shared/report-helper";

@Component({
  selector: 'app-branch-wise-rental-payment',
  templateUrl: './branch-wise-rental-payment.component.html',
  styleUrls: ['./branch-wise-rental-payment.component.scss']
})
export class BranchWiseRentalPaymentComponent extends AbstractComponent implements OnInit {

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

  data: any[] = [];
  tableData: any[] = [];
  displayedColumns: string[] = ['code', 'basicsalary', 'epfamount', 'netsalary', 'alowances'];

  public barChartOptions: ChartOptions = {
    responsive: true,
    legend: { display: false }
  };
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];
  public lineChartColors: Color[] = [{
    backgroundColor: 'rgba(0, 0, 255, 0.3)',
  },
  ];

  public barChartData: ChartDataSets[] = [
    { data: [], label: 'Amount' }
  ];

  constructor(private reportService: ReportService) {
    super();
  }

  async ngOnInit(): Promise<void> {
    await this.loadData();
    this.refreshData();
  }

  async loadData(): Promise<any> {
    const pageRequest = new PageRequest();
    pageRequest.addSearchCriteria('startDate', DateHelper.getDateAsString(this.startField.value));
    pageRequest.addSearchCriteria('endtDate', DateHelper.getDateAsString(this.endField.value));
    this.data = await this.reportService.branchWiseRentalPayment(pageRequest);

    this.barChartLabels = [];
    this.barChartData[0].data = [];

    for (const d of this.data){
      this.barChartLabels.push(d.branch);
      console.log(d.amount);
      this.barChartData[0].data.push(d.amount);
    }

    // Table Data
    // this.tableData = await this.reportService.getDistrictWiseStudentCountTable();
  }



  updatePrivileges(): any {
  }

  print(): void {
    ReportHelper.print('report');
  }
}
