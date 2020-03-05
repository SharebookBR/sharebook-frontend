import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { BookService } from '../../core/services/book/book.service';
import { Book } from '../../core/models/book';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  public top15NewBooks: Book[] = [];
  public random15NewBooks: Book[] = [];
  public hasBook: Boolean = true;

  private _destroySubscribes$ = new Subject<void>();

  constructor(private _scBook: BookService) {}

  ngOnInit() {
    this._scBook.getTop15NewBooks()
    .pipe(
      takeUntil(this._destroySubscribes$)
    )
    .subscribe(newBooks => {
      this.top15NewBooks = newBooks;
      this.hasBook = newBooks.length > 0 ? true : false;

      /*if (this.hasBook) {
        this._scBook.getRandom15Books().subscribe(randomBooks => {
          this.random15NewBooks = randomBooks;
        });
      }*/
    });
  }

  ngOnDestroy() {
    this._destroySubscribes$.next();
    this._destroySubscribes$.complete();
  }
}
