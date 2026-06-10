import { Injectable } from '@angular/core';

const TTL_MS = 15 * 60 * 1000; // 15 minutos

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

@Injectable({ providedIn: 'root' })
export class SsrCacheService {
  private store = new Map<string, CacheEntry<unknown>>();

  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.data as T;
  }

  set<T>(key: string, data: T, ttlMs = TTL_MS): void {
    this.store.set(key, { data, expiresAt: Date.now() + ttlMs });
  }
}
