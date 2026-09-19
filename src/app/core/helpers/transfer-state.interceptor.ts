import { inject, PLATFORM_ID, makeStateKey, TransferState } from '@angular/core';
import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { isPlatformBrowser, isPlatformServer } from '@angular/common';

export const transferStateInterceptor: HttpInterceptorFn = (request, next) => {
  // Only intercept GET requests
  if (request.method !== 'GET') {
    return next(request);
  }

  const transferState = inject(TransferState);
  const platformId = inject(PLATFORM_ID);

  const key = makeStateKey<any>(request.urlWithParams);

  if (isPlatformBrowser(platformId)) {
    const storedResponse = transferState.get(key, null);
    if (storedResponse) {
      transferState.remove(key);
      return of(new HttpResponse({ body: storedResponse, status: 200 }));
    }
  }

  return next(request).pipe(
    tap((event) => {
      if (isPlatformServer(platformId) && event instanceof HttpResponse) {
        transferState.set(key, event.body);
      }
    })
  );
};
