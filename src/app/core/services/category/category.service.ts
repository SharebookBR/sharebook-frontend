import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from '../../models/category';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { APP_CONFIG, AppConfig } from '../../../app-config.module';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private _http: HttpClient, @Inject(APP_CONFIG) private config: AppConfig) {}

  public getAll(): Observable<Category[]> {
    return this._http.get<any>(`${this.config.apiEndpoint}/category`).pipe(
      map(response => {
        return response.items;
      })
    );
  }

  public getById(categoryId: number) {
    return this._http.get<Category>(`${this.config.apiEndpoint}/category/${categoryId}`);
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
    return this.getAll().pipe(
      map(categories => categories.map(c => ({
        ...c,
        slug: this.generateSlug(c.name)
      })))
    );
  }

  public getBySlug(slug: string): Observable<Category | undefined> {
    return this.getAllWithSlug().pipe(
      map(categories => categories.find(c => c.slug === slug))
    );
  }
}
