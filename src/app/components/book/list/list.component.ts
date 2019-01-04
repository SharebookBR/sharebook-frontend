import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BookService } from '../../../core/services/book/book.service';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertService } from '../../../core/services/alert/alert.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DonateComponent } from '../donate/donate.component';
import { ConfirmationDialogService } from './../../../core/services/confirmation-dialog/confirmation-dialog.service';
import { DatePipe } from '@angular/common';
import { BookDonationStatus } from './../../../core/models/BookDonationStatus';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  books: LocalDataSource;
  settings: any;

  constructor(
    private _scBook: BookService,
    private _sanitizer: DomSanitizer,
    private _router: Router,
    private _scAlert: AlertService,
    private _modalService: NgbModal,
    private confirmationDialogService: ConfirmationDialogService) {
  }

  getCheckBoxTable(value: boolean = false) {
    if (value) {
      return '<input type="checkbox" disabled checked>';
    } else {
      return '<input type="checkbox" disabled>';
    }
  }

  ngOnInit() {
    this._scBook.getAll().subscribe(resp => {
      this.books = new LocalDataSource(resp['items']);
      this.books.setSort([{field: 'creationDate', direction: 'desc'}]);
    }
    );

    // Carrega Status do ENUM BookDonationStatus
    const myBookDonationStatus = new Array();
    Object.keys(BookDonationStatus).forEach(key => {
      myBookDonationStatus.push({value: BookDonationStatus[key], title: BookDonationStatus[key]});
    });

    const btnDelete = '<span class="btn btn-danger btn-sm"> <i class="fa fa-trash"></i> </span>';
    const btnEdit = '<span class="btn btn-info btn-sm"> <i class="fa fa-edit"></i> </span>';
    const btnDonate = '<span class="btn btn-warning btn-sm"> <i class="fa fa-book"></i> </span>';

    this.settings = {
      columns: {
        creationDate: {
          title: 'Inclusão',
          valuePrepareFunction: data => data ? new DatePipe('en-US').transform(data, 'dd/MM/yyyy') : '',
          width: '10%'
        },
        title: {
          title: 'Titulo',
          width: '20%'
        },
        author: {
          title: 'Autor',
          width: '10%'
        },
        donor: {
          title: 'Doador',
          valuePrepareFunction: data => data ? data : '',
          width: '10%'
        },
        phoneDonor: {
          title: 'Telefone',
          valuePrepareFunction: data => data ? data : '',
          width: '13%'
        },
        facilitator: {
          title: 'Facilitador',
          valuePrepareFunction: data => data ? data : '',
          width: '10%'
        },
        status: {
          title: 'Status',
          filter: {
            type: 'list',
            config: {
              selectText: 'Selecionar...',
              list: myBookDonationStatus,
            },
          },
          width: '10%'
        },
        approved: {
          title: 'Visível',
          width: '5%',
          filter: {
            type: 'checkbox',
            config: {
              true: 'true',
              false: 'false',
              resetText: 'limpar',
            },
          },
          type: 'html',
          valuePrepareFunction: value =>
            this._sanitizer.bypassSecurityTrustHtml(this.getCheckBoxTable(value)),
        }
      },
      actions: {
        delete: false,
        edit: false,
        add: false,
        update: false,
        custom: [
          {
            name: 'edit',
            title: btnEdit
          },
          {
            name: 'delete',
            title: btnDelete
          },
          {
            name: 'donate',
            title: btnDonate
          },
        ],
        position: 'right' // left|right
      },
      attr: {
        class: 'table table-bordered'
      }
    };
  }

  onCustom(event) {
    if (event.action === 'delete') {
      // chamada do modal de confirmação antes de efetuar a ação do delete
      this.confirmationDialogService.confirm('Atenção!', 'Confirma a exclusão do Livro?')
        .then((confirmed) => {
          if (confirmed) {
            this._scBook.delete(event.data.id).subscribe(resp => {
              if (resp['success']) {
                this.books.remove(event.data);
                this._scAlert.success('Registro removido com sucesso.');
              }
            });
          }
        });
    } else if (event.action === 'donate') {
      if (event.data.donated) {
        alert('Livro já doado!');
      } else {
        const modalRef = this._modalService.open(DonateComponent, { backdropClass: 'light-blue-backdrop', centered: true });
        modalRef.componentInstance.bookId = event.data.id;
      }
    } else {
      this._router.navigate([`book/form/${event.data.id}`]);
    }
  }
}
