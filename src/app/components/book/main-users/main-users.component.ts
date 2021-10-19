import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialogRef } from '@angular/material/dialog';

import { BookService } from 'src/app/core/services/book/book.service';
import { UserInfo } from 'src/app/core/models/userInfo';

@Component({
  selector: 'app-main-users',
  templateUrl: './main-users.component.html',
  styleUrls: ['./main-users.component.css']
})
export class MainUsersComponent implements OnInit, OnDestroy {
  @Input() bookId;
  @Input() bookTitle;

  isLoading: Boolean;
  mainUsers: UserInfo[] = [];

  private _destroySubscribes$ = new Subject<void>();

  constructor(public dialogRef: MatDialogRef<MainUsersComponent>, private _scBook: BookService) { }

  ngOnInit() {
    this.isLoading = true;
    this._scBook.getMainUsers(this.bookId)
      .pipe(
        takeUntil(this._destroySubscribes$)
      )
      .subscribe(
        resp => {
          this.isLoading = false;
          const emptyUserInfo = new UserInfo();
          this.mainUsers[0] = !!resp.donor ? resp.donor : emptyUserInfo;
          this.mainUsers[1] = !!resp.facilitator ? resp.facilitator : emptyUserInfo;
          this.mainUsers[2] = !!resp.winner ? resp.winner : emptyUserInfo;
        },
        error => {
          this.isLoading = false;
        }
      );
  }

  ngOnDestroy() {
    this._destroySubscribes$.next();
    this._destroySubscribes$.complete();
  }
}
