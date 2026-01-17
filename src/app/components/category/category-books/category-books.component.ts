import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';
import { Meta, Title } from '@angular/platform-browser';

import { BookService } from '../../../core/services/book/book.service';
import { CategoryService } from '../../../core/services/category/category.service';
import { Book } from '../../../core/models/book';
import { Category } from '../../../core/models/category';

@Component({
  selector: 'app-category-books',
  templateUrl: './category-books.component.html',
  styleUrls: ['./category-books.component.css'],
})
export class CategoryBooksComponent implements OnInit, OnDestroy {
  public category: Category | null = null;
  public books: Book[] = [];
  public isLoading = true;
  public notFound = false;
  public physicalBooksCount = 0;
  public ebooksCount = 0;

  private _destroySubscribes$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private categoryService: CategoryService,
    private titleService: Title,
    private metaService: Meta
  ) {}

  ngOnInit() {
    this.route.params
      .pipe(
        takeUntil(this._destroySubscribes$),
        switchMap(params => {
          this.isLoading = true;
          const slug = params['slug'];
          return this.categoryService.getBySlug(slug);
        })
      )
      .subscribe(category => {
        if (!category) {
          this.notFound = true;
          this.isLoading = false;
          return;
        }

        this.category = category;
        this.updateSeoTags();
        this.loadBooks();
      });
  }

  private loadBooks() {
    if (!this.category) return;

    this.bookService
      .getBooksByCategoryId(this.category.id)
      .pipe(takeUntil(this._destroySubscribes$))
      .subscribe(
        response => {
          this.books = response.items || response || [];
          this.countBooksByType();
          this.isLoading = false;
        },
        error => {
          console.error('Erro ao carregar livros:', error);
          this.books = [];
          this.isLoading = false;
        }
      );
  }

  private updateSeoTags() {
    if (!this.category) return;

    const title = `${this.category.name} - Livros | ShareBook`;
    const description = `Encontre livros de ${this.category.name} disponíveis para doação no ShareBook. Peça seu livro gratuitamente.`;

    this.titleService.setTitle(title);
    this.metaService.updateTag({ name: 'description', content: description });
    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({ property: 'og:description', content: description });
  }

  private countBooksByType() {
    this.ebooksCount = this.books.filter(book => book.type === 'Eletronic').length;
    this.physicalBooksCount = this.books.filter(book => book.type === 'Printed').length;
  }

  ngOnDestroy() {
    this._destroySubscribes$.next();
    this._destroySubscribes$.complete();
  }
}
