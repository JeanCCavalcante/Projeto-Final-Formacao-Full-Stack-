import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import {
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexGrid,
  ApexLegend,
  ApexStroke,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
  ChartComponent,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: { name: string; data: number[] }[];
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  stroke: ApexStroke;
  fill: ApexFill;
  grid: ApexGrid;
  tooltip: ApexTooltip;
};

@Component({
  selector: 'app-rhythm-chart',
  standalone: false,
  templateUrl: './rhythm-chart.html',
  styleUrls: ['./rhythm-chart.css'],
})
export class RhythmChart implements OnChanges {
  @ViewChild('chart') chart: ChartComponent | null = null;
  public chartOptions: ChartOptions;

  @Input() sprints: string[] = [];
  @Input() diasGastos: number[] = [];
  @Input() metaEsperada: number[] = [];

  constructor() {
    this.chartOptions = {
      series: [
        { name: 'Dias Gastos', data: [] },
        { name: 'Meta Esperada', data: [] },
      ],
      chart: {
        height: 350,
        type: 'area',
        toolbar: { show: false },
        zoom: { enabled: false },
      },
      xaxis: {
        categories: [],
        labels: { style: { colors: '#667085' } },
      },
      yaxis: {
        labels: { style: { colors: '#667085' } },
      },
      dataLabels: { enabled: false },
      legend: { show: true, position: 'top' },
      stroke: { curve: 'smooth', width: 2 },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.4,
          opacityTo: 0.1,
        },
      },
      grid: { borderColor: '#dcdfe4', strokeDashArray: 2 },
      tooltip: { shared: true },
    };
  }

  ngOnChanges(): void {
    // Only update if we have data
    if (this.sprints.length && this.diasGastos.length && this.metaEsperada.length) {
      this.chartOptions = {
        ...this.chartOptions,
        xaxis: {
          ...this.chartOptions.xaxis,
          categories: this.sprints,
        },
        series: [
          { ...this.chartOptions.series[0], data: this.diasGastos },
          { ...this.chartOptions.series[1], data: this.metaEsperada },
        ],
      };
    } else {
      this.chartOptions = {
        ...this.chartOptions,
        xaxis: {
          ...this.chartOptions.xaxis,
          categories: [],
        },
        series: [
          { ...this.chartOptions.series[0], data: [] },
          { ...this.chartOptions.series[1], data: [] },
        ],
      };
    }
  }
}
