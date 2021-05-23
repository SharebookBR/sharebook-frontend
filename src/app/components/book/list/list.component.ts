import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

//import { LocalDataSource } from 'ng2-smart-table';
import { BookService } from '../../../core/services/book/book.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationDialogService } from './../../../core/services/confirmation-dialog/confirmation-dialog.service';
import { BookDonationStatus } from './../../../core/models/BookDonationStatus';
import { FacilitatorNotesComponent } from '../facilitator-notes/facilitator-notes.component';
import { TrackingComponent } from '../tracking/tracking.component';
import { MainUsersComponent } from '../main-users/main-users.component';
import { BookRequestStatus } from 'src/app/core/models/BookRequestStatus';
import { getStatusDescription } from 'src/app/core/utils/getStatusDescription';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit, OnDestroy {
  //books: LocalDataSource;
  books;
  settings: any;
  myBookArray = Array();
  isLoading: boolean;

  private _destroySubscribes$ = new Subject<void>();

  constructor(
    private _scBook: BookService,
    private _sanitizer: DomSanitizer,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _toastr: ToastrService,
    private _modalService: NgbModal,
    private confirmationDialogService: ConfirmationDialogService
  ) {}

  getHtmlForCell(value: string, row: any) {
    switch (row.status) {
      case BookDonationStatus.AVAILABLE:
      case BookDonationStatus.RECEIVED:
        return '<font color="green">' + value + '</font>';
      case BookDonationStatus.CANCELED:
      case BookDonationStatus.WAITING_DECISION:
        return '<font color="red">' + value + '</font>';
      default:
        return '<font>' + value + '</font>';
    }
  }

  getAllBooks() {
    this.isLoading = true;

    this._scBook
      .getAll()
      .pipe(takeUntil(this._destroySubscribes$))
      .subscribe((resp) => {
        this.myBookArray = new Array();
        resp['items'].forEach((items) => {
          this.myBookArray.push({
            id: items.id,
            creationDate: items.creationDate,
            chooseDate: items.chooseDate,
            bookTitle: items.title,
            title:
              items.title +
              '<br>' +
              items.author +
              '<br>' +
              items.totalInterested +
              ' interessado(s)<br>' +
              items.daysInShowcase +
              ' dia(s) na vitrine',
            users:
              items.donor +
              '<br>' +
              (!!items.winner ? items.winner : '') +
              '<br>' +
              (!!items.facilitator ? items.facilitator : ''),
            status: items.status,
            donated: items.donated,
            slug: items.slug,
            facilitatorNotes: !!items.facilitatorNotes
              ? items.facilitatorNotes
              : '',
            trackingNumber: !!items.trackingNumber ? items.trackingNumber : '',
          });
        });
        this.books.load(this.myBookArray);
        this.isLoading = false;
      });
  }

  ngOnInit() {
    this.getAllBooks();
    //this.books = new LocalDataSource(this.myBookArray);
    //this.books.setSort([{ field: 'creationDate', direction: 'desc' }]);

    // Carrega Status do ENUM BookDonationStatus
    const myBookDonationStatus = new Array();
    Object.keys(BookDonationStatus).forEach((key) => {
      myBookDonationStatus.push({
        value: BookDonationStatus[key],
        title: BookDonationStatus[key],
      });
    });

    const btnEdit =
      '<span class="btn btn-primary btn-sm ml-1 mb-1" data-toggle="tooltip" title="Editar Livro">' +
      ' <i class="fa fa-edit"></i> </span>';
    const btnCancelDonation =
      '<span class="btn btn-danger btn-sm ml-1 mb-1" data-toggle="tooltip" title="Cancelar Doação">' +
      ' <i class="fa fa-trash"></i> </span>';
    const btnDonate =
      '<span class="btn btn-warning btn-sm ml-1 mb-1" data-toggle="tooltip" title="Ver lista de interessados">' +
      ' <i class="fa fa-list"></i> </span>';
    const btnFacilitatorNotes =
      '<span class="btn btn-info btn-sm ml-1 mb-1" data-toggle="tooltip" title="Informar Comentários">' +
      ' <i class="fa fa-sticky-note"></i> </span>';
    const btnTrackNumber =
      '<span class="btn btn-secondary btn-sm ml-1 mb-1" data-toggle="tooltip" title="Informar Código Rastreio">' +
      ' <i class="fa fa-truck"></i> </span>';
    const btnShowUsersInfo =
      '<span class="btn btn-light btn-sm ml-1 mb-1" data-toggle="tooltip" title="Informações de Usuários">' +
      ' <i class="fa fa-users"></i> </span>';

    this.settings = {
      columns: {
        creationDate: {
          title: 'Inclusão',
          type: 'html',
          valuePrepareFunction: (cell, row) => {
            return this.getHtmlForCell(
              new DatePipe('en-US').transform(cell, 'dd/MM/yyyy'),
              row
            );
          },
          width: '10%',
        },
        chooseDate: {
          title: 'Escolha',
          type: 'html',
          valuePrepareFunction: (cell, row) => {
            return this.getHtmlForCell(
              new DatePipe('en-US').transform(cell, 'dd/MM/yyyy'),
              row
            );
          },
          width: '10%',
        },
        title: {
          title: 'Título / Autor / Total Interessados / Dias na Vitrine',
          type: 'html',
          valuePrepareFunction: (cell, row) => {
            return this.getHtmlForCell(cell, row);
          },
          width: '28%',
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
            return this.getHtmlForCell(getStatusDescription(row.status), row);
          },
          filter: {
            type: 'list',
            config: {
              selectText: 'Selecionar...',
              list: myBookDonationStatus,
            },
          },
          width: '10%',
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
            title: btnEdit,
          },
          {
            name: 'CancelDonation',
            title: btnCancelDonation,
          },
          {
            name: 'donate',
            title: btnDonate,
          },
          {
            name: 'FacilitatorNotes',
            title: btnFacilitatorNotes,
          },
          {
            name: 'trackNumber',
            title: btnTrackNumber,
          },
          {
            name: 'showUsersInfo',
            title: btnShowUsersInfo,
          },
        ],
        position: 'right', // left|right
      },
      attr: {
        class: 'table table-bordered',
      },
    };
  }

  onCustom(event) {
    switch (event.action) {
      case 'CancelDonation': {
        // chamada do modal de confirmação antes de efetuar a ação do btnCancelDonation
        if (
          event.data.status === BookDonationStatus.RECEIVED ||
          event.data.status === BookDonationStatus.CANCELED
        ) {
          alert(
            `Não é possível cancelar essa doação com status = ${event.data.status}`
          );
          return;
        }
        this.confirmationDialogService
          .confirm('Atenção!', 'Confirma o cancelamento da doação?')
          .then((confirmed) => {
            if (confirmed) {
              this._scBook
                .cancelDonation(event.data.id)
                .pipe(takeUntil(this._destroySubscribes$))
                .subscribe((resp) => {
                  if (resp['success']) {
                    this._toastr.success('Doação cancelada com sucesso.');
                    this.reloadData();
                  }
                });
            }
          });

        break;
      }
      case 'donate': {

        this._router.navigate([`book/donate/${event.data.slug}`], {
          queryParams: {
            returnUrl: this._activatedRoute.snapshot.url.join('/'),
          },
        });

        break;
      }
      case 'edit': {
        this._router.navigate([`book/form/${event.data.id}`]);
        break;
      }
      case 'FacilitatorNotes': {
        const modalRef = this._modalService.open(FacilitatorNotesComponent, {
          backdropClass: 'light-blue-backdrop',
          centered: true,
        });

        modalRef.result.then(
          (result) => {
            if (result === 'Success') {
              this.reloadData();
            }
          },
          (reason) => {
            if (reason === 'Success') {
              this.reloadData();
            }
          }
        );

        modalRef.componentInstance.bookId = event.data.id;
        modalRef.componentInstance.bookTitle = event.data.bookTitle;
        modalRef.componentInstance.facilitatorNotes =
          event.data.facilitatorNotes;
        break;
      }
      case 'trackNumber': {
        if (
          event.data.status !== BookDonationStatus.WAITING_SEND &&
          event.data.status !== BookDonationStatus.SENT
        ) {
          alert(
            `Não é possível informar código de rastreio. \nstatus requerido = ${BookDonationStatus.WAITING_SEND} ou` +
              `${BookDonationStatus.SENT}\nstatus atual = ${event.data.status}`
          );
          return;
        }

        const modalRef = this._modalService.open(TrackingComponent, {
          backdropClass: 'light-blue-backdrop',
          centered: true,
        });

        modalRef.result.then(
          (result) => {
            if (result === 'Success') {
              this.reloadData();
            }
          },
          (reason) => {
            if (reason === 'Success') {
              this.reloadData();
            }
          }
        );

        modalRef.componentInstance.bookId = event.data.id;
        modalRef.componentInstance.bookTitle = event.data.bookTitle;
        modalRef.componentInstance.trackingNumber = event.data.trackingNumber;

        break;
      }
      case 'showUsersInfo': {
        const modalRef = this._modalService.open(MainUsersComponent, {
          backdropClass: 'light-blue-backdrop',
          centered: true,
        });

        modalRef.result.then(
          (result) => {
            if (result === 'Success') {
              this.reloadData();
            }
          },
          (reason) => {
            if (reason === 'Success') {
              this.reloadData();
            }
          }
        );

        modalRef.componentInstance.bookId = event.data.id;
        modalRef.componentInstance.bookTitle = event.data.bookTitle;
        break;
      }
    }
  }

  reloadData() {
    this.getAllBooks();
    this.books.refresh();
  }

  ngOnDestroy() {
    this._destroySubscribes$.next();
    this._destroySubscribes$.complete();
  }
}
