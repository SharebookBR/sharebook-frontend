import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LocalDataSource } from 'ng2-smart-table';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';

import { BookService } from '../../../core/services/book/book.service';
import { DonateBookUser } from '../../../core/models/donateBookUser';
import { AlertService } from '../../../core/services/alert/alert.service';


@Component({
  selector: 'app-donate',
  templateUrl: './donate.component.html',
  styleUrls: ['./donate.component.css']
})
export class DonateComponent implements OnInit {
  @Input() bookId;
  donateUsers: LocalDataSource;
  settings: any;
  isLoading: Boolean = true;
  showNote: Boolean = false;
  selectedDonatedUser: any;
  myNote: String;
  formGroup: FormGroup;
  donateBookUser: DonateBookUser;

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
    this._scBook.getGranteeUsersByBookId(this.bookId).subscribe(resp => {
      this.donateUsers = new LocalDataSource(<any>resp);
      this.isLoading = false;
    });

    const btnDonate = '<span class="btn btn-warning btn-sm"> <i class="fa fa-trophy"></i> </span>';

    this.settings = {
      mode: 'inline',
      hideSubHeader: true,
      columns: {
        name: {
          title: 'Nome',
          filter: false
        },
        email: {
          title: 'E-mail',
          filter: false
        }
      },
      actions: {
        delete: false,
        edit: false,
        add: false,
        update: false,
        custom: [
          {
            name: 'donate',
            title: btnDonate,
          }
        ],
        position: 'right', // left|right
      },
    };
  }

  onCustom(event) {
    if (event.action === 'donate') {
      this.selectedDonatedUser = event.data;
      this.showNote = true;
      const foo = {
        myNote: ''
      };
      this.formGroup.setValue(foo);
    }
  }

  onCancelNote() {
    this.showNote = false;
  }

  onDonate() {
    this.donateBookUser = new DonateBookUser();
    this.donateBookUser.userId = this.selectedDonatedUser.id;
    this.donateBookUser.note = this.formGroup.value.myNote;

    this.isLoading = true;

    this._scBook.donateBookUser(this.bookId, this.donateBookUser).subscribe(
      resp => {
        if (!resp.success) {
          this._scAlert.error(resp.messages[0]);
        } else {
          this.activeModal.close('ok');
          this._scAlert.success(resp.successMessage);
        }
        this.isLoading = false;
      },
      error => {
        this.isLoading = false;
        this._scAlert.error(error);
      }
    );
  }

}
