import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subject, of } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

interface CtaMetric { cta: string; clicks: number; }
interface StepMetric { step: number; label: string; queued: number; opened: number; clicked: number; ctas: CtaMetric[]; }
interface OnboardingDashboard { days: number; journeysStarted: number; journeysCompleted: number; journeysCanceled: number; overdueJourneys: number; steps: StepMetric[]; }

@Component({
  selector: 'app-onboarding-analytics-dashboard',
  templateUrl: './onboarding-analytics-dashboard.component.html',
  styleUrls: ['./onboarding-analytics-dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink]
})
export class OnboardingAnalyticsDashboardComponent implements OnInit, OnDestroy {
  data: OnboardingDashboard | null = null;
  days = 30;
  loading = true;
  error = false;
  private destroy$ = new Subject<void>();

  constructor(private http: HttpClient) {}

  ngOnInit(): void { this.load(); }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  load(): void {
    this.loading = true;
    this.error = false;
    this.http.get<OnboardingDashboard>(`${environment.apiEndpoint}/onboardinganalytics/dashboard`, {
      params: { days: this.days }
    }).pipe(
      catchError(() => {
        this.error = true;
        return of(null);
      }),
      takeUntil(this.destroy$)
    ).subscribe(data => {
      this.data = data;
      this.loading = false;
    });
  }

  percentage(part: number, whole: number): number { return whole > 0 ? (part / whole) * 100 : 0; }

  ctaLabel(cta: string): string {
    const labels: Record<string, string> = { catalog: 'Catálogo', donate: 'Doar um livro', community: 'Comunidade' };
    return labels[cta] ?? cta;
  }
}
