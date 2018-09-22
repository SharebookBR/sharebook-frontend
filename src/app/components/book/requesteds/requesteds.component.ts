import { Component, OnInit } from '@angular/core';
import { BookService  } from '../../../core/services/book/book.service';
import { BookRequestStatus } from '../../../core/models/BookRequestStatus';

@Component({
  selector: 'app-requesteds',
  templateUrl: './requesteds.component.html',
  styleUrls: ['./requesteds.component.css']
})
export class RequestedsComponent implements OnInit {

  requestedBooks = new Array<any>();
  tableSettings: any;

  constructor(
    private bookService: BookService
  ) { }

  ngOnInit() {
    this.bookService.getRequestedBooks().subscribe(resp => {
      this.requestedBooks = resp;
      this.addBadgeToStatusColumn();
    });

    this.tableSettings = {
      columns: {
        title: {
          title: 'Titulo',
          width: '45%'
        },
        author: {
          title: 'Author',
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
}
