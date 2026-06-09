import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexGrid,
  ApexLegend,
  ApexPlotOptions,
  ApexStroke,
  ApexXAxis,
  ApexYAxis,
  ChartComponent,
} from 'ng-apexcharts';

import { SalesInfo } from '../../../../shared/data';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  stroke: ApexStroke;
  grid: ApexGrid;
};

@Component({
  selector: 'app-bar-chart',
  standalone: false,
  templateUrl: './bar-chart.html',
  styleUrl: './bar-chart.css',
})
export class BarChart implements OnChanges {
  @ViewChild('chart') chart: ChartComponent | null = null;
  public chartOptions: ChartOptions;

  @Input() valueFormatter: any;
  @Input() salesInfo: SalesInfo = { currentYear: [], lastYear: [] };

  constructor() {
    this.chartOptions = {
      series: [
        {
          name: 'This year',
          data: [],
          zIndex: 0,
        },
        {
          name: 'Last year',
          data: [],
          zIndex: 1,
        },
      ],
      chart: {
        height: 350,
        type: 'bar',
        toolbar: {
          show: false,
        },
      },
      xaxis: {
        categories: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
        labels: {
          style: {
            colors: '#667085',
          },
          offsetY: 5,
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: '#667085',
          },
          formatter: (salesTotal: number) => {
            return this.valueFormatter(salesTotal);
          },
          offsetX: -10,
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      plotOptions: {
        bar: {
          columnWidth: '40px',
          rangeBarGroupRows: true,
        },
      },
      fill: {
        colors: ['rgba(99, 91, 255, 1)', 'rgba(99, 91, 255, 0.25)'],
      },
      stroke: {
        colors: ['transparent'],
        width: 2,
      },
      grid: {
        borderColor: '#dcdfe4',
        strokeDashArray: 2,
      },
    };
  }

  ngOnChanges(): void {
    this.chartOptions.series[0].data = this.salesInfo.currentYear;
    this.chartOptions.series[1].data = this.salesInfo.lastYear;
  }
}
