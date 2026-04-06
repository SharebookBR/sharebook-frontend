import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { APP_CONFIG, AppConfig } from '../../../app-config.module';
import { Category } from '../../models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private _http: HttpClient, @Inject(APP_CONFIG) private config: AppConfig) {}

  public getAll(): Observable<Category[]> {
    return this._http.get<any>(`${this.config.apiEndpoint}/category`).pipe(
      map(response => this.normalizeCategories(response.items || []))
    );
  }

  public getById(categoryId: string) {
    return this._http.get<Category>(`${this.config.apiEndpoint}/category/${categoryId}`).pipe(
      map(category => this.normalizeCategory(category))
    );
  }

  public generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  public getAllWithSlug(): Observable<Category[]> {
    return this.getAll();
  }

  public getBySlug(slug: string): Observable<Category | undefined> {
    return this.getAll().pipe(
      map(categories => this.flattenCategories(categories).find(category => category.slug === slug))
    );
  }

  public getByHierarchySlugs(parentSlug: string, slug: string): Observable<Category | undefined> {
    return this.getAll().pipe(
      map(categories => {
        const flattened = this.flattenCategories(categories);
        return flattened.find(category => category.slug === slug && category.parentCategorySlug === parentSlug);
      })
    );
  }

  public getRootCategories(categories: Category[]): Category[] {
    return categories.filter(category => !category.parentCategoryId);
  }

  public flattenCategories(categories: Category[]): Category[] {
    return categories.reduce((all: Category[], category) => {
      const children = category.children || [];
      return [...all, category, ...this.flattenCategories(children)];
    }, []);
  }

  public flattenForSelect(categories: Category[]): Category[] {
    return this.flattenCategories(categories).sort((a, b) => {
      const left = a.displayName || a.name;
      const right = b.displayName || b.name;
      return left.localeCompare(right);
    });
  }

  public getCategoryPath(category: Category | undefined | null): string {
    if (!category) {
      return '';
    }

    return category.parentCategoryName
      ? `${category.parentCategoryName} > ${category.name}`
      : category.name;
  }

  public collectCategoryIds(category: Category | undefined | null): string[] {
    if (!category) {
      return [];
    }

    return [category.id].concat(
      (category.children || []).reduce((all: string[], child) => {
        return all.concat(this.collectCategoryIds(child));
      }, [])
    );
  }

  private normalizeCategories(categories: Category[]): Category[] {
    return (categories || []).map(category => this.normalizeCategory(category));
  }

  private normalizeCategory(category: Category): Category {
    const normalized = new Category({
      ...category,
      slug: this.generateSlug(category.name),
      children: []
    });

    normalized.children = (category.children || []).map(child => {
      const normalizedChild = this.normalizeCategory({
        ...child,
        parentCategoryId: child.parentCategoryId || normalized.id,
        parentCategoryName: child.parentCategoryName || normalized.name
      });

      normalizedChild.parentCategorySlug = normalized.slug;
      normalizedChild.displayName = `${normalized.name} > ${normalizedChild.name}`;

      return normalizedChild;
    });

    normalized.displayName = this.getCategoryPath(normalized);
    normalized.parentCategorySlug = normalized.parentCategoryName
      ? this.generateSlug(normalized.parentCategoryName)
      : null;

    return normalized;
  }
}
