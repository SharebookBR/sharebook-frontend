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
  myBookArray = Array();
  isLoading: boolean;

  constructor(
    private _scBook: BookService,
    private _sanitizer: DomSanitizer,
    private _router: Router,
    private _scAlert: AlertService,
    private _modalService: NgbModal,
    private confirmationDialogService: ConfirmationDialogService) {
  }

  getHtmlForCell(value: string, row: any) {
    if (!!row.donated) {
      return '<font color="green">' + value + '</font>';
    } else if (!!row.chooseDate) {
      // Coloca o chooseDate para as 23:59:59 do dia da escolha
      const myChooseDate = new Date(new Date(row.chooseDate).getFullYear(),
                                    new Date(row.chooseDate).getMonth(),
                                    new Date(row.chooseDate).getDate(),
                                    23, 39, 59, 59);
      // Coloca o today para as 23:59:59 do dia
      const myTodayDate  = new Date(new Date().getFullYear(),
                                    new Date().getMonth(),
                                    new Date().getDate(),
                                    23, 39, 59, 59);
      if (myChooseDate.getTime() < myTodayDate.getTime()) {
        return '<font color="red">' + value + '</font>';
      } else if (myChooseDate.getTime() === myTodayDate.getTime()) {
        return '<font color="orange">' + value + '</font>';
      } else {
        return '<font>' + value + '</font>';
      }
    } else {
      return '<font>' + value + '</font>';
    }
  }

  getAllBooks() {

    this.isLoading = true;

    this._scBook.getAll().subscribe(resp => {
      this.myBookArray = new Array();
      resp['items'].forEach(items => {
        this.myBookArray.push({
          id: items.id,
          creationDate: items.creationDate,
          chooseDate:   items.chooseDate,
          title: items.title  + '<br>' +
                 items.author + '<br>' +
                 items.totalInterested + ' interessado(s)<br>' +
                 items.daysInShowcase + ' dia(s) na vitrine',
          users: items.donor  + '<br>' +
                 (!!items.winner ? items.winner : '') + '<br>' +
                 (!!items.facilitator ? items.facilitator : ''),
          status: items.status,
          donated: items.donated
        });
      });
      this.books = new LocalDataSource(this.myBookArray);
      this.books.setSort([{field: 'creationDate', direction: 'desc'}]);
      this.isLoading = false;
    }
    );
  }

  ngOnInit() {
    this.getAllBooks();

    // Carrega Status do ENUM BookDonationStatus
    const myBookDonationStatus = new Array();
    Object.keys(BookDonationStatus).forEach(key => {
      myBookDonationStatus.push({value: BookDonationStatus[key], title: BookDonationStatus[key]});
    });

    const btnDelete = '<span class="btn btn-danger btn-sm" data-toggle="tooltip" title="Eliminar Livro">' +
                      ' <i class="fa fa-trash"></i> </span>&nbsp;';
    const btnEdit   = '<span class="btn btn-info btn-sm" data-toggle="tooltip" title="Editar Livro">' +
                      ' <i class="fa fa-edit"></i> </span>&nbsp;';
    const btnDonate = '<span class="btn btn-warning btn-sm" data-toggle="tooltip" title="Escolher Donatário">' +
                      ' <i class="fa fa-book"></i> </span>&nbsp;';

    this.settings = {
      columns: {
        creationDate: {
          title: 'Inclusão',
          type: 'html',
          valuePrepareFunction: (cell, row) => {
            return this.getHtmlForCell(new DatePipe('en-US').transform(cell, 'dd/MM/yyyy'), row);
          },
          width: '10%'
        },
        chooseDate: {
          title: 'Escolha',
          type: 'html',
          valuePrepareFunction: (cell, row) => {
            return this.getHtmlForCell(new DatePipe('en-US').transform(cell, 'dd/MM/yyyy'), row);
          },
          width: '10%'
        },
        title: {
          title: 'Título / Autor / Total Interessados / Dias na Vitrine',
          type: 'html',
          valuePrepareFunction: (cell, row) => {
            return this.getHtmlForCell(cell, row);
          },
          width: '30%',
        },
        users: {
          title: 'Doador / Donatário / Facilitador',
          type: 'html',
          valuePrepareFunction: (cell, row) => {
            return this.getHtmlForCell(cell, row);
          },
          width: '28%',
        },
        status: {
          title: 'Status',
          type: 'html',
          valuePrepareFunction: (cell, row) => {
            return this.getHtmlForCell(cell, row);
          },
          filter: {
            type: 'list',
            config: {
              selectText: 'Selecionar...',
              list: myBookDonationStatus,
            },
          },
          width: '10%'
        },
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
      if (event.data.donated) {
        alert('Livro já doado!');
      } else {
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
        }
    } else if (event.action === 'donate') {
      if (event.data.donated) {
        alert('Livro já doado!');
      } else {
        const modalRef = this._modalService.open(DonateComponent, { backdropClass: 'light-blue-backdrop', centered: true });
        modalRef.componentInstance.bookId = event.data.id;

        modalRef.result.then((data) => {
          if (data === 'ok') {
            this.reloadData();
          }
        });
      }
    } else {
      this._router.navigate([`book/form/${event.data.id}`]);
    }
  }

  reloadData() {
    this.getAllBooks();
    this.books.refresh();
  }
}
