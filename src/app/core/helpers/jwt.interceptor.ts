import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { BrowserStorageService } from '../services/platform/browser-storage.service';
import { APP_CONFIG } from '../../app-config.module';

export const jwtInterceptor: HttpInterceptorFn = (request, next) => {
  const browserStorage = inject(BrowserStorageService);
  const config = inject(APP_CONFIG);

  // O token só vai para a nossa API. Qualquer outro host (S3, ViaCEP...) não deve recebê-lo.
  if (!request.url.startsWith(`${config.apiEndpoint}/`)) {
    return next(request);
  }

  const userJson = browserStorage.getItem('shareBookUser');
  const shareBookUser = userJson ? JSON.parse(userJson) : null;
  if (shareBookUser && shareBookUser.accessToken) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${shareBookUser.accessToken}`
      }
    });
  }

  return next(request);
};
