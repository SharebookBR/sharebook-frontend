import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subject, of } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

interface BatchMetrics {
  firstEmailQueued: number;
  firstEmailOpened: number;
  firstEmailClicked: number;
  journeysCompleted: number;
  journeysCanceled: number;
}

interface LegacyBatch {
  id: string;
  sequenceNumber: number;
  executedAtUtc: string;
  enrolledCount: number;
  currentJourneys: number;
  newestUserCreationAtUtc: string | null;
  oldestUserCreationAtUtc: string | null;
  ageInDays: number;
  isComparable: boolean;
  currentMetrics: BatchMetrics;
  firstSevenDaysMetrics: BatchMetrics | null;
}

interface UpcomingBatch {
  sequenceNumber: number;
  scheduledAtUtc: string;
  estimatedJourneys: number;
}

interface LegacyRolloutDashboard {
  batchSize: number;
  remainingEligibleJourneys: number;
  remainingBatches: number;
  nextBatchAtUtc: string | null;
  estimatedFinalBatchAtUtc: string | null;
  batches: LegacyBatch[];
  upcomingBatches: UpcomingBatch[];
}

@Component({
  selector: 'app-analise-onboarding-legado',
  templateUrl: './analise-onboarding-legado.component.html',
  styleUrls: ['./analise-onboarding-legado.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink]
})
export class AnaliseOnboardingLegadoComponent implements OnInit, OnDestroy {
  data: LegacyRolloutDashboard | null = null;
  loading = true;
  error = false;
  firstBatchId = '';
  secondBatchId = '';
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
    this.http.get<LegacyRolloutDashboard>(`${environment.apiEndpoint}/onboardinganalytics/legacy-rollout`).pipe(
      catchError(() => {
        this.error = true;
        return of(null);
      }),
      takeUntil(this.destroy$)
    ).subscribe(data => {
      this.data = data;
      const comparable = data?.batches.filter(batch => batch.isComparable) ?? [];
      this.firstBatchId = comparable[0]?.id ?? '';
      this.secondBatchId = comparable[1]?.id ?? '';
      this.loading = false;
    });
  }

  percentage(part: number, whole: number): number { return whole > 0 ? (part / whole) * 100 : 0; }

  get comparableBatches(): LegacyBatch[] { return this.data?.batches.filter(batch => batch.isComparable) ?? []; }

  get firstBatch(): LegacyBatch | undefined { return this.comparableBatches.find(batch => batch.id === this.firstBatchId); }

  get secondBatch(): LegacyBatch | undefined { return this.comparableBatches.find(batch => batch.id === this.secondBatchId); }
}
