import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
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
  public parentCategory: Category | null = null;
  public subcategories: Category[] = [];
  public books: Book[] = [];
  public isLoading = true;
  public isMoreLoading = false;
  public notFound = false;
  public physicalBooksCount = 0;
  public ebooksCount = 0;
  public totalItems = 0;
  public page = 1;
  public pageSize = 24;

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
      .pipe(takeUntil(this._destroySubscribes$))
      .subscribe(params => {
        this.isLoading = true;
        this.notFound = false;
        this.books = [];
        this.page = 1;
        this.loadCategory(params['slug'], params['parentSlug']);
      });
  }

  private loadCategory(slug: string, parentSlug?: string) {
    const request = parentSlug
      ? this.categoryService.getByHierarchySlugs(parentSlug, slug)
      : this.categoryService.getBySlug(slug);

    request.pipe(takeUntil(this._destroySubscribes$)).subscribe(category => {
      if (!category) {
        this.notFound = true;
        this.category = null;
        this.parentCategory = null;
        this.subcategories = [];
        this.isLoading = false;
        return;
      }

      this.category = category;
      this.parentCategory = category.parentCategoryName
        ? new Category({
            id: category.parentCategoryId,
            name: category.parentCategoryName,
            slug: category.parentCategorySlug
          })
        : null;
      this.subcategories = [...(category.children || [])].sort((left, right) =>
        left.name.localeCompare(right.name, 'pt-BR', { sensitivity: 'base' })
      );
      this.updateSeoTags();
      this.loadBooks();
    });
  }

  public loadMore() {
    this.page++;
    this.isMoreLoading = true;
    this.loadBooks();
  }

  private loadBooks() {
    if (!this.category) {
      return;
    }

    const request = this.parentCategory
      ? this.bookService.getBooksByCategoryId(this.category.id, this.page, this.pageSize)
      : this.bookService.getBooksByCategoryTreeId(this.category.id, this.page, this.pageSize);

    request.pipe(takeUntil(this._destroySubscribes$)).subscribe(
      response => {
        const newBooks = response.items || [];
        this.books = [...this.books, ...newBooks];
        this.totalItems = response.totalItems;
        this.physicalBooksCount = response.physicalBooksCount;
        this.ebooksCount = response.ebooksCount;
        this.isLoading = false;
        this.isMoreLoading = false;
      },
      error => {
        console.error('Erro ao carregar livros:', error);
        this.isLoading = false;
        this.isMoreLoading = false;
      }
    );
  }

  private updateSeoTags() {
    if (!this.category) {
      return;
    }

    const categoryPath = this.parentCategory
      ? `${this.parentCategory.name} > ${this.category.name}`
      : this.category.name;
    const title = `${categoryPath} - Livros | ShareBook`;
    const description = `Encontre livros de ${categoryPath} disponíveis para doação no ShareBook. Peça seu livro gratuitamente.`;

    this.titleService.setTitle(title);
    this.metaService.updateTag({ name: 'description', content: description });
    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({ property: 'og:description', content: description });
  }

  public getSubcategoryRoute(subcategory: Category): string[] {
    return ['/categorias', this.category?.slug || '', subcategory.slug || ''];
  }

  public getSubcategoryBookCount(subcategory: Category): number {
    return subcategory.totalBooks || 0;
  }

  public shouldShowBooksGrid(): boolean {
    return !this.subcategories.length && this.books.length > 0;
  }

  public shouldShowEmptyState(): boolean {
    return !this.subcategories.length && this.books.length === 0 && !this.isLoading;
  }

  public hasMoreBooks(): boolean {
    return this.books.length < this.totalItems;
  }

  public getBooksAvailableLabel(): string {
    const total = this.totalItems;
    return total === 1 ? '1 livro disponível' : `${total} livros disponíveis`;
  }

  ngOnDestroy() {
    this._destroySubscribes$.next();
    this._destroySubscribes$.complete();
  }
}
