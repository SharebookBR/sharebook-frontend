import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { BookService } from '../../../core/services/book/book.service';
import { BookRequestStatus, getStatusDescription } from '../../../core/models/BookRequestStatus';
import { MyRequest } from 'src/app/core/models/MyRequest';
import { DonorModalComponent } from '../donor-modal/donor-modal.component';

@Component({
  selector: 'app-requesteds',
  templateUrl: './requesteds.component.html',
  styleUrls: ['./requesteds.component.css'],
})
export class RequestedsComponent implements OnInit, OnDestroy {
  requestedBooks$: Observable<MyRequest>;
  tableSettings: any;

  private _destroySubscribes$ = new Subject<void>();

  constructor(private _bookService: BookService, private _modalService: NgbModal) { }

  ngOnInit() {
    this.buscarDados();
    this.inicializarTabela();
  }

  private buscarDados() {
    this.requestedBooks$ = this._bookService.getRequestedBooks(1, 9999)
      .pipe(
        map(requestedBooks => {
          requestedBooks.items.map(item => {
            const badgeColor = this.getBadgeColor(item.status);
            item.statusCode = item.status;
            item.status = this.addBadgeToStatusColumn(badgeColor, item.status);

          });

          return requestedBooks;
        })
      );
  }

  private inicializarTabela() {
    const btnShowUserBookInfo =
      '<span class="btn btn-light btn-sm ml-1 mb-1" data-toggle="tooltip" title="Ver doador">' +
      ' <i class="fa fa-user"></i> </span>';

    this.tableSettings = {
      columns: {
        title: {
          title: 'Titulo',
          width: '45%',
        },
        author: {
          title: 'Autor',
          width: '30%',
        },
        status: {
          title: 'Status',
          width: '25%',
          type: 'html'
        }
      },
      actions: {
        delete: false,
        edit: false,
        add: false,
        update: false,
        columnTitle: 'Doador',
        custom: [
          {
            name: 'showUserBookInfo',
            title: btnShowUserBookInfo,
          }
        ],
        position: 'right'
      },
      attr: {
        class: 'table table-bordered table-hover table-striped',
      },
      noDataMessage: 'Nenhum registro encontrado.',
    };
  }

  private getBadgeColor(status: string): string {
    let badgeColor = '';
    switch (status) {
      case BookRequestStatus.DONATED:
        badgeColor = 'success';
        break;
      case BookRequestStatus.REFUSED:
        badgeColor = 'danger';
        break;
      default:
        badgeColor = 'light';
        break;
    }
    return badgeColor;
  }

  private addBadgeToStatusColumn(badgeColor: string, itemStatus): string {
    return `<span class="badge badge-${badgeColor}">${getStatusDescription(itemStatus)}</span>`;
  }

  onCustomActionColum(event) {

    if (event.data.statusCode === BookRequestStatus.AWAITING_ACTION) {
      alert('Por favor aguarde a decisão do doador.');
      return;
    }

    if (event.data.statusCode === BookRequestStatus.REFUSED) {
      alert('Você não é o ganhador desse livro. =/');
      return;
    }

    const modalRef = this._modalService.open(DonorModalComponent, {
      backdropClass: 'light-blue-backdrop',
      centered: true,
    });

    modalRef.componentInstance.bookId = event.data.bookId;
    modalRef.componentInstance.bookTitle = event.data.title;
  }

  ngOnDestroy() {
    this._destroySubscribes$.next();
    this._destroySubscribes$.complete();
  }
}
