import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import {
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexLegend,
  ApexNonAxisChartSeries,
  ApexStates,
  ApexStroke,
  ApexTooltip,
  ChartComponent,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: any;
  legend: ApexLegend;
  dataLabels: ApexDataLabels;
  tooltip: ApexTooltip;
  fill: ApexFill;
  stroke: ApexStroke;
  states: ApexStates;
};

@Component({
  selector: 'app-donut-chart',
  standalone: false,
  templateUrl: './donut-chart.html',
  styleUrl: './donut-chart.css',
})
export class DonutChart implements OnChanges {
  @ViewChild('chart') chart: ChartComponent | null = null;
  public chartOptions: ChartOptions;

  @Input() trafficSource: {
    desktop: number;
    tablet: number;
    phone: number;
  } = {
    desktop: 0,
    tablet: 0,
    phone: 0,
  };

  constructor() {
    this.chartOptions = {
      series: [],
      chart: {
        height: '289px',
        type: 'donut',
        width: '100%',
      },
      labels: [],
      legend: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      tooltip: {
        fillSeriesColor: false,
      },
      fill: {
        colors: ['rgb(21, 183, 159)', 'rgb(251, 156, 12)', 'rgb(99, 91, 255)'],
      },
      stroke: {
        width: 0,
      },
      states: {
        hover: {
          filter: {
            type: 'none',
          },
        },
      },
    };
  }

  ngOnChanges(): void {
    this.chartOptions.series = Object.values(this.trafficSource);
    this.chartOptions.labels = Object.keys(this.trafficSource).map((label) =>
      label.replace(/^./, (char) => char.toUpperCase()),
    );
  }
}
