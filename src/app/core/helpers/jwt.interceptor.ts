import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as AppConst from '../../core/utils/app.const';
import { BrowserStorageService } from '../services/platform/browser-storage.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private _storage: BrowserStorageService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    const storedUser = this._storage.getItem('shareBookUser');
    const shareBookUser = storedUser ? JSON.parse(storedUser) : null;
    if (shareBookUser && shareBookUser.accessToken && !request.url.startsWith(AppConst.postalCodeWebService)) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${shareBookUser.accessToken}`
        }
      });
    }

    return next.handle(request);
  }
}
