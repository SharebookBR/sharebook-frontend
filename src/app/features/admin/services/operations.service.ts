import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { APP_CONFIG, AppConfig } from 'src/app/app-config.module';
import { JobMonitorDashboard } from 'src/app/features/admin/job-monitor';

@Injectable({ providedIn: 'root' })
export class OperationsService {
  constructor(private _http: HttpClient, @Inject(APP_CONFIG) private config: AppConfig) {}

  getJobsDashboard(): Observable<JobMonitorDashboard> {
    return this._http.get<JobMonitorDashboard>(`${this.config.apiEndpoint}/Operations/Jobs`);
  }
}
