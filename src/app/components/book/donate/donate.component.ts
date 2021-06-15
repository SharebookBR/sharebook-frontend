import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { BookService } from '../../../core/services/book/book.service';
import { DonateBookUser } from '../../../core/models/donateBookUser';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-donate',
  templateUrl: './donate.component.html',
  styleUrls: ['./donate.component.css']
})
export class DonateComponent implements OnInit, OnDestroy {
  @Input() bookId;
  @Input() userId;
  @Input() userNickName;

  // donateUsers: LocalDataSource;
  donateUsers;
  settings: any;
  isLoading: Boolean = true;
  myNote: String;
  formGroup: FormGroup;
  donateBookUser: DonateBookUser;

  private _destroySubscribes$ = new Subject<void>();

  constructor(
    public dialogRef: MatDialogRef<DonateComponent>,
    private _scBook: BookService,
    private _toastr: ToastrService,
    private _formBuilder: FormBuilder
  ) {
    this.formGroup = _formBuilder.group({
      myNote: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    const foo = {
      myNote: ''
    };
    this.formGroup.setValue(foo);
    this.isLoading = false;
  }

  onDonate() {
    this.donateBookUser = new DonateBookUser();
    this.donateBookUser.userId = this.userId;
    this.donateBookUser.note = this.formGroup.value.myNote;

    this.isLoading = true;

    this._scBook.donateBookUser(this.bookId, this.donateBookUser)
      .pipe(
        takeUntil(this._destroySubscribes$)
      )
      .subscribe(
        resp => {
          if (!resp.success) {
            this._toastr.error(resp.messages[0]);
          } else {
            this.dialogRef.close(true);
            this._toastr.success(resp.successMessage);
          }
          this.isLoading = false;
        },
        error => {
          this.isLoading = false;
          this._toastr.error(error);
        }
      );
  }

  ngOnDestroy() {
    this._destroySubscribes$.next();
    this._destroySubscribes$.complete();
  }
}
