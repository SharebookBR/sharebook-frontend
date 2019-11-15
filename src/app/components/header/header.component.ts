import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { User } from '../../core/models/user';
import { UserService } from '../../core/services/user/user.service';
import { AuthenticationService } from '../../core/services/authentication/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  // variavel apra selecionar o menu via DOM
  @ViewChild('menu') menu: ElementRef;

  userLogged = false;
  shareBookUser = new User();

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
    this._scUser.getLoggedUser()
    .pipe(
      takeUntil(this._destroySubscribes$)
    )
    .subscribe(shareBookUser => {
      this.shareBookUser = shareBookUser;
      this.userLogged = !!this.shareBookUser;
    });
  }

  // metodo que desativa o menu ao clicar em um link
  showHideMenu() {
    if (this.menu.nativeElement.classList.contains('show')) {
      this.menu.nativeElement.classList.toggle('show');
    }
  }

  ngOnDestroy() {
    this._destroySubscribes$.next();
    this._destroySubscribes$.complete();
  }
}
