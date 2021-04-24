import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { BookService } from 'src/app/core/services/book/book.service';
import { UserInfo } from 'src/app/core/models/userInfo';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-winner-users',
  templateUrl: './winner-users.component.html',
  styleUrls: ['./winner-users.component.css']
})
export class WinnerUsersComponent implements OnInit, OnDestroy {
  @Input() bookId;
  @Input() bookTitle;

  isLoading: Boolean;
  winnerUsers: UserInfo[] = [];

  private _destroySubscribes$ = new Subject<void>();

  constructor(public activeModal: NgbActiveModal, private _scBook: BookService) { }

  ngOnInit() {
    this.isLoading = true;
    this._scBook.getMainUsers(this.bookId)
      .pipe(
        takeUntil(this._destroySubscribes$)
      )
      .subscribe(
        resp => {
          this.isLoading = false;
          this.winnerUsers[0] = !!resp.winner ? resp.winner : '';
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
