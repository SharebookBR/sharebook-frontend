import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from '../services/user/user.service';

@Injectable()
export class AuthGuardAdmin implements CanActivate {

    constructor(
        private router: Router,
        private _scUserService: UserService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const { profile } = this._scUserService.getLoggedUserFromLocalStorage();

        if (profile === 'Administrator') {
            // logged in so return true
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/'], { queryParams: { returnUrl: state.url }});
        return false;
    }
}
