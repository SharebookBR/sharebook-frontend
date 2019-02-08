import { MenuNavigation } from './../../../core/models/menu-navigation.model';
import { AuthenticationService } from './../../../core/services/authentication/authentication.service';
import { User } from 'src/app/core/models/user';
import { Subscription } from 'rxjs';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserService } from 'src/app/core/services/user/user.service';
import { MenuNavigationService } from 'src/app/core/services/menu-navigation/menu-navigation.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  // variavel apra selecionar o menu via DOM
  @ViewChild('menu') menu: ElementRef;

  private _subscription: Subscription;

  public userLogged = false;
  public shareBookUser = new User();
  public mainMenuNavigations: MenuNavigation[] = [];

  constructor(
    private _scUser: UserService,
    private _scAuthentication: AuthenticationService,
    private _mainMenuNavigation: MenuNavigationService
  ) {
    this._scAuthentication.checkTokenValidity();
    // if has shareBookUser, set value to variables
    if (this._scUser.getLoggedUserFromLocalStorage()) {
      this.shareBookUser = this._scUser.getLoggedUserFromLocalStorage();
      this.userLogged = true;
    }
  }

  ngOnInit() {
    this.mainMenuNavigations = this._mainMenuNavigation.getMainMenuNavigation();
    console.log(this.mainMenuNavigations);
    this._subscription = this._scUser.getLoggedUser().subscribe(shareBookUser => {
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

}
