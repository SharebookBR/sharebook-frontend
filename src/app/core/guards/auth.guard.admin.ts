import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user/user.service';

export const authGuardAdmin: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  const user = userService.getLoggedUserFromLocalStorage();

  if (user?.profile === 'Administrator') {
    // logged in so return true
    return true;
  }

  // not logged in so redirect to login page with the return url
  router.navigate(['/'], { queryParams: { returnUrl: state.url } });
  return false;
};
