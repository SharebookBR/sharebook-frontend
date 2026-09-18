import { InjectionToken } from '@angular/core';

export interface RecaptchaSettings {
  siteKey: string;
}

export const RECAPTCHA_SETTINGS = new InjectionToken<RecaptchaSettings>('recaptcha-settings');
