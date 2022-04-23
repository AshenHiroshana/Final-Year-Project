import { Component, OnInit } from '@angular/core';
import {ReportService} from '../../../../services/report.service';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {ThemeManager} from '../../../../shared/views/theme-manager';
import {ChartDataSets, ChartOptions, ChartType} from 'chart.js';
import {Color, Label} from 'ng2-charts';
import {ReportHelper} from '../../../../shared/report-helper';
import {FormControl, FormGroup} from "@angular/forms";
import {DateHelper} from "../../../../shared/date-helper";
import {PageRequest} from "../../../../shared/page-request";

@Component({
  selector: 'app-year-wise-consumeitempayment-count',
  templateUrl: './year-wise-consumeitempayment-count.component.html',
  styleUrls: ['./year-wise-consumeitempayment-count.component.scss']
})
export class YearWiseConsumeitempaymentCountComponent extends AbstractComponent implements OnInit {

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
  displayedColumns: string[] = ['district', 'city', 'count'];

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
    { data: [], label: 'Student Count' }
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
    this.data = await this.reportService.branchWiseBillPayment(pageRequest);

    this.barChartLabels = [];
    this.barChartData[0].data = [];

    for (const d of this.data){
      this.barChartLabels.push(d.branch);
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
