import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { JobMonitorDashboard, JobMonitorItem } from 'src/app/features/admin/job-monitor';
import { OperationsService } from 'src/app/features/admin/services/operations.service';
import { SeoService } from 'src/app/core/services/seo/seo.service';

@Component({
    selector: 'app-jobs-dashboard',
    templateUrl: './jobs-dashboard.component.html',
    styleUrls: ['./jobs-dashboard.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: true,
    imports: [CommonModule, RouterLink, MatButtonModule, MatProgressSpinnerModule]
})
export class JobsDashboardComponent implements OnInit {
  dashboard: JobMonitorDashboard;
  isLoading = true;
  loadError = false;
  expandedHistory = new Set<string>();
  private readonly weekDayLabels: Record<string, string> = {
    Monday: 'segunda',
    Tuesday: 'terca',
    Wednesday: 'quarta',
    Thursday: 'quinta',
    Friday: 'sexta',
    Saturday: 'sabado',
    Sunday: 'domingo',
  };

  constructor(private _operationsService: OperationsService, private _seo: SeoService) {}

  ngOnInit(): void {
    this._seo.generateTags({ title: 'Painel de Jobs' });
    this.loadDashboard();
  }

  get hasExecutorHistory(): boolean {
    return !!this.dashboard?.executor?.lastExecutionAt;
  }

  getScheduleLabel(job: JobMonitorItem): string {
    if (job.interval === 'Weekly' && job.bestDayOfWeek && job.bestTimeToExecute) {
      const weekDayLabel = this.weekDayLabels[job.bestDayOfWeek] || job.bestDayOfWeek;
      return `${weekDayLabel} ${job.bestTimeToExecute}`;
    }

    return job.bestTimeToExecute || 'Livre';
  }

  getFlowLabel(job: JobMonitorItem): string {
    if (job.jobName === 'NewBookGetInterestedUsers' || job.jobName === 'NewEbookWeeklyDigest') {
      return 'Enfileira e-mails';
    }

    if (job.jobName === 'MailSender') {
      return 'Consome fila';
    }

    return 'Executa rotina';
  }

  getHealthClass(job: JobMonitorItem): string {
    return `job-health--${job.healthStatus || 'unknown'}`;
  }

  toggleHistory(jobName: string): void {
    if (this.expandedHistory.has(jobName)) {
      this.expandedHistory.delete(jobName);
      return;
    }

    this.expandedHistory.add(jobName);
  }

  isHistoryExpanded(jobName: string): boolean {
    return this.expandedHistory.has(jobName);
  }

  private loadDashboard(): void {
    this.isLoading = true;
    this.loadError = false;

    this._operationsService.getJobsDashboard().subscribe({
      next: dashboard => {
        this.dashboard = dashboard;
        this.isLoading = false;
      },
      error: () => {
        this.loadError = true;
        this.isLoading = false;
      },
    });
  }
}
