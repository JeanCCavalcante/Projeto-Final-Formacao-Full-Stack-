import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';

import { MatTabChangeEvent } from '@angular/material/tabs';

import { Subject, takeUntil } from 'rxjs';

import { AnalyticsResponse, CardMetrics, EffortData, RitmoChart } from '../../models/analytics';
import { AnalyticsService } from '../../services/analytics';
import { AuthStateService } from '../../services/auth-state';
import { NotificationService } from '../../services/notification';

@Component({
  selector: 'app-analytics',
  standalone: false,
  templateUrl: './analytics.html',
  styleUrl: './analytics.css',
})
export class Analytics implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly analyticsService = inject(AnalyticsService);
  private readonly authStateService = inject(AuthStateService);
  private readonly notification = inject(NotificationService);

  isMentor = this.authStateService.isMentor;
  isLoading = signal(true);

  selectedMentee = signal<string | null>(null);
  menteeNames = computed(() => {
    const data = this.generalData();
    return data ? Object.keys(data.visao_mentorada) : [];
  });

  selectedTabIndex = computed(() => {
    const selected = this.selectedMentee();
    if (selected === null) return 0;
    const names = this.menteeNames();
    const index = names.indexOf(selected);
    return index === -1 ? 0 : index + 1;
  });

  generalData = signal<AnalyticsResponse | null>(null);

  displayedCards = computed<CardMetrics | null>(() => {
    const data = this.generalData();
    if (!data) return null;

    if (this.isMentor()) {
      const mentee = this.selectedMentee();
      if (mentee && data.visao_mentorada[mentee]) {
        return data.visao_mentorada[mentee].cards;
      }
      return data.visao_geral?.cards ?? null;
    } else {
      const user = this.authStateService.loggedUser();
      const menteeName = user?.name;
      if (menteeName && data.visao_mentorada[menteeName]) {
        return data.visao_mentorada[menteeName].cards;
      }
      return null;
    }
  });

  displayedEffort = computed<EffortData[]>(() => {
    const data = this.generalData();
    if (!data) return [];

    if (this.isMentor()) {
      const mentee = this.selectedMentee();
      if (mentee && data.visao_mentorada[mentee]) {
        return data.visao_mentorada[mentee].grafico_esforco.dados;
      }
      return data.visao_geral?.grafico_esforco.dados ?? [];
    } else {
      const user = this.authStateService.loggedUser();
      const menteeName = user?.name;
      if (menteeName && data.visao_mentorada[menteeName]) {
        return data.visao_mentorada[menteeName].grafico_esforco.dados;
      }
      return [];
    }
  });

  displayedRitmo = computed<RitmoChart | null>(() => {
    const data = this.generalData();
    if (!data) return null;

    if (this.isMentor()) {
      const mentee = this.selectedMentee();
      if (mentee && data.visao_mentorada[mentee]) {
        return data.visao_mentorada[mentee].grafico_ritmo;
      }
      return data.visao_geral?.grafico_ritmo ?? null;
    } else {
      const user = this.authStateService.loggedUser();
      const menteeName = user?.name;
      if (menteeName && data.visao_mentorada[menteeName]) {
        return data.visao_mentorada[menteeName].grafico_ritmo;
      }
      return null;
    }
  });

  valueFormatter(value: number): string {
    return value > 999 ? Math.round(value / 100) / 10 + 'k' : value.toString();
  }

  onTabChange(event: MatTabChangeEvent): void {
    const index = event.index;
    if (index === 0) {
      this.selectMentee(null);
    } else {
      const names = this.menteeNames();
      const menteeName = names[index - 1] || null;
      this.selectMentee(menteeName);
    }
  }

  ngOnInit(): void {
    this.analyticsService
      .getAnalytics()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.generalData.set(data);
          this.isLoading.set(false);

          if (this.isMentor()) {
            this.selectedMentee.set(null);
          } else {
            const user = this.authStateService.loggedUser();
            if (user?.name && data.visao_mentorada[user.name]) {
              this.selectedMentee.set(user.name);
            }
          }
        },
        error: (err) => {
          this.notification.showError('Failed to load analytics data.');
          console.error(err);
          this.isLoading.set(false);
        },
      });
  }

  selectMentee(name: string | null): void {
    this.selectedMentee.set(name);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
