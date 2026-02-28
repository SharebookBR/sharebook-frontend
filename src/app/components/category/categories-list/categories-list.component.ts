import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Title, Meta } from '@angular/platform-browser';

import { BookService } from '../../../core/services/book/book.service';
import { CategoryService } from '../../../core/services/category/category.service';
import { Category } from '../../../core/models/category';
import { Book } from '../../../core/models/book';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.css'],
})
export class CategoriesListComponent implements OnInit, OnDestroy {
  public categories: Category[] = [];
  public categoryBookCount: Map<string, number> = new Map();
  public isLoading = true;

  private _destroySubscribes$ = new Subject<void>();

  constructor(
    private _scBook: BookService,
    private _scCategory: CategoryService,
    private titleService: Title,
    private metaService: Meta
  ) {}

  ngOnInit() {
    this.titleService.setTitle('Categorias | ShareBook');
    this.metaService.updateTag({
      name: 'description',
      content: 'Navegue por todas as categorias de livros disponíveis para doação no ShareBook.',
    });

    this.loadCategoriesAndBooks();
  }

  private loadCategoriesAndBooks() {
    let categoriesLoaded = false;
    let booksLoaded = false;

    this._scCategory
      .getAllWithSlug()
      .pipe(takeUntil(this._destroySubscribes$))
      .subscribe((categories) => {
        this.categories = categories;
        categoriesLoaded = true;
        if (booksLoaded) {
          this.isLoading = false;
        }
      });

    this._scBook
      .getAvailableBooks()
      .pipe(takeUntil(this._destroySubscribes$))
      .subscribe((books: Book[]) => {
        this.countBooksByCategory(books);
        booksLoaded = true;
        if (categoriesLoaded) {
          this.isLoading = false;
        }
      });
  }

  private countBooksByCategory(books: Book[]) {
    this.categoryBookCount.clear();
    books.forEach((book) => {
      if (book.categoryId) {
        const count = this.categoryBookCount.get(String(book.categoryId)) || 0;
        this.categoryBookCount.set(String(book.categoryId), count + 1);
      }
    });
  }

  getCategoryBookCount(categoryId: number): number {
    return this.categoryBookCount.get(String(categoryId)) || 0;
  }

  ngOnDestroy() {
    this._destroySubscribes$.next();
    this._destroySubscribes$.complete();
  }
}
