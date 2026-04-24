import { Component, OnInit } from '@angular/core';

import { SeoService } from 'src/app/core/services/seo/seo.service';
import { ImporterDashboardFacade } from '../../core/services/operations/importer-dashboard.facade';
import { ImporterItemDetail, ImporterQueueItem, ImporterSourceStatus } from '../../core/models/importer-dashboard';
import { OperationsService } from '../../core/services/operations/operations.service';

@Component({
  selector: 'app-importer-dashboard',
  templateUrl: './importer-dashboard.component.html',
  styleUrls: ['./importer-dashboard.component.css'],
})
export class ImporterDashboardComponent implements OnInit {
  isLoading = true;
  loadError = false;

  generatedAtUtc: string;
  totalItems = 0;
  sources: ImporterSourceStatus[] = [];
  queueItems: ImporterQueueItem[] = [];
  filteredQueueItems: ImporterQueueItem[] = [];
  selectedItem: ImporterItemDetail | null = null;

  selectedStatus = 'all';
  searchTerm = '';

  readonly statusOptions = [
    { value: 'all', label: 'Todos os status' },
    { value: 'error', label: 'Erro' },
    { value: 'retry_later', label: 'Retry later' },
    { value: 'triaging', label: 'Triaging' },
    { value: 'editing', label: 'Editing' },
    { value: 'processing', label: 'Processing' },
    { value: 'waiting_triage', label: 'Waiting triage' },
    { value: 'waiting_editor', label: 'Waiting editor' },
    { value: 'waiting_process', label: 'Waiting process' },
  ];

  constructor(
    private _operationsService: OperationsService,
    private _importerDashboardFacade: ImporterDashboardFacade,
    private _seo: SeoService
  ) {}

  ngOnInit(): void {
    this._seo.generateTags({ title: 'Painel do Importador' });
    this.loadDashboard();
  }

  get activeSources(): number {
    return this.sources.filter(source => source.enabled).length;
  }

  get blockedSources(): number {
    return this.sources.filter(source => source.sourceBlocked > 0).length;
  }

  get erroredItems(): number {
    return this.sources.reduce((total, source) => total + source.error, 0);
  }

  get pendingItems(): number {
    return this.sources.reduce(
      (total, source) => total + source.waitingTriage + source.triaging + source.waitingEditor + source.editing + source.waitingProcess + source.processing + source.retryLater,
      0
    );
  }

  get completionRate(): number {
    if (!this.totalItems) {
      return 0;
    }

    const doneItems = this.sources.reduce((total, source) => total + source.done, 0);
    return Math.round((doneItems / this.totalItems) * 100);
  }

  trackBySource(index: number, source: ImporterSourceStatus): number {
    return source.sourceId;
  }

  trackByQueue(index: number, item: ImporterQueueItem): string {
    return item.id || `${item.sourceId}-${item.position || index}-${item.status}`;
  }

  applyFilters(): void {
    const term = this.searchTerm.trim().toLowerCase();

    this.filteredQueueItems = this.queueItems.filter(item => {
      const statusMatches = this.selectedStatus === 'all' || item.status === this.selectedStatus;
      const termMatches = !term || [item.title, item.sourceName, item.status, item.position != null ? String(item.position) : ''].some(value =>
        (value || '').toLowerCase().includes(term)
      );

      return statusMatches && termMatches;
    });

    if (!this.filteredQueueItems.length) {
      this.selectedItem = null;
      return;
    }

    const selectedId = this.selectedItem?.id;
    const stillSelected = this.filteredQueueItems.find(item => item.id === selectedId);
    this.selectQueueItem(stillSelected || this.filteredQueueItems[0]);
  }

  selectQueueItem(item: ImporterQueueItem): void {
    this.selectedItem = {
      id: item.id,
      sourceId: item.sourceId,
      sourceName: item.sourceName,
      title: item.title,
      status: item.status,
      position: item.position,
      errorMessage: item.errorMessage,
      rawPayload: item.rawPayload,
      externalUrl: item.sourceUrl,
    };
  }

  getQueueEmptyStateMessage(): string {
    if (!this.queueItems.length) {
      return 'Nenhum item pendente apareceu no contrato atual do backend.';
    }

    return 'Nenhum item bate com os filtros aplicados.';
  }

  getSourcePendingCount(source: ImporterSourceStatus): number {
    return source.waitingTriage + source.triaging + source.waitingEditor + source.editing + source.waitingProcess + source.processing + source.retryLater + source.error;
  }

  getLastRunBadgeClass(source: ImporterSourceStatus): string {
    return source.lastRunStatus === 'error' ? 'status-pill status-pill--error' : 'status-pill status-pill--neutral';
  }

  getStatusLabel(status: string): string {
    const labels = {
      error: 'Erro',
      retry_later: 'Retry later',
      triaging: 'Triaging',
      editing: 'Editing',
      processing: 'Processing',
      waiting_triage: 'Waiting triage',
      waiting_editor: 'Waiting editor',
      waiting_process: 'Waiting process',
      done: 'Done',
      source_blocked: 'Source blocked',
    };

    return labels[status] || status || 'Sem status';
  }

  private loadDashboard(): void {
    this.isLoading = true;
    this.loadError = false;

    this._operationsService.getImporterDashboard().subscribe({
      next: dashboard => {
        const viewModel = this._importerDashboardFacade.toViewModel(dashboard);

        this.generatedAtUtc = dashboard.generatedAtUtc;
        this.totalItems = dashboard.totalItems;
        this.sources = dashboard.sources || [];
        this.queueItems = viewModel.queueItems;
        this.selectedItem = viewModel.initialSelectedItem;
        this.applyFilters();
        this.isLoading = false;
      },
      error: () => {
        this.loadError = true;
        this.isLoading = false;
      },
    });
  }
}
