export interface ImporterQueueItem {
  id?: string;
  sourceId: number;
  sourceName: string;
  sourceUrl?: string;
  title?: string;
  status: string;
  updatedAt?: string;
  errorMessage?: string;
  rawPayload?: string;
}

export interface ImporterItemDetail {
  id?: string;
  sourceId: number;
  sourceName: string;
  title?: string;
  status: string;
  errorMessage?: string;
  rawPayload?: string;
  externalUrl?: string;
}

export interface ImporterQueueListItem {
  id: number;
  sourceId: number;
  sourceName: string;
  title: string;
  author?: string;
  sourceUrl: string;
  status: string;
  plannedTitle?: string;
  plannedAuthor?: string;
  plannedCategoryId?: string;
  plannedCategoryName?: string;
  plannedCategoryParentName?: string;
  attempts: number;
  lastError?: string;
  sharebookBookId?: string;
  plannedSynopsis?: string;
  plannedCoverMode?: string;
  plannedCoverUrl?: string;
  plannedBy?: string;
  plannedAt?: string;
  bookSlug?: string;
  bookImageSlug?: string;
  metadataJson?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ImporterQueueItemsPage {
  page: number;
  itemsPerPage: number;
  totalItems: number;
  items: ImporterQueueListItem[];
}

export interface ImporterSourceStatus {
  sourceId: number;
  sourceName: string;
  sourceUrl: string;
  enabled: boolean;
  totalItems: number;
  done: number;
  waitingTriage: number;
  triaging: number;
  triageRejected: number;
  waitingEditor: number;
  editing: number;
  waitingProcess: number;
  processing: number;
  retryLater: number;
  sourceBlocked: number;
  duplicate: number;
  error: number;
  nextItemTitle?: string;
  nextItemStatus?: string;
  lastRunAt?: string;
  lastRunStatus?: string;
  lastRunMessage?: string;
  // D-1 (null = sem histórico ainda)
  doneD1?: number | null;
  waitingTriageD1?: number | null;
  triagingD1?: number | null;
  triageRejectedD1?: number | null;
  waitingEditorD1?: number | null;
  editingD1?: number | null;
  waitingProcessD1?: number | null;
  processingD1?: number | null;
  retryLaterD1?: number | null;
  sourceBlockedD1?: number | null;
  duplicateD1?: number | null;
  errorD1?: number | null;
}

export interface ImporterQueueItemHistoryEntry {
  changedAt: string;
  fromStatus: string | null;
  toStatus: string;
}

export interface ImporterDashboard {
  generatedAtUtc: string;
  totalItems: number;
  sources: ImporterSourceStatus[];
  queueItems?: ImporterQueueItem[];
  selectedItem?: ImporterItemDetail;
}
