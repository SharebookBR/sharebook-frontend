import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
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
  private _sheetRef: MatBottomSheetRef<MaisSheetComponent> | null = null;

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
    if (this._sheetRef) {
      this._sheetRef.dismiss();
      return;
    }

    this._sheetRef = this._bottomSheet.open(MaisSheetComponent);
    this._sheetRef.afterDismissed().subscribe(() => {
      this._sheetRef = null;
    });
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
