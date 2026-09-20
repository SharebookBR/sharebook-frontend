import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { APP_CONFIG, AppConfig } from 'src/app/app-config.module';
import { ImporterDashboard, ImporterQueueItemHistoryEntry, ImporterQueueItemsPage } from 'src/app/features/admin/importer-dashboard';

@Injectable({ providedIn: 'root' })
export class ImporterService {
  constructor(private _http: HttpClient, @Inject(APP_CONFIG) private config: AppConfig) {}

  getImporterDashboard(): Observable<ImporterDashboard> {
    return this._http.get<ImporterDashboard>(`${this.config.apiEndpoint}/Importer/ImporterDashboard`);
  }

  getImporterItems(sourceId: number, status: string, page: number, pageSize: number, id?: number, title?: string, sort?: string): Observable<ImporterQueueItemsPage> {
    const params = {
      sourceId: String(sourceId),
      page: String(page),
      pageSize: String(pageSize),
      ...(status ? { status } : {}),
      ...(id ? { id: String(id) } : {}),
      ...(title ? { title } : {}),
      ...(sort ? { sort } : {}),
    };

    return this._http.get<ImporterQueueItemsPage>(`${this.config.apiEndpoint}/Importer/ImporterItems`, { params });
  }

  getImporterEditorialPrompt(sourceName: string): Observable<{ sourceName: string; prompt: string }> {
    return this._http.get<{ sourceName: string; prompt: string }>(`${this.config.apiEndpoint}/Importer/ImporterEditorialPrompt`, { params: { sourceName } });
  }

  updateImporterEditorialPrompt(sourceName: string, prompt: string): Observable<void> {
    return this._http.put<void>(`${this.config.apiEndpoint}/Importer/ImporterEditorialPrompt`, { sourceName, prompt });
  }

  getImporterTranslationPrompt(sourceName: string): Observable<{ sourceName: string; prompt: string }> {
    return this._http.get<{ sourceName: string; prompt: string }>(`${this.config.apiEndpoint}/Importer/ImporterTranslationPrompt`, { params: { sourceName } });
  }

  updateImporterTranslationPrompt(sourceName: string, prompt: string): Observable<void> {
    return this._http.put<void>(`${this.config.apiEndpoint}/Importer/ImporterTranslationPrompt`, { sourceName, prompt });
  }

  updateImporterItemNotes(id: number, notes: string): Observable<void> {
    return this._http.patch<void>(`${this.config.apiEndpoint}/Importer/ImporterItems/${id}/AdminNotes`, { notes });
  }

  getImporterItemHistory(id: number): Observable<ImporterQueueItemHistoryEntry[]> {
    return this._http.get<ImporterQueueItemHistoryEntry[]>(`${this.config.apiEndpoint}/Importer/ImporterItems/${id}/History`);
  }
}
