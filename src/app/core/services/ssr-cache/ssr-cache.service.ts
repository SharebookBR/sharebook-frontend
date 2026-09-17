import { Injectable } from '@angular/core';

const TTL_MS = 15 * 60 * 1000; // 15 minutos

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

// Fora da classe: escopo de módulo Node.js, persiste entre requests SSR
const _store = new Map<string, CacheEntry<unknown>>();

@Injectable({ providedIn: 'root' })
export class SsrCacheService {

  get<T>(key: string): T | null {
    const entry = _store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      _store.delete(key);
      return null;
    }
    return entry.data as T;
  }

  set<T>(key: string, data: T, ttlMs = TTL_MS): void {
    _store.set(key, { data, expiresAt: Date.now() + ttlMs });
  }
}
