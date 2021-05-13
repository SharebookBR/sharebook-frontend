import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { BookService } from '../../core/services/book/book.service';
import { Book } from '../../core/models/book';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  public availableBooks: Book[] = [];
  public random15NewBooks: Book[] = [];
  public hasBook: Boolean = true;
  public hasEbook: Boolean = true;
  public randomEbooks: Book[] = [];


  private _destroySubscribes$ = new Subject<void>();

  constructor(private _scBook: BookService) { }

  ngOnInit() {
    this._scBook
      .getAvailableBooks()
      .pipe(takeUntil(this._destroySubscribes$))
      .subscribe((books) => {
        this.availableBooks = books;
        this.hasBook = books.length > 0 ? true : false;
      });

    this._scBook
      .getRandomEbooks()
      .pipe(takeUntil(this._destroySubscribes$))
      .subscribe((ebooks) => {
        this.randomEbooks = ebooks;
        this.hasEbook = ebooks.length > 0 ? true : false;
      });

  }

  ngOnDestroy() {
    this._destroySubscribes$.next();
    this._destroySubscribes$.complete();
  }
}
