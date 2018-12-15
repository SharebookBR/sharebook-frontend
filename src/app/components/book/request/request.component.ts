import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';

import { UserService } from '../../../core/services/user/user.service';
import { BookService } from '../../../core/services/book/book.service';
import { DonateBookUser } from '../../../core/models/donateBookUser';
import { AlertService } from '../../../core/services/alert/alert.service';


@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent implements OnInit {
  @Input() bookId;
  @Input() bookChooseDate;
  donateUsers: LocalDataSource;
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
  chooseDate: Date;
  modalTitle: String;

  state = 'loading'; // loading, form, error
  lastError: string;

  constructor(
    public activeModal: NgbActiveModal,
    private _scBook: BookService,
    private _scUser: UserService,
    private _router: Router,
    private _scAlert: AlertService,
    private _formBuilder: FormBuilder) {

    this.formGroup = _formBuilder.group({
      myNote: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.state = 'form';
    this.modalTitle = 'Quanto você quer esse livro?';

    this._scUser.getUserData().subscribe(updateUserVM => {
      this.addressLine01 = updateUserVM.address.street + ',' + updateUserVM.address.number + ' ' +
        ((!updateUserVM.address.complement) ? '' : updateUserVM.address.complement);
      this.addressLine02 = updateUserVM.address.neighborhood + ' - ' + updateUserVM.address.city + ' - ' + updateUserVM.address.state;
      this.addressLine03 = 'CEP: ' + updateUserVM.address.postalCode + ' - ' + updateUserVM.address.country;

      this.chooseDate = new Date(this.bookChooseDate);
      this.chooseDate.setDate(this.chooseDate.getDate());
    });
  }

  onRequest() {

    this.state = 'loading';
    const reason = this.formGroup.value.myNote;
    this._scBook.requestBook(this.bookId, reason).subscribe(resp => {

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

}
