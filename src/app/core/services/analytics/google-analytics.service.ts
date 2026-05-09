import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { PlatformService } from '../platform/platform.service';

declare var ga: Function; // <-- Here we declare GA variable

@Injectable()
export class GoogleAnalyticsService {
  constructor(router: Router, private platformService: PlatformService) {
    if (!environment.production || !this.platformService.isBrowser()) {
      return;
    } // <-- If you want to enable GA only in production and browser

    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        ga('set', 'page', event.url);
        ga('send', 'pageview');
      }
    });
  }
}
