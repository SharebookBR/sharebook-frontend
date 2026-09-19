import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from '../services/authentication/authentication.service';
import { PlatformService } from '../services/platform/platform.service';

export const errorInterceptor: HttpInterceptorFn = (request, next) => {
  const authenticationService = inject(AuthenticationService);
  const platformService = inject(PlatformService);

  return next(request).pipe(
    catchError(err => {
      if (err.status === 401) {
        // auto logout if 401 response returned from api
        authenticationService.logout();
        platformService.reload();
      }

      const error = err.error?.messages || err.message || err.statusText || 'Unknown Error';
      if (!platformService.isBrowser()) {
        console.error(`SSR API Error [${request.url}]:`, error);
      }
      return throwError(error);
    })
  );
};
