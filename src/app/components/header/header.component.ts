import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import moment from 'moment-timezone';
import { environment } from '../../../environments/environment';

import { User } from '../../core/models/user';
import { UserService } from '../../core/services/user/user.service';

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
  localStorageUserKey = 'shareBookUser';

  constructor(private _scUser: UserService) {

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
    this.checkTokenValidity();
  }

  // metodo que desativa o menu ao clicar em um link
  showHideMenu() {
    if (this.menu.nativeElement.classList.contains('show')) {
      this.menu.nativeElement.classList.toggle('show');
    }
  }

  checkTokenValidity() {
    const user = JSON.parse(localStorage.getItem(this.localStorageUserKey));
    if (user) {
      const expiration = moment(user.expiration);
      const now = moment();
      if (now.isAfter(expiration)) {
        localStorage.setItem(this.localStorageUserKey, null);
      }
    }
  }
}
