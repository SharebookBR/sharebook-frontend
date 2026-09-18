import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
  forwardRef,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { RECAPTCHA_SETTINGS, RecaptchaSettings } from './recaptcha-settings';
import { RecaptchaLoaderService } from './recaptcha-loader.service';

/**
 * Substituto próprio do ng-recaptcha (lib morta, presa a peer dep <= Angular 16).
 * Fala direto com a API oficial do Google (grecaptcha v2 checkbox), sem
 * dependência de versão do Angular - elimina o problema pra sempre, não só
 * pra esta migração.
 */
@Component({
  selector: 're-captcha',
  template: '<div #container></div>',
  standalone: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RecaptchaComponent),
      multi: true,
    },
  ],
})
export class RecaptchaComponent implements AfterViewInit, OnDestroy, ControlValueAccessor {
  @ViewChild('container', { static: true }) containerRef!: ElementRef<HTMLDivElement>;

  private _widgetId: number | null = null;
  private _onChange: (value: string | null) => void = () => {};
  private _onTouched: () => void = () => {};

  constructor(
    @Inject(PLATFORM_ID) private _platformId: Object,
    @Inject(RECAPTCHA_SETTINGS) private _settings: RecaptchaSettings,
    private _loader: RecaptchaLoaderService
  ) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this._platformId)) {
      return;
    }
    this._loader.ready().then(() => {
      this._widgetId = window.grecaptcha!.render(this.containerRef.nativeElement, {
        sitekey: this._settings.siteKey,
        callback: (token: string) => {
          this._onChange(token);
          this._onTouched();
        },
        'expired-callback': () => {
          this._onChange(null);
        },
      });
    });
  }

  writeValue(value: string | null): void {
    if (value === null) {
      this._resetWidget();
    }
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  ngOnDestroy(): void {
    this._resetWidget();
  }

  private _resetWidget(): void {
    if (this._widgetId !== null && isPlatformBrowser(this._platformId)) {
      window.grecaptcha?.reset(this._widgetId);
    }
  }
}
