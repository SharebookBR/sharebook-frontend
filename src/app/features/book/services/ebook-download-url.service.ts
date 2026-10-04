import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { BookService } from 'src/app/features/book/services/book.service';
import { PlatformService } from 'src/app/core/services/platform/platform.service';

interface CachedDownloadUrl {
  url: string;
  expiresAt: number;
}

/**
 * Lembra a URL assinada de download enquanto ela é válida.
 *
 * Cada POST em DownloadEBookUrl conta como download e consome o rate limit por IP.
 * Quem clica de novo em seguida quer reabrir o mesmo PDF, não baixar outro:
 * reusar a URL ainda válida poupa o back e não infla a métrica.
 */
@Injectable({
  providedIn: 'root',
})
export class EbookDownloadUrlService {
  private readonly storagePrefix = 'sharebook-ebook-url:';
  // Folga para o link não expirar entre o clique e o navegador abrir o arquivo.
  private readonly safetyMarginMs = 30_000;
  private readonly inFlight = new Map<string, Promise<string>>();

  constructor(
    private _scBook: BookService,
    private _platform: PlatformService
  ) {}

  getDownloadUrl(slug: string): Promise<string> {
    const cached = this.readCache(slug);
    if (cached) {
      return Promise.resolve(cached);
    }

    // Toque duplo: o segundo clique pega carona na requisição em andamento.
    const pending = this.inFlight.get(slug);
    if (pending) {
      return pending;
    }

    const request = this.requestDownloadUrl(slug).finally(() => this.inFlight.delete(slug));
    this.inFlight.set(slug, request);
    return request;
  }

  private async requestDownloadUrl(slug: string): Promise<string> {
    const response = await firstValueFrom(this._scBook.createDownloadEbookUrl(slug));
    if (!response?.url) {
      throw new Error('Download URL indisponível');
    }

    const expiresAt = parsePresignedUrlExpiration(response.url);
    if (expiresAt !== null) {
      this.writeCache(slug, { url: response.url, expiresAt });
    }

    return response.url;
  }

  private readCache(slug: string): string | null {
    const storage = this.storage();
    if (!storage) {
      return null;
    }

    try {
      const raw = storage.getItem(this.storagePrefix + slug);
      if (!raw) {
        return null;
      }

      const cached = JSON.parse(raw) as CachedDownloadUrl;
      if (cached?.url && cached.expiresAt - this.safetyMarginMs > Date.now()) {
        return cached.url;
      }

      storage.removeItem(this.storagePrefix + slug);
    } catch {
      // Storage indisponível ou valor corrompido: segue para o back.
    }

    return null;
  }

  private writeCache(slug: string, value: CachedDownloadUrl): void {
    try {
      this.storage()?.setItem(this.storagePrefix + slug, JSON.stringify(value));
    } catch {
      // Quota ou modo privado: sem cache, sem prejuízo ao download.
    }
  }

  private storage(): Storage | null {
    if (!this._platform.isBrowser()) {
      return null;
    }

    try {
      return window.sessionStorage;
    } catch {
      return null;
    }
  }
}

/**
 * Lê a expiração de uma URL pré-assinada da S3 (SigV4 ou SigV2).
 * Retorna null quando a URL não é pré-assinada (ex.: endpoint legado do próprio back).
 */
export function parsePresignedUrlExpiration(url: string): number | null {
  let params: URLSearchParams;
  try {
    params = new URL(url).searchParams;
  } catch {
    return null;
  }

  const amzDate = params.get('X-Amz-Date');
  const amzExpires = params.get('X-Amz-Expires');
  if (amzDate && amzExpires) {
    const match = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/.exec(amzDate);
    const seconds = Number(amzExpires);
    if (!match || !Number.isFinite(seconds) || seconds <= 0) {
      return null;
    }

    const [, year, month, day, hour, minute, second] = match.map(Number);
    const signedAt = Date.UTC(year, month - 1, day, hour, minute, second);
    return signedAt + seconds * 1000;
  }

  const legacyExpires = Number(params.get('Expires'));
  if (params.has('Signature') && Number.isFinite(legacyExpires) && legacyExpires > 0) {
    return legacyExpires * 1000;
  }

  return null;
}
