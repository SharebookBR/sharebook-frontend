import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';

import { User } from '../../core/models/user';
import { UserService } from '../../core/services/user/user.service';
import { AuthenticationService } from '../../core/services/authentication/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  // variavel apra selecionar o menu via DOM
  @ViewChild('menu') menu: ElementRef;

  private _subscription: Subscription;

  userLogged = false;
  shareBookUser = new User();

  constructor(private _scUser: UserService, private _scAuthentication: AuthenticationService,) {

    // if has shareBookUser, set value to variables
    if (this._scUser.getLoggedUserFromLocalStorage()) {
      this.shareBookUser = this._scUser.getLoggedUserFromLocalStorage();
      this.userLogged = true;
    }

  }

  ngOnInit() {
    this._subscription = this._scUser.getLoggedUser().subscribe(shareBookUser => {
      this.shareBookUser = shareBookUser;
      this.userLogged = !!this.shareBookUser;
    });
    this._scAuthentication.checkTokenValidity();
  }

  // metodo que desativa o menu ao clicar em um link
  showHideMenu() {
    if (this.menu.nativeElement.classList.contains('show')) {
      this.menu.nativeElement.classList.toggle('show');
    }
  }

}
