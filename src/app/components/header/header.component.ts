import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';

import { User } from '../../core/models/user';
import { UserService } from '../../core/services/user/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  // variavel para selecionar o div do menu via DOM
  @ViewChild('menu') menu: ElementRef;

  private _subscription: Subscription;

  userLogged = false;
  shareBookUser = new User();

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
  }

  /* metodo que verifica se o menu tem classe show e a remove em caso possitivo
  metodo é chamado ao click de cada link do menu */
  showHideMenu() {
    if (this.menu.nativeElement.classList.contains('show')) {
      this.menu.nativeElement.classList.remove('show');
    }
  }
}
