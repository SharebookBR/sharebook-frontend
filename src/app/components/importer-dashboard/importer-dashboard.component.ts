import { Component, OnInit, OnDestroy, ViewChild, TemplateRef, ElementRef, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';
import type EasyMDE from 'easymde';
import { PlatformService } from '../../core/services/platform/platform.service';

import { ToastrService } from 'ngx-toastr';
import { SeoService } from 'src/app/core/services/seo/seo.service';
import { ImporterQueueItemHistoryEntry, ImporterQueueListItem, ImporterSourceStatus } from '../../core/models/importer-dashboard';
import { OperationsService } from '../../core/services/operations/operations.service';

@Component({
  selector: 'app-importer-dashboard',
  templateUrl: './importer-dashboard.component.html',
  styleUrls: ['./importer-dashboard.component.css'],
})
export class ImporterDashboardComponent implements OnInit, OnDestroy {
  @ViewChild('metadataDialog') metadataDialog: TemplateRef<any>;
  @ViewChild('editorialPromptDialog') editorialPromptDialog: TemplateRef<any>;
  @ViewChild('adminNoteDialog') adminNoteDialog: TemplateRef<any>;
  @ViewChild('historyDialog') historyDialog: TemplateRef<any>;
  @ViewChild('importerItemsSection') importerItemsSection: ElementRef;

  editorialPromptSourceName = '';
  editorialPromptLoading = false;
  editorialPromptSaving = false;
  editorialPromptError = '';
  private _easyMde: EasyMDE | null = null;

  adminNoteItem: ImporterQueueListItem | null = null;
  adminNoteText = '';
  adminNoteSaving = false;

  historyItem: ImporterQueueListItem | null = null;
  historyEntries: ImporterQueueItemHistoryEntry[] = [];
  historyLoading = false;
  historyError = '';

  isLoading = true;
  loadError = false;

  generatedAtUtc: string;
  totalItems = 0;
  sources: ImporterSourceStatus[] = [];
  importerItems: ImporterQueueListItem[] = [];
  selectedItemMetadata: any = null;
  selectedItemData: any = null;

  selectedSourceId = 'ebook_foundation_subjects';
  selectedStatus = '';
  selectedSort = 'updated_at_desc';
  searchTerm = '';
  isItemsLoading = false;
  itemsLoadError = false;
  currentPage = 1;
  pageSize = 50;
  totalQueueItems = 0;
  expandedCard: string | null = null;
  readonly pageSizeOptions = [50, 100, 200];

  readonly aggregateGroups = [
    { id: 'triagem',     label: 'Triagem',          statuses: ['waiting_triage', 'triaging'],                               badge: { name: 'Python Worker', icon: 'settings' } },
    { id: 'editorial',   label: 'Preparo editorial', statuses: ['waiting_editor', 'editing'],                               badge: { name: 'GPT-5.4 Mini',  icon: 'auto_awesome' } },
    { id: 'publicacao',  label: 'Publicação',        statuses: ['waiting_process', 'processing', 'retry_later'],            badge: { name: 'Python Worker', icon: 'settings' } },
    { id: 'done',        label: 'Done',              statuses: ['done'],                                                     badge: null as { name: string; icon: string } | null },
    { id: 'error',       label: 'Error',             statuses: ['triage_rejected', 'source_blocked', 'duplicate', 'error'], badge: null as { name: string; icon: string } | null },
  ];

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
    private _dialog: MatDialog,
    private _toastr: ToastrService,
    private _platform: PlatformService,
    @Inject(DOCUMENT) private _document: Document
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

  get aggregateCards() {
    const source = this.selectedSource;
    return this.aggregateGroups.map(group => {
      const total = group.statuses.reduce((sum, s) => sum + (source ? this.getStatusCount(source, s) : 0), 0);
      const d1Values = source ? group.statuses.map(s => this.getStatusCountD1(source, s)) : [];
      const hasD1 = d1Values.some(v => v !== null);
      const totalD1 = hasD1 ? d1Values.reduce((sum, v) => sum + (v ?? 0), 0) : null;
      return {
        ...group,
        total,
        totalD1,
        breakdown: group.statuses.map(s => ({ status: s, total: source ? this.getStatusCount(source, s) : 0 })),
      };
    });
  }

  formatDelta(total: number, totalD1: number | null): string | null {
    if (totalD1 === null) return null;
    const diff = total - totalD1;
    if (diff === 0) return null;
    return diff > 0 ? `+${diff}` : `−${Math.abs(diff)}`;
  }

  get expandedCardBreakdown(): Array<{ status: string; total: number }> {
    const card = this.aggregateCards.find(c => c.id === this.expandedCard);
    return card?.breakdown || [];
  }

  toggleAggregateCard(cardId: string): void {
    const group = this.aggregateGroups.find(g => g.id === cardId);
    if (!group) return;
    if (group.statuses.length === 1) {
      this.expandedCard = null;
      this.toggleStatus(group.statuses[0]);
    } else {
      this.expandedCard = this.expandedCard === cardId ? null : cardId;
    }
  }

  isAggregateCardSelected(cardId: string): boolean {
    const group = this.aggregateGroups.find(g => g.id === cardId);
    return !!group && group.statuses.includes(this.selectedStatus);
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

  onSearch(): void {
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
      waiting_editor: { name: 'GPT-5.4 Mini', icon: 'auto_awesome' },
      editing: { name: 'GPT-5.4 Mini', icon: 'auto_awesome' },
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

  getItemCategoryLabel(item: ImporterQueueListItem): string {
    if (item.plannedCategoryName) {
      return item.plannedCategoryParentName
        ? `${item.plannedCategoryParentName} > ${item.plannedCategoryName}`
        : item.plannedCategoryName;
    }
    if (item.plannedCategoryId) {
      return `Categoria #${item.plannedCategoryId.slice(0, 8)}…`;
    }
    return '';
  }

  getItemSecondaryInfo(item: ImporterQueueListItem): string {
    if (item.sharebookBookId) {
      return `Livro Sharebook #${item.sharebookBookId}`;
    }
    return this.getItemCategoryLabel(item);
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
    try {
      if (item.metadataJson) {
        const metadata = JSON.parse(item.metadataJson);
        const detail = metadata?.triage?.detail;
        if (detail) return detail;
      }
    } catch { /* ignora JSON inválido */ }
    return item.lastError || '';
  }

  viewMetadata(item: ImporterQueueListItem): void {
    if (!item.metadataJson) {
      return;
    }

    try {
      this.selectedItemMetadata = JSON.parse(item.metadataJson);
      this.selectedItemData = null;
      this._dialog.open(this.metadataDialog, {
        width: '600px',
        maxWidth: '100vw',
        maxHeight: '80vh',
      });
    } catch {
      alert('Erro ao processar metadata (JSON inválido).');
    }
  }

  openEditorialPrompt(): void {
    const source = this.selectedSource;
    if (!source) return;

    this.editorialPromptSourceName = source.sourceName;
    this.editorialPromptLoading = true;
    this.editorialPromptError = '';

    const dialogRef = this._dialog.open(this.editorialPromptDialog, {
      width: '860px',
      maxWidth: '98vw',
      maxHeight: '92vh',
    });

    dialogRef.afterClosed().subscribe(() => this._destroyEasyMde());

    dialogRef.afterOpened().subscribe(() => {
      this._operationsService.getImporterEditorialPrompt(source.sourceName).subscribe({
        next: ({ prompt }) => {
          this.editorialPromptLoading = false;
          setTimeout(() => this._initEasyMde(prompt || ''), 0);
        },
        error: () => {
          this.editorialPromptLoading = false;
          this.editorialPromptError = 'Erro ao carregar o prompt.';
        },
      });
    });
  }

  saveEditorialPrompt(): void {
    if (!this._easyMde) return;
    const prompt = this._easyMde.value();
    this.editorialPromptSaving = true;
    this.editorialPromptError = '';

    this._operationsService.updateImporterEditorialPrompt(this.editorialPromptSourceName, prompt)
      .pipe(finalize(() => (this.editorialPromptSaving = false)))
      .subscribe({
        next: () => {
          this._dialog.closeAll();
          this._toastr.success('Prompt editorial salvo com sucesso!');
        },
        error: () => (this.editorialPromptError = 'Erro ao salvar. Tente novamente.'),
      });
  }

  private _initEasyMde(content: string): void {
    if (!this._platform.isBrowser()) return;
    this._destroyEasyMde();
    import('easymde').then(({ default: EasyMDE }) => {
      const el = this._document.getElementById('editorial-prompt-editor') as HTMLTextAreaElement;
      if (!el) return;
      this._easyMde = new EasyMDE({
        element: el,
        initialValue: content,
        spellChecker: false,
        autofocus: true,
        toolbar: ['bold', 'italic', 'heading', '|', 'unordered-list', 'ordered-list', '|', 'preview', 'side-by-side', 'fullscreen'],
      });
    });
  }

  private _destroyEasyMde(): void {
    if (this._easyMde) {
      this._easyMde.toTextArea();
      this._easyMde = null;
    }
  }

  ngOnDestroy(): void {
    this._destroyEasyMde();
  }

  openAdminNote(item: ImporterQueueListItem): void {
    this.adminNoteItem = item;
    this.adminNoteText = item.adminNotes || '';
    this._dialog.open(this.adminNoteDialog, {
      width: '520px',
      maxWidth: '100vw',
    });
  }

  saveAdminNote(): void {
    if (!this.adminNoteItem) return;
    this.adminNoteSaving = true;
    const item = this.adminNoteItem;
    this._operationsService.updateImporterItemNotes(item.id, this.adminNoteText)
      .pipe(finalize(() => (this.adminNoteSaving = false)))
      .subscribe({
        next: () => {
          item.adminNotes = this.adminNoteText.trim() || undefined;
          this._dialog.closeAll();
          this._toastr.success('Comentário salvo!');
        },
        error: () => this._toastr.error('Erro ao salvar comentário.'),
      });
  }

  openHistory(item: ImporterQueueListItem): void {
    this.historyItem = item;
    this.historyEntries = [];
    this.historyLoading = true;
    this.historyError = '';

    const dialogRef = this._dialog.open(this.historyDialog, {
      width: '540px',
      maxWidth: '100vw',
      maxHeight: '80vh',
    });

    dialogRef.afterOpened().subscribe(() => {
      this._operationsService.getImporterItemHistory(item.id).subscribe({
        next: entries => {
          this.historyLoading = false;
          this.historyEntries = entries;
        },
        error: () => {
          this.historyLoading = false;
          this.historyError = 'Erro ao carregar histórico.';
        },
      });
    });
  }

  viewData(item: ImporterQueueListItem): void {
    const data: any = { ...item };
    delete data.metadataJson; // Omitir metadados pois tem botão próprio
    this.selectedItemData = data;
    this.selectedItemMetadata = null;
    this._dialog.open(this.metadataDialog, {
      width: '600px',
      maxWidth: '100vw',
      maxHeight: '80vh',
    });
  }

  getInspectorEntries(): Array<{ key: string; value: any; type: string }> {
    const target = this.selectedItemMetadata || this.selectedItemData;
    if (!target) {
      return [];
    }

    const entries: Array<{ key: string; value: any; type: string }> = [];

    const flatten = (obj: any, prefix = '') => {
      Object.entries(obj).forEach(([key, value]) => {
        const k = prefix ? `${prefix} > ${key}` : key;
        const readableKey = k.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim();

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

    flatten(target);
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
    const counts: Record<string, number> = {
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

    return counts[status] ?? 0;
  }

  private getStatusCountD1(source: ImporterSourceStatus, status: string): number | null {
    const counts: Record<string, number | null | undefined> = {
      waiting_triage: source.waitingTriageD1,
      triaging: source.triagingD1,
      triage_rejected: source.triageRejectedD1,
      waiting_editor: source.waitingEditorD1,
      editing: source.editingD1,
      waiting_process: source.waitingProcessD1,
      processing: source.processingD1,
      done: source.doneD1,
      retry_later: source.retryLaterD1,
      source_blocked: source.sourceBlockedD1,
      duplicate: source.duplicateD1,
      error: source.errorD1,
    };
    const val = counts[status];
    return val === undefined ? null : (val ?? null);
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
          this.selectedSourceId = this.sources.find(source => this.getSourceKey(source) === 'ebook_foundation_subjects')?.sourceName || this.getSourceKey(this.sources[0]);
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

    let searchId: number | undefined;
    let searchTitle: string | undefined;

    if (this.searchTerm) {
      if (/^\d+$/.test(this.searchTerm.trim())) {
        searchId = Number(this.searchTerm.trim());
      } else {
        searchTitle = this.searchTerm.trim();
      }
    }

    this._operationsService
      .getImporterItems(source.sourceId, this.selectedStatus, this.currentPage, this.pageSize, searchId, searchTitle, this.selectedSort)
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
