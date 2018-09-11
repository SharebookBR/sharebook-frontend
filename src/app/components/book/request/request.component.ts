import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LocalDataSource } from 'ng2-smart-table';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';

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
  donateUsers: LocalDataSource;
  settings: any;
  isLoading: Boolean = true;
  showNote: Boolean = false;
  selectedDonatedUser: any;
  myNote: String;
  formGroup: FormGroup;
  donateBookUser: DonateBookUser;

  state = 'loading'; // loading, form, error
  lastError: string;

  constructor(
    public activeModal: NgbActiveModal,
    private _scBook: BookService,
    private _scAlert: AlertService,
    private _formBuilder: FormBuilder) {

    this.formGroup = _formBuilder.group({
      myNote: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.state = 'form';
  }

  onRequest() {

    this.state = 'loading';

    // TODO: call API

    this.lastError = 'Ocorreu um erro ao solicitar. xpto';
    this.state = 'request-success';

    // this._scBook.requestBook(this.bookId).subscribe(resp => {
    //   this.pageTitle = 'Aguarde a aprovação da doação!';
    //   this.isLoading = false;
    //   if (resp.success) {
    //     // this._scAlert.success(resp.successMessage, true);
    //     this.isSaved = true;
    //   } else {
    //     this._scAlert.error(resp.messages[0]);
    //   }
    // },
    //   error => {
    //     this._scAlert.error(error);
    //   }
    // );

  }

}
