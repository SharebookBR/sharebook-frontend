import { Component } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { take } from 'rxjs/operators';

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
    private _viewportScroller: ViewportScroller,
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
    this.dismissAndNavigate([path]);
  }

  search(term: string) {
    term = term.trim();
    if (term.length >= 3) {
      this.dismissAndNavigate(['/buscar', term]);
    }
  }

  logout() {
    this._scAuthentication.logout();
    this.dismissAndNavigate(['/']);
  }

  private scrollToTop(): void {
    this._viewportScroller.scrollToPosition([0, 0]);
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }

  private dismissAndNavigate(commands: any[]): void {
    this._bottomSheetRef.dismiss();
    this._bottomSheetRef.afterDismissed().pipe(take(1)).subscribe(() => {
      this._router.navigate(commands).then(() => this.scrollToTop());
    });
  }
}
