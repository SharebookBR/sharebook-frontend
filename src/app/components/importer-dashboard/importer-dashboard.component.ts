import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { SeoService } from 'src/app/core/services/seo/seo.service';
import { ImporterQueueListItem, ImporterSourceStatus } from '../../core/models/importer-dashboard';
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
  importerItems: ImporterQueueListItem[] = [];

  selectedSourceId = 'ebook_foundation';
  selectedStatus = '';
  isItemsLoading = false;
  itemsLoadError = false;
  currentPage = 1;
  pageSize = 50;
  totalQueueItems = 0;
  readonly pageSizeOptions = [50, 100, 200];

  readonly statusSummaryOrder = [
    'waiting_triage',
    'triaging',
    'waiting_editor',
    'editing',
    'waiting_process',
    'processing',
    'done',
    'retry_later',
    'source_blocked',
    'duplicate',
    'error',
  ];

  constructor(
    private _operationsService: OperationsService,
    private _seo: SeoService
  ) {}

  ngOnInit(): void {
    this._seo.generateTags({ title: 'Painel do Importador' });
    this.loadDashboard();
  }

  get availableSources(): ImporterSourceStatus[] {
    return this.sources;
  }

  get selectedSource(): ImporterSourceStatus | null {
    return this.sources.find(source => this.getSourceKey(source) === this.selectedSourceId) || null;
  }

  get statusSummaryCards(): Array<{ status: string; total: number }> {
    const source = this.selectedSource;

    return this.statusSummaryOrder.map(status => ({
      status,
      total: source ? this.getStatusCount(source, status) : 0,
    }));
  }

  get completionRate(): number {
    const source = this.selectedSource;

    if (!source?.totalItems) {
      return 0;
    }

    const resolvedItems = source.done + source.duplicate + source.sourceBlocked;

    return Math.round((resolvedItems / source.totalItems) * 100);
  }

  trackBySource(index: number, source: ImporterSourceStatus): number {
    return source.sourceId;
  }

  trackByImporterItem(index: number, item: ImporterQueueListItem): number {
    return item.id;
  }

  onSourceChanged(): void {
    this.currentPage = 1;
    this.loadItems();
  }

  toggleStatus(status: string): void {
    this.selectedStatus = this.selectedStatus === status ? '' : status;
    this.currentPage = 1;
    this.loadItems();
  }

  getSourceKey(source: ImporterSourceStatus): string {
    return source.sourceName;
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
      duplicate: 'Duplicate',
    };

    return labels[status] || status || 'Sem status';
  }

  getStatusCardClass(status: string): string {
    return `summary-card--${status.replace(/_/g, '-')}`;
  }

  getImporterItemStatusClass(status: string): string {
    return `importer-item--${status.replace(/_/g, '-')}`;
  }

  isStatusSelected(status: string): boolean {
    return this.selectedStatus === status;
  }

  getItemTitle(item: ImporterQueueListItem): string {
    return item.plannedTitle || item.title || 'Sem título';
  }

  getItemAuthor(item: ImporterQueueListItem): string {
    return item.plannedAuthor || item.author || 'Autor não informado';
  }

  getItemSecondaryInfo(item: ImporterQueueListItem): string {
    if (item.sharebookBookId) {
      return `Livro Sharebook #${item.sharebookBookId}`;
    }

    if (item.plannedCategoryId) {
      return `Categoria planejada #${item.plannedCategoryId}`;
    }

    return 'Sem planejamento editorial completo';
  }

  getShortError(item: ImporterQueueListItem): string {
    if (!item.lastError) {
      return '';
    }

    return item.lastError.length > 160 ? `${item.lastError.slice(0, 157)}...` : item.lastError;
  }

  get totalPages(): number {
    return Math.max(Math.ceil(this.totalQueueItems / this.pageSize), 1);
  }

  get paginationStart(): number {
    if (this.totalQueueItems === 0) {
      return 0;
    }

    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get paginationEnd(): number {
    if (this.totalQueueItems === 0) {
      return 0;
    }

    return Math.min(this.currentPage * this.pageSize, this.totalQueueItems);
  }

  get visiblePages(): number[] {
    if (this.totalPages <= 5) {
      return Array.from({ length: this.totalPages }, (_, index) => index + 1);
    }

    const startPage = Math.max(1, Math.min(this.currentPage - 2, this.totalPages - 4));
    return Array.from({ length: 5 }, (_, index) => startPage + index);
  }

  changePageSize(value: string): void {
    const nextPageSize = Number(value);

    if (!nextPageSize || nextPageSize === this.pageSize) {
      return;
    }

    this.pageSize = nextPageSize;
    this.currentPage = 1;
    this.loadItems();
  }

  goToPage(page: number): void {
    const nextPage = Math.min(Math.max(page, 1), this.totalPages);

    if (nextPage === this.currentPage) {
      return;
    }

    this.currentPage = nextPage;
    this.loadItems();
  }

  private getStatusCount(source: ImporterSourceStatus, status: string): number {
    const counts = {
      waiting_triage: source.waitingTriage,
      triaging: source.triaging,
      waiting_editor: source.waitingEditor,
      editing: source.editing,
      waiting_process: source.waitingProcess,
      processing: source.processing,
      done: source.done,
      retry_later: source.retryLater,
      source_blocked: source.sourceBlocked,
      duplicate: source.duplicate,
      error: source.error,
    };

    return counts[status] || 0;
  }

  private loadDashboard(): void {
    this.isLoading = true;
    this.loadError = false;

    this._operationsService.getImporterDashboard().subscribe({
      next: dashboard => {
        this.generatedAtUtc = dashboard.generatedAtUtc;
        this.totalItems = dashboard.totalItems;
        this.sources = dashboard.sources || [];

        if (!this.sources.find(source => this.getSourceKey(source) === this.selectedSourceId) && this.sources.length) {
          this.selectedSourceId = this.sources.find(source => this.getSourceKey(source) === 'ebook_foundation')?.sourceName || this.getSourceKey(this.sources[0]);
        }

        this.isLoading = false;
        this.loadItems();
      },
      error: () => {
        this.loadError = true;
        this.isLoading = false;
      },
    });
  }

  private loadItems(): void {
    const source = this.selectedSource;

    if (!source) {
      this.importerItems = [];
      this.totalQueueItems = 0;
      return;
    }

    this.isItemsLoading = true;
    this.itemsLoadError = false;

    this._operationsService
      .getImporterItems(source.sourceId, this.selectedStatus, this.currentPage, this.pageSize)
      .pipe(finalize(() => (this.isItemsLoading = false)))
      .subscribe({
        next: response => {
          this.importerItems = response.items || [];
          this.totalQueueItems = response.totalItems || 0;
          this.currentPage = response.page || 1;
          this.pageSize = response.itemsPerPage || this.pageSize;
        },
        error: () => {
          this.importerItems = [];
          this.totalQueueItems = 0;
          this.itemsLoadError = true;
        },
      });
  }
}
