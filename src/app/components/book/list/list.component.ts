import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BookService } from '../../../core/services/book/book.service';
import { Book } from '../../../core/models/book';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  books: LocalDataSource;
  settings: any;

  constructor(private _scBook: BookService) {
  }

  ngOnInit() {
    this._scBook.getAll().subscribe(resp =>
      this.books =  new LocalDataSource(resp['items'])
    );

    this.settings = {
      columns: {
        title: {
          title: 'Titulo',
          filter: false
        },
        author: {
          title: 'Autor',
          filter: false
        },
        name: {
          title: 'Doador',
          filter: false
        },
        phone: {
          title: 'Telefone',
          filter: false
        },
        approved: {
          title: 'Status',
          filter: false
        }
      },
      actions: {
        delete: false,
        edit: false,
        add: false,
        custom: [
          {
            name: 'edit',
            title: '<span>Editar </span>',
          },
          {
            name: 'delete',
            title: '<span>Deletar </span>',
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
          field: 'name',
          search: query
        },
        {
          field: 'phone',
          search: query
        }
      ], false);
    }
  }

  onCustom(event) {
    if (event.action === 'delete') {
      this._scBook.delete(event.data.id);
    } else {
      console.log('teste');
    }
  }
}
