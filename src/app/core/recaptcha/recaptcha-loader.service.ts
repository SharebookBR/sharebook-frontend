import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const SCRIPT_URL = 'https://www.google.com/recaptcha/api.js';
const ONLOAD_CALLBACK_NAME = '___sharebookGrecaptchaOnLoad';

@Injectable({ providedIn: 'root' })
export class RecaptchaLoaderService {
  private _readyPromise: Promise<void> | null = null;

  constructor(@Inject(PLATFORM_ID) private _platformId: Object) {}

  ready(): Promise<void> {
    if (!isPlatformBrowser(this._platformId)) {
      return Promise.reject(new Error('reCAPTCHA só pode ser carregado no browser (SSR).'));
    }
    if (!this._readyPromise) {
      this._readyPromise = new Promise<void>((resolve) => {
        (window as any)[ONLOAD_CALLBACK_NAME] = () => resolve();
        const script = document.createElement('script');
        script.src = `${SCRIPT_URL}?onload=${ONLOAD_CALLBACK_NAME}&render=explicit`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      });
    }
    return this._readyPromise;
  }
}
