import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { User } from '../../core/models/user';
import { UserService } from '../../core/services/user/user.service';
import { AuthenticationService } from '../../core/services/authentication/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  userLogged = false;
  shareBookUser = new User();
  logoUrl = 'assets/img/logo.png';
  showUserMenu = false;

  get firstName(): string {
    if (!this.shareBookUser?.name) return '';
    return this.shareBookUser.name.split(' ')[0];
  }

  private _destroySubscribes$ = new Subject<void>();

  constructor(
    private _scUser: UserService,
    private _scAuthentication: AuthenticationService,
    private _router: Router
  ) {
    this._scAuthentication.checkTokenValidity();

    if (this._scUser.getLoggedUserFromLocalStorage()) {
      this.shareBookUser = this._scUser.getLoggedUserFromLocalStorage();
      this.userLogged = true;
    }
  }

  ngOnInit() {
    this.setComemorativeLogo();

    this._scUser
      .getLoggedUser()
      .pipe(takeUntil(this._destroySubscribes$))
      .subscribe((shareBookUser) => {
        this.shareBookUser = shareBookUser;
        this.userLogged = !!this.shareBookUser;
      });
  }

  toggleUserMenu(event: Event) {
    event.stopPropagation();
    this.showUserMenu = !this.showUserMenu;
  }

  @HostListener('document:click')
  closeUserMenu() {
    this.showUserMenu = false;
  }

  logout() {
    this._scAuthentication.logout();
    this._router.navigate(['/']);
  }

  ngOnDestroy() {
    this._destroySubscribes$.next();
    this._destroySubscribes$.complete();
  }

  setComemorativeLogo() {
    const currDate = new Date();
    const currYear = currDate.getFullYear();

    let start = new Date(currYear + '/12/01');
    let end = new Date(currYear + '/12/31');

    if (currDate >= start && currDate <= end) {
      this.logoUrl = 'assets/img/logo-natal.png';
      return;
    }

    start = new Date(currYear + '/02/15');
    end = new Date(currYear + '/03/15');

    if (currDate >= start && currDate <= end) {
      this.logoUrl = 'assets/img/logo-carnaval.png';
      return;
    }
  }
}
