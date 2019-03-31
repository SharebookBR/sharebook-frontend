import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LocalDataSource } from 'ng2-smart-table';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';

import { BookService } from '../../../core/services/book/book.service';
import { DonateBookUser } from '../../../core/models/donateBookUser';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-donate',
  templateUrl: './donate.component.html',
  styleUrls: ['./donate.component.css']
})
export class DonateComponent implements OnInit {

  @Input() bookId;
  @Input() userId;
  @Input() userNickName;

  donateUsers: LocalDataSource;
  settings: any;
  isLoading: Boolean = true;
  myNote: String;
  formGroup: FormGroup;
  donateBookUser: DonateBookUser;

  constructor(
    public activeModal: NgbActiveModal,
    private _scBook: BookService,
    private _toastr: ToastrService,
    private _formBuilder: FormBuilder) {

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

    this._scBook.donateBookUser(this.bookId, this.donateBookUser).subscribe(
      resp => {
        if (!resp.success) {
          this._toastr.error(resp.messages[0]);
        } else {
          this.activeModal.close('ok');
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

}
