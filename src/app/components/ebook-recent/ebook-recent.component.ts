import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Book } from '../../core/models/book';
import { BookService } from '../../core/services/book/book.service';
import { SeoService } from '../../core/services/seo/seo.service';

@Component({
  selector: 'app-ebook-recent',
  templateUrl: './ebook-recent.component.html',
  styleUrls: ['./ebook-recent.component.css'],
})
export class EbookRecentComponent implements OnInit, OnDestroy {
  public books: Book[] = [];
  public isLoading = true;
  public totalItems = 0;

  private _destroySubscribes$ = new Subject<void>();

  constructor(
    private _bookService: BookService,
    private _seo: SeoService
  ) {}

  ngOnInit() {
    this._seo.generateTags({
      title: 'Novos livros digitais da semana',
      description:
        'Veja os livros digitais aprovados nesta semana no ShareBook e escolha sua próxima leitura gratuita.',
      path: '/livros-digitais/novidades',
      ogType: 'website',
    });

    this.loadBooks();
  }

  private loadBooks() {
    this._bookService
      .getRecentEbooks(1, 100, 7)
      .pipe(takeUntil(this._destroySubscribes$))
      .subscribe(
        (response) => {
          this.books = response.items || [];
          this.totalItems = response.totalItems || this.books.length;
          this.isLoading = false;
        },
        () => {
          this.books = [];
          this.totalItems = 0;
          this.isLoading = false;
        }
      );
  }

  ngOnDestroy() {
    this._destroySubscribes$.next();
    this._destroySubscribes$.complete();
  }
}
