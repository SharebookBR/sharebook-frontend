import { Injectable } from '@angular/core';

import { PlatformService } from 'src/app/core/services/platform/platform.service';

export interface CachedEbookFile {
  slug: string;
  blob: Blob;
  fileName: string;
  contentType: string;
  savedAt: number;
}

@Injectable({
  providedIn: 'root',
})
export class EbookDownloadCacheService {
  private readonly dbName = 'sharebook-ebook-downloads';
  private readonly storeName = 'ebooks';
  private readonly maxCachedFiles = 10;
  private dbPromise: Promise<IDBDatabase | null> | null = null;

  constructor(private _platform: PlatformService) {}

  async get(slug: string): Promise<CachedEbookFile | null> {
    const db = await this.openDb();
    if (!db) {
      return null;
    }

    return new Promise((resolve) => {
      const request = db
        .transaction(this.storeName, 'readonly')
        .objectStore(this.storeName)
        .get(slug);

      request.onsuccess = () => resolve((request.result as CachedEbookFile) || null);
      request.onerror = () => resolve(null);
    });
  }

  async put(file: CachedEbookFile): Promise<void> {
    const db = await this.openDb();
    if (!db) {
      return;
    }

    await new Promise<void>((resolve) => {
      const request = db
        .transaction(this.storeName, 'readwrite')
        .objectStore(this.storeName)
        .put(file);

      request.onsuccess = () => resolve();
      request.onerror = () => resolve();
    });

    await this.pruneOldEntries(db);
  }

  createObjectUrl(file: CachedEbookFile): string | null {
    if (!this._platform.isBrowser() || typeof URL === 'undefined') {
      return null;
    }

    const blob = file.blob.type
      ? file.blob
      : new Blob([file.blob], { type: file.contentType || 'application/octet-stream' });

    return URL.createObjectURL(blob);
  }

  private openDb(): Promise<IDBDatabase | null> {
    if (!this._platform.isBrowser() || typeof indexedDB === 'undefined') {
      return Promise.resolve(null);
    }

    if (!this.dbPromise) {
      this.dbPromise = new Promise((resolve) => {
        const request = indexedDB.open(this.dbName, 1);

        request.onupgradeneeded = () => {
          const db = request.result;
          if (!db.objectStoreNames.contains(this.storeName)) {
            const store = db.createObjectStore(this.storeName, { keyPath: 'slug' });
            store.createIndex('savedAt', 'savedAt');
          }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => resolve(null);
        request.onblocked = () => resolve(null);
      });
    }

    return this.dbPromise;
  }

  private async pruneOldEntries(db: IDBDatabase): Promise<void> {
    const entries = await this.listKeysBySavedAt(db);
    if (entries.length <= this.maxCachedFiles) {
      return;
    }

    const keysToRemove = entries
      .slice(0, entries.length - this.maxCachedFiles)
      .map((entry) => entry.slug);

    await new Promise<void>((resolve) => {
      const transaction = db.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);

      keysToRemove.forEach((slug) => store.delete(slug));

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => resolve();
      transaction.onabort = () => resolve();
    });
  }

  private listKeysBySavedAt(db: IDBDatabase): Promise<Array<{ slug: string; savedAt: number }>> {
    return new Promise((resolve) => {
      const entries: Array<{ slug: string; savedAt: number }> = [];
      const request = db
        .transaction(this.storeName, 'readonly')
        .objectStore(this.storeName)
        .openCursor();

      request.onsuccess = () => {
        const cursor = request.result;
        if (!cursor) {
          entries.sort((a, b) => a.savedAt - b.savedAt);
          resolve(entries);
          return;
        }

        const value = cursor.value as CachedEbookFile;
        entries.push({ slug: value.slug, savedAt: value.savedAt || 0 });
        cursor.continue();
      };

      request.onerror = () => resolve([]);
    });
  }
}
