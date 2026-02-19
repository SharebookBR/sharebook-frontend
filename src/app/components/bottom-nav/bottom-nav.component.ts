import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { UserService } from '../../core/services/user/user.service';
import { MaisSheetComponent } from '../mais-sheet/mais-sheet.component';

@Component({
  selector: 'app-bottom-nav',
  templateUrl: './bottom-nav.component.html',
  styleUrls: ['./bottom-nav.component.css'],
})
export class BottomNavComponent implements OnInit, OnDestroy {
  userLogged = false;
  private _destroy$ = new Subject<void>();

  constructor(private _scUser: UserService, private _bottomSheet: MatBottomSheet) {
    if (this._scUser.getLoggedUserFromLocalStorage()) {
      this.userLogged = true;
    }
  }

  ngOnInit() {
    this._scUser
      .getLoggedUser()
      .pipe(takeUntil(this._destroy$))
      .subscribe((user) => {
        this.userLogged = !!user;
      });
  }

  openMais() {
    this._bottomSheet.open(MaisSheetComponent);
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
