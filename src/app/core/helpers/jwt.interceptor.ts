import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BrowserStorageService } from '../services/platform/browser-storage.service';
import * as AppConst from '../../core/utils/app.const';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private _browserStorage: BrowserStorageService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    const userJson = this._browserStorage.getItem('shareBookUser');
    const shareBookUser = userJson ? JSON.parse(userJson) : null;
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
