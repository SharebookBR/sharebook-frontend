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
  public expandedCategoryIds: Set<string> = new Set();
  public isLoading = true;

  private _destroySubscribes$ = new Subject<void>();

  constructor(
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

    this.loadCategoriesWithCounts();
  }

  private loadCategoriesWithCounts() {
    this._scCategory
      .getAllWithCounts()
      .pipe(takeUntil(this._destroySubscribes$))
      .subscribe((categories) => {
        this.categories = this._scCategory.getRootCategories(categories);
        this.isLoading = false;
      }, () => {
        this.isLoading = false;
      });
  }

  getCategoryBookCount(category: Category): number {
    return category.totalBooks || 0;
  }

  hasSubcategories(category: Category): boolean {
    return !!category.children && category.children.length > 0;
  }

  isExpanded(category: Category): boolean {
    return this.expandedCategoryIds.has(category.id);
  }

  toggleCategory(category: Category) {
    if (!this.hasSubcategories(category)) {
      return;
    }

    if (this.isExpanded(category)) {
      this.expandedCategoryIds.delete(category.id);
      return;
    }

    this.expandedCategoryIds.add(category.id);
  }

  getCategoryCountLabel(category: Category): string {
    const totalBooks = this.getCategoryBookCount(category);

    if (this.hasSubcategories(category)) {
      return `${totalBooks} livro(s) nas subcategorias`;
    }

    return `${totalBooks} livro(s)`;
  }

  getSortedSubcategories(category: Category): Category[] {
    return [...(category.children || [])].sort((left, right) =>
      left.name.localeCompare(right.name, 'pt-BR', { sensitivity: 'base' })
    );
  }

  ngOnDestroy() {
    this._destroySubscribes$.next();
    this._destroySubscribes$.complete();
  }
}
