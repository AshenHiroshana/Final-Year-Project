import { Component, OnInit } from '@angular/core';
import {AbstractComponent} from "../../../../shared/abstract-component";
import {FormControl, FormGroup} from "@angular/forms";
import {ChartDataSets, ChartOptions, ChartType} from "chart.js";
import {Color, Label} from "ng2-charts";
import {ReportService} from "../../../../services/report.service";
import {PageRequest} from "../../../../shared/page-request";
import {DateHelper} from "../../../../shared/date-helper";
import {ReportHelper} from "../../../../shared/report-helper";
import {ConsumeitemDataPage} from "../../../../entities/consumeitem";

@Component({
  selector: 'app-consumeitem-inventory',
  templateUrl: './consumeitem-inventory.component.html',
  styleUrls: ['./consumeitem-inventory.component.scss']
})
export class ConsumeitemInventoryComponent extends AbstractComponent implements OnInit {

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
  public barChartType: ChartType = 'horizontalBar';
  public barChartLegend = true;
  public barChartPlugins = [];
  public lineChartColors: Color[] = [{
    backgroundColor: 'rgba(0, 0, 255, 0.3)',
  },
  ];

  public barChartData: ChartDataSets[] = [
    { data: [], label: 'Count' }
  ];
  private datapage: ConsumeitemDataPage;

  constructor(private reportService: ReportService) {
    super();
  }

  async ngOnInit(): Promise<void> {
    await this.loadData();
    this.refreshData();
  }

  async loadData(): Promise<any> {
    const pageRequest = new PageRequest();
    this.datapage = await this.reportService.getAllConsumeItem(pageRequest);
    this.data = this.datapage.content;

    this.barChartLabels = [];
    this.barChartData[0].data = [];

    for (const d of this.data){
      this.barChartLabels.push(d.name);
      this.barChartData[0].data.push(d.qty);
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
