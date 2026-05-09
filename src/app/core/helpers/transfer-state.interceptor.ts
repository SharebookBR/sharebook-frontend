import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TransferState, makeStateKey } from '@angular/platform-browser';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

@Injectable()
export class TransferStateInterceptor implements HttpInterceptor {
  constructor(
    private transferState: TransferState,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Only intercept GET requests
    if (request.method !== 'GET') {
      return next.handle(request);
    }

    const key = makeStateKey<any>(request.urlWithParams);

    if (isPlatformBrowser(this.platformId)) {
      const storedResponse = this.transferState.get(key, null);
      if (storedResponse) {
        this.transferState.remove(key);
        return of(new HttpResponse({ body: storedResponse, status: 200 }));
      }
    }

    return next.handle(request).pipe(
      tap((event) => {
        if (isPlatformServer(this.platformId) && event instanceof HttpResponse) {
          this.transferState.set(key, event.body);
        }
      })
    );
  }
}
