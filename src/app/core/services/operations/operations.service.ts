import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { APP_CONFIG, AppConfig } from '../../../app-config.module';
import { ImporterDashboard } from '../../models/importer-dashboard';
import { JobMonitorDashboard } from '../../models/job-monitor';

@Injectable({ providedIn: 'root' })
export class OperationsService {
  constructor(private _http: HttpClient, @Inject(APP_CONFIG) private config: AppConfig) {}

  getJobsDashboard(): Observable<JobMonitorDashboard> {
    return this._http.get<JobMonitorDashboard>(`${this.config.apiEndpoint}/Operations/Jobs`);
  }

  getImporterDashboard(): Observable<ImporterDashboard> {
    return this._http.get<ImporterDashboard>(`${this.config.apiEndpoint}/Operations/ImporterDashboard`);
  }
}
