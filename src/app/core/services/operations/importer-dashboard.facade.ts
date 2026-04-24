import { Injectable } from '@angular/core';

import {
  ImporterDashboard,
  ImporterItemDetail,
  ImporterQueueItem,
  ImporterSourceStatus,
} from '../../models/importer-dashboard';

export interface ImporterDashboardViewModel {
  dashboard: ImporterDashboard;
  queueItems: ImporterQueueItem[];
  initialSelectedItem: ImporterItemDetail | null;
}

@Injectable({ providedIn: 'root' })
export class ImporterDashboardFacade {
  toViewModel(dashboard: ImporterDashboard): ImporterDashboardViewModel {
    const queueItems = this.buildQueueItems(dashboard);
    const initialSelectedItem = dashboard.selectedItem || this.toItemDetail(queueItems[0]);

    return {
      dashboard,
      queueItems,
      initialSelectedItem,
    };
  }

  private buildQueueItems(dashboard: ImporterDashboard): ImporterQueueItem[] {
    if (dashboard.queueItems?.length) {
      return dashboard.queueItems.slice();
    }

    return dashboard.sources
      .filter(source => !!source.nextItemStatus)
      .map(source => this.toQueueItemFromSource(source))
      .sort((left, right) => this.getStatusWeight(left.status) - this.getStatusWeight(right.status) || (left.position || 0) - (right.position || 0));
  }

  private toQueueItemFromSource(source: ImporterSourceStatus): ImporterQueueItem {
    return {
      id: `${source.sourceId}:${source.nextItemPosition || 0}:${source.nextItemStatus}`,
      sourceId: source.sourceId,
      sourceName: source.sourceName,
      sourceUrl: source.sourceUrl,
      position: source.nextItemPosition,
      title: source.nextItemTitle,
      status: source.nextItemStatus || 'unknown',
      updatedAt: source.lastRunAt,
      errorMessage: source.lastRunStatus === 'error' ? source.lastRunMessage : undefined,
      rawPayload: source.lastRunMessage,
    };
  }

  private toItemDetail(item?: ImporterQueueItem): ImporterItemDetail | null {
    if (!item) {
      return null;
    }

    return {
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

  private getStatusWeight(status: string): number {
    const order = ['error', 'retry_later', 'triaging', 'editing', 'processing', 'waiting_triage', 'waiting_editor', 'waiting_process'];
    const index = order.indexOf(status);

    return index >= 0 ? index : order.length;
  }
}
