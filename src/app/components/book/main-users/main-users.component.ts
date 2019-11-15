import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { BookService } from 'src/app/core/services/book/book.service';
import { UserInfo } from 'src/app/core/models/userInfo';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

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

  constructor(public activeModal: NgbActiveModal, private _scBook: BookService) {}

  ngOnInit() {
    this.isLoading = true;
    this._scBook.getMainUsers(this.bookId)
    .pipe(
      takeUntil(this._destroySubscribes$)
    )
    .subscribe(
      resp => {
        this.isLoading = false;

        this.mainUsers[0] = !!resp.donor ? resp.donor : '';
        this.mainUsers[1] = !!resp.facilitator ? resp.facilitator : '';
        this.mainUsers[2] = !!resp.winner ? resp.winner : '';
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
