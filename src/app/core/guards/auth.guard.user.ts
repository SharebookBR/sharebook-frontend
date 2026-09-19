import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { BrowserStorageService } from '../services/platform/browser-storage.service';

export const authGuardUser: CanActivateFn = (route, state) => {
  const browserStorage = inject(BrowserStorageService);
  const router = inject(Router);

  if (browserStorage.getItem('shareBookUser')) {
    // logged in so return true
    return true;
  }

  // not logged in so redirect to login page with the return url
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
