import { Component } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';

import { UserService } from '../../core/services/user/user.service';
import { AuthenticationService } from '../../core/services/authentication/authentication.service';

@Component({
  selector: 'app-mais-sheet',
  templateUrl: './mais-sheet.component.html',
  styleUrls: ['./mais-sheet.component.css'],
})
export class MaisSheetComponent {
  userLogged = false;
  userName = '';

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<MaisSheetComponent>,
    private _router: Router,
    private _scUser: UserService,
    private _scAuthentication: AuthenticationService
  ) {
    const user = this._scUser.getLoggedUserFromLocalStorage();
    if (user) {
      this.userLogged = true;
      this.userName = user.name;
    }
  }

  navigate(path: string) {
    this._router.navigate([path]);
    this._bottomSheetRef.dismiss();
  }

  search(term: string) {
    term = term.trim();
    if (term.length >= 3) {
      this._router.navigate(['/buscar', term]);
      this._bottomSheetRef.dismiss();
    }
  }

  logout() {
    this._scAuthentication.logout();
    this._bottomSheetRef.dismiss();
    this._router.navigate(['/']);
  }
}
