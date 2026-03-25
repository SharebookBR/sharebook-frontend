import { Component, OnInit } from '@angular/core';

import { JobMonitorDashboard, JobMonitorItem } from '../../core/models/job-monitor';
import { OperationsService } from '../../core/services/operations/operations.service';
import { SeoService } from 'src/app/core/services/seo/seo.service';

@Component({
  selector: 'app-jobs-dashboard',
  templateUrl: './jobs-dashboard.component.html',
  styleUrls: ['./jobs-dashboard.component.css'],
})
export class JobsDashboardComponent implements OnInit {
  dashboard: JobMonitorDashboard;
  isLoading = true;
  loadError = false;
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
