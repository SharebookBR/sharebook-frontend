export interface ImporterQueueItem {
  id?: string;
  sourceId: number;
  sourceName: string;
  sourceUrl?: string;
  position?: number;
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
  position?: number;
  errorMessage?: string;
  rawPayload?: string;
  externalUrl?: string;
}

export interface ImporterQueueListItem {
  id: number;
  sourceId: number;
  sourceName: string;
  position: number;
  title: string;
  author?: string;
  sourceUrl: string;
  status: string;
  plannedTitle?: string;
  plannedAuthor?: string;
  plannedCategoryId?: string;
  attempts: number;
  lastError?: string;
  sharebookBookId?: string;
  metadataJson?: string;
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
  nextItemPosition?: number;
  nextItemStatus?: string;
  lastRunAt?: string;
  lastRunStatus?: string;
  lastRunMessage?: string;
}

export interface ImporterDashboard {
  generatedAtUtc: string;
  totalItems: number;
  sources: ImporterSourceStatus[];
  queueItems?: ImporterQueueItem[];
  selectedItem?: ImporterItemDetail;
}
