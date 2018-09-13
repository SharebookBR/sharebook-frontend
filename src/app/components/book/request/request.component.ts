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
    let reason = this.formGroup.value.myNote;
    this._scBook.requestBook(this.bookId, reason).subscribe(resp => {

      if (resp.success) {
        this.state = 'request-success';
      } else {
        this.lastError = resp.messages[0];
        this.state = 'request-error';
      }
    },
      error => {
        this.lastError = error;
        this.state = 'request-error';
      }
    );

  }

}
