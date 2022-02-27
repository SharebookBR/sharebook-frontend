import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
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
  // variavel apra selecionar o menu via DOM
  @ViewChild('menu', { static: true }) menu: ElementRef;

  userLogged = false;
  shareBookUser = new User();
  logoUrl = 'assets/img/logo.png';

  private _destroySubscribes$ = new Subject<void>();

  constructor(private _scUser: UserService, private _scAuthentication: AuthenticationService) {
    this._scAuthentication.checkTokenValidity();

    // if has shareBookUser, set value to variables
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

  // metodo que desativa o menu ao clicar em um link
  showHideMenu() {
    this.menu.nativeElement.classList.toggle('show');
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
