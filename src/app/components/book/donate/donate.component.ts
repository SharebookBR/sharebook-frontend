import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LocalDataSource } from 'ng2-smart-table';

import { BookService } from '../../../core/services/book/book.service';


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

  constructor(
    public activeModal: NgbActiveModal,
    private _scBook: BookService) {
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
        },
        /*linkedin: {
          title: 'LinkedIn',
          filter: false
        },
        phone: {
          title: 'Telefone',
          valuePrepareFunction: data => data ? data.phone : '',
          filter: false
        },
        postalCode: {
          title: 'Cep',
          filter: false
        }*/
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
      console.log(event.data.name);
    }
  }

}
