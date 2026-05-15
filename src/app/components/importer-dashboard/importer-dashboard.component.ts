import { Component, OnInit, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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
  @ViewChild('metadataDialog') metadataDialog: TemplateRef<any>;
  @ViewChild('importerItemsSection') importerItemsSection: ElementRef;

  isLoading = true;
  loadError = false;

  generatedAtUtc: string;
  totalItems = 0;
  sources: ImporterSourceStatus[] = [];
  importerItems: ImporterQueueListItem[] = [];
  selectedItemMetadata: any = null;

  selectedSourceId = 'baixelivros_infantil';
  selectedStatus = '';
  selectedSort = 'updated_at_desc';
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
    'retry_later',
    'triage_rejected',
    'source_blocked',
    'duplicate',
    'error',
    'done',
  ];

  constructor(
    private _operationsService: OperationsService,
    private _seo: SeoService,
    private _dialog: MatDialog
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

    const resolvedItems = source.done + source.duplicate + source.sourceBlocked + source.triageRejected;

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

  onSortChanged(): void {
    this.currentPage = 1;
    this.loadItems();
  }

  toggleStatus(status: string): void {
    const previousStatus = this.selectedStatus;
    this.selectedStatus = this.selectedStatus === status ? '' : status;
    this.currentPage = 1;

    // Se mudou para um status de "waiting" ou "retry_later", muda o sort para ID ASC
    // Se saiu de um status de "waiting" ou mudou para outro tipo, volta para última atualização DESC
    if (this.selectedStatus.startsWith('waiting_') || this.selectedStatus === 'retry_later') {
      this.selectedSort = 'id_asc';
    } else if (previousStatus.startsWith('waiting_') || previousStatus === 'retry_later' || !this.selectedStatus) {
      this.selectedSort = 'updated_at_desc';
    }

    this.loadItems();

    if (this.selectedStatus) {
      setTimeout(() => {
        this.importerItemsSection?.nativeElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }

  getSourceKey(source: ImporterSourceStatus): string {
    return source.sourceName;
  }

  getStatusLabel(status: string): string {
    const labels = {
      error: 'Erro',
      retry_later: 'Retry later',
      triaging: 'Triaging',
      triage_rejected: 'Triage rejected',
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

  getAgentInfo(status: string): { name: string; icon: string } | null {
    const mapping: { [key: string]: { name: string; icon: string } } = {
      waiting_triage: { name: 'Python Worker', icon: 'settings' },
      triaging: { name: 'Python Worker', icon: 'settings' },
      waiting_editor: { name: 'GPT-5.4 Editor', icon: 'auto_awesome' },
      editing: { name: 'GPT-5.4 Editor', icon: 'auto_awesome' },
      waiting_process: { name: 'Python Worker', icon: 'settings' },
      processing: { name: 'Python Worker', icon: 'settings' },
      retry_later: { name: 'Python Worker', icon: 'settings' },
    };
    return mapping[status] || null;
  }

  getItemTitle(item: ImporterQueueListItem): string {
    return item.plannedTitle || item.title || 'Sem título';
  }

  getItemAuthor(item: ImporterQueueListItem): string {
    return item.plannedAuthor || item.author || '';
  }

  getItemSecondaryInfo(item: ImporterQueueListItem): string {
    if (item.sharebookBookId) {
      return `Livro Sharebook #${item.sharebookBookId}`;
    }

    if (item.plannedCategoryId) {
      return `Categoria planejada #${item.plannedCategoryId}`;
    }

    return '';
  }

  getShortError(item: ImporterQueueListItem): string {
    if (!item.lastError) {
      return '';
    }

    return item.lastError.length > 160 ? `${item.lastError.slice(0, 157)}...` : item.lastError;
  }

  getPdpUrl(item: ImporterQueueListItem): string {
    if (!item.bookSlug) {
      return '';
    }

    return `https://www.sharebook.com.br/livros/${item.bookSlug}`;
  }

  getBookImageUrl(item: ImporterQueueListItem): string {
    const imageName = item.bookImageSlug || (item.bookSlug ? `${item.bookSlug}.jpg` : '');

    if (!imageName) {
      return '';
    }

    return `https://api.sharebook.com.br/Images/Books/${imageName}`;
  }

  getTriageDetail(item: ImporterQueueListItem): string {
    if (!item.metadataJson) {
      return '';
    }

    try {
      const metadata = JSON.parse(item.metadataJson);
      return metadata?.triage?.detail || '';
    } catch {
      return '';
    }
  }

  viewMetadata(item: ImporterQueueListItem): void {
    if (!item.metadataJson) {
      return;
    }

    try {
      this.selectedItemMetadata = JSON.parse(item.metadataJson);
      this._dialog.open(this.metadataDialog, {
        width: '600px',
        maxWidth: '100vw',
        maxHeight: '80vh',
      });
    } catch {
      alert('Erro ao processar metadata (JSON inválido).');
    }
  }

  getMetadataEntries(): Array<{ key: string; value: any; type: string }> {
    if (!this.selectedItemMetadata) {
      return [];
    }

    const entries: Array<{ key: string; value: any; type: string }> = [];

    const flatten = (obj: any, prefix = '') => {
      Object.entries(obj).forEach(([key, value]) => {
        const k = prefix ? `${prefix} > ${key}` : key;
        const readableKey = k.replace(/_/g, ' ');

        if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
          flatten(value, k);
        } else {
          let valueType: string = typeof value;
          if (value === null) valueType = 'null';
          if (Array.isArray(value)) valueType = 'array';

          entries.push({
            key: readableKey,
            value: valueType === 'array' ? JSON.stringify(value) : value,
            type: valueType
          });
        }
      });
    };

    flatten(this.selectedItemMetadata);
    return entries;
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
      triage_rejected: source.triageRejected,
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
          this.selectedSourceId = this.sources.find(source => this.getSourceKey(source) === 'baixelivros_infantil')?.sourceName || this.getSourceKey(this.sources[0]);
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
      .getImporterItems(source.sourceId, this.selectedStatus, this.currentPage, this.pageSize, this.selectedSort)
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
