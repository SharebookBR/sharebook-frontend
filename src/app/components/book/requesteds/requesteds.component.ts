import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { BookService  } from '../../../core/services/book/book.service';
import { BookRequestStatus } from '../../../core/models/BookRequestStatus';

@Component({
  selector: 'app-requesteds',
  templateUrl: './requesteds.component.html',
  styleUrls: ['./requesteds.component.css']
})
export class RequestedsComponent implements OnInit, OnDestroy {

  requestedBooks = new Array<any>();
  tableSettings: any;
  isLoading: boolean;
  private _destroySubscribes$ = new Subject<void>();

  constructor(
    private _bookService: BookService
  ) { }

  ngOnInit() {

    this.isLoading = true;

    this._bookService.getRequestedBooks(1, 9999)
    .pipe(takeUntil(this._destroySubscribes$))
    .subscribe(resp => {
      this.requestedBooks = resp.items;
      this.addBadgeToStatusColumn();
      this.isLoading = false;
    });

    this.tableSettings = {
      columns: {
        title: {
          title: 'Titulo',
          width: '45%'
        },
        author: {
          title: 'Autor',
          width: '30%'
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
        update: false
      },
      attr: {
        class: 'table table-bordered table-hover table-striped'
      },
      noDataMessage: 'Nenhum registro encontrado.'
    };
  }

  public addBadgeToStatusColumn() {
    this.requestedBooks.forEach(book => {
      let badgeColor = '';

      switch (book.status.toUpperCase()) {
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

      book.status = `<span class="badge badge-${badgeColor}">${book.status}</span>`;
    });
  }

  ngOnDestroy() {
    this._destroySubscribes$.next();
    this._destroySubscribes$.complete();
  }
}
