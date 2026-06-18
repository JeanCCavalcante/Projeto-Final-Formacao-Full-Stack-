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
  labels: string[];
  legend: ApexLegend;
  dataLabels: ApexDataLabels;
  tooltip: ApexTooltip;
  fill: ApexFill;
  stroke: ApexStroke;
  states: ApexStates;
};

@Component({
  selector: 'app-effort-chart',
  standalone: false,
  templateUrl: './effort-chart.html',
  styleUrls: ['./effort-chart.css'],
})
export class EffortChart implements OnChanges {
  @ViewChild('chart') chart: ChartComponent | null = null;
  public chartOptions: ChartOptions;

  @Input() data: { status: string; quantidade: number }[] = [];

  constructor() {
    this.chartOptions = {
      series: [],
      chart: {
        height: 350,
        type: 'pie',
        toolbar: { show: false },
      },
      labels: [],
      legend: { show: false },
      dataLabels: { enabled: false, formatter: (val) => val + '%' },
      tooltip: { fillSeriesColor: false },
      fill: { colors: ['#15b79f', '#fb9c0c', '#635bff'] },
      stroke: { width: 0 },
      states: {
        hover: { filter: { type: 'none' } },
      },
    };
  }

  ngOnChanges(): void {
    if (this.data.length) {
      this.chartOptions.series = this.data.map((d) => d.quantidade);
      this.chartOptions.labels = this.data.map((d) => d.status);
    }
  }
}
