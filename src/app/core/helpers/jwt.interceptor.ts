import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { BrowserStorageService } from '../services/platform/browser-storage.service';
import * as AppConst from '../../core/utils/app.const';

export const jwtInterceptor: HttpInterceptorFn = (request, next) => {
  const browserStorage = inject(BrowserStorageService);

  // add authorization header with jwt token if available
  const userJson = browserStorage.getItem('shareBookUser');
  const shareBookUser = userJson ? JSON.parse(userJson) : null;
  if (shareBookUser && shareBookUser.accessToken && !request.url.startsWith(AppConst.postalCodeWebService)) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${shareBookUser.accessToken}`
      }
    });
  }

  return next(request);
};
