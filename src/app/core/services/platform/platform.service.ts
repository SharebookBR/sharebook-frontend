import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class PlatformService {
  private readonly browser: boolean;

  constructor(
    @Inject(PLATFORM_ID) platformId: object,
    @Inject(DOCUMENT) private documentRef: Document
  ) {
    this.browser = isPlatformBrowser(platformId);
  }

  isBrowser(): boolean {
    return this.browser;
  }

  getPathname(): string {
    if (!this.browser) {
      return '';
    }

    return this.documentRef?.location?.pathname || '';
  }

  reload(): void {
    if (!this.browser) {
      return;
    }

    window.location.reload();
  }

  scrollToTop(): void {
    if (!this.browser) {
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }

  open(url: string, target: string = '_blank'): void {
    if (!this.browser) {
      return;
    }

    window.open(url, target);
  }

  writeClipboardText(text: string): Promise<void> {
    if (!this.browser || !navigator?.clipboard?.writeText) {
      return Promise.reject(new Error('Clipboard indisponível'));
    }

    return navigator.clipboard.writeText(text);
  }
}
