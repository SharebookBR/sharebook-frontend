import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { UserService } from '../../../core/services/user/user.service';
import { BookService } from '../../../core/services/book/book.service';
import { DonateBookUser } from '../../../core/models/donateBookUser';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent implements OnInit, OnDestroy {
  @Input() bookId;
  donateUsers;
  settings: any;
  isLoading: Boolean = true;
  showNote: Boolean = false;
  selectedDonatedUser: any;
  myNote: String;
  formGroup: FormGroup;
  donateBookUser: DonateBookUser;
  addressLine01: String;
  addressLine02: String;
  addressLine03: String;
  modalTitle: String;

  state = 'loading'; // loading, form, error
  lastError: string;

  private _destroySubscribes$ = new Subject<void>();

  constructor(
    public dialogRef: MatDialogRef<RequestComponent>,
    private _scBook: BookService,
    private _scUser: UserService,
    private _router: Router,
    private _toastr: ToastrService,
    private _formBuilder: FormBuilder
  ) {
    this.formGroup = _formBuilder.group({
      myNote: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.state = 'form';
    this.modalTitle = 'Quanto você quer esse livro?';

    this._scUser.getUserData()
      .pipe(
        takeUntil(this._destroySubscribes$)
      )
      .subscribe(userInfo => {
        this.addressLine01 =
          userInfo.address.street +
          ',' +
          userInfo.address.number +
          ' ' +
          (!userInfo.address.complement ? '' : userInfo.address.complement);
        this.addressLine02 =
          userInfo.address.neighborhood + ' - ' + userInfo.address.city + ' - ' + userInfo.address.state;
        this.addressLine03 = 'CEP: ' + userInfo.address.postalCode + ' - ' + userInfo.address.country;
      });
  }

  onRequest() {
    this.state = 'loading';
    const reason = this.formGroup.value.myNote;
    this._scBook.requestBook(this.bookId, reason)
      .pipe(
        takeUntil(this._destroySubscribes$)
      )
      .subscribe(
        resp => {
          if (resp.success) {
            this.state = 'request-success';
            this.modalTitle = 'Pedido enviado. Leia tudo com atenção.';
          } else {
            this.lastError = resp.messages[0];
            this.state = 'request-error';
            this.modalTitle = 'Desculpa o incoveniente. Tivemos algum erro.';
          }
        },
        error => {
          this.lastError = error;
          this.state = 'request-error';
          this.modalTitle = 'Desculpa o incoveniente. Tivemos algum erro.';
        }
      );
  }

  updateAddress() {
    this._router.navigate(['/account']);
  }

  ngOnDestroy() {
    this._destroySubscribes$.next();
    this._destroySubscribes$.complete();
  }
}
