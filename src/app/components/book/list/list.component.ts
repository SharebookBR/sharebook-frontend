import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BookService } from '../../../core/services/book/book.service';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertService } from '../../../core/services/alert/alert.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DonateComponent } from '../donate/donate.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  books: LocalDataSource;
  settings: any;

  constructor(
    private _scBook: BookService,
    private _sanitizer: DomSanitizer,
    private _router: Router,
    private _scAlert: AlertService,
    private _modalService: NgbModal) {
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
    }
    );

    const btnDelete = '<span class="btn btn-danger btn-sm"> <i class="fa fa-trash"></i> </span>';
    const btnEdit = '<span class="btn btn-info btn-sm"> <i class="fa fa-edit"></i> </span>';
    const btnDonate = '<span class="btn btn-warning btn-sm"> <i class="fa fa-book"></i> </span>';

    this.settings = {
      mode: 'inline',
      hideSubHeader: true,
      columns: {
        title: {
          title: 'Titulo',
          filter: false
        },
        author: {
          title: 'Autor',
          filter: false
        },
        donor: {
          title: 'Doador',
          valuePrepareFunction: data => data ? data : '',
          filter: false
        },
        phoneDonor: {
          title: 'Telefone',
          valuePrepareFunction: data => data ? data : '',
          filter: false
        },
        approved: {
          title: 'Visível',
          filter: false,
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
        position: 'right', // left|right
      },
    };
  }

  onSearch(query: string = '') {
    if (!query) {
      this.books.reset();
    } else {
      this.books.setFilter([
        // fields we want to include in the search
        {
          field: 'title',
          search: query
        },
        {
          field: 'author',
          search: query
        },
        {
          field: 'donor',
          search: query
        },
        {
          field: 'phoneDonor',
          search: query
        }
      ], false);
    }
  }

  onCustom(event) {
    if (event.action === 'delete') {
      this._scBook.delete(event.data.id).subscribe(resp => {
        if (resp['success']) {
          this.books.remove(event.data);
          this._scAlert.success('Registro removido com sucesso.');
        }
      });
    } if (event.action === 'donate') {
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
