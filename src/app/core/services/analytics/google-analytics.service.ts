import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { PlatformService } from '../platform/platform.service';

declare var gtag: Function;

@Injectable()
export class GoogleAnalyticsService {
  constructor(router: Router, private platformService: PlatformService) {
    if (!environment.production || !this.platformService.isBrowser()) {
      return;
    }

    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        gtag('config', environment.googleAnalyticsId, {
          page_path: event.urlAfterRedirects,
        });
      }
    });
  }

  public sendEvent(eventName: string, eventParams: any = {}) {
    if (!environment.production || !this.platformService.isBrowser()) {
      return;
    }

    gtag('event', eventName, eventParams);
  }
}
