import { Component, input, Input } from '@angular/core';
import { CardMetrics, EffortData, RitmoChart } from '../../../models/analytics';

@Component({
  selector: 'app-analytics-content',
  standalone: false,
  templateUrl: './analytics-content.html',
  styleUrl: './analytics-content.css',
})
export class AnalyticsContent {
  @Input() cardData: CardMetrics | null = null;
  @Input() effortData: EffortData[] = [];
  @Input() ritmoData: RitmoChart | null = null;
  @Input() valueFormatter: (value: number) => string = (value) => value.toString();
}
