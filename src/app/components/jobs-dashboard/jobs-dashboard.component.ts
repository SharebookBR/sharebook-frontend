import { Component, OnInit } from '@angular/core';

import { JobMonitorDashboard } from '../../core/models/job-monitor';
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

  constructor(private _operationsService: OperationsService, private _seo: SeoService) {}

  ngOnInit(): void {
    this._seo.generateTags({ title: 'Painel de Jobs' });
    this.loadDashboard();
  }

  get hasExecutorHistory(): boolean {
    return !!this.dashboard?.executor?.lastExecutionAt;
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
