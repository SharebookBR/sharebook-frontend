import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from '../../models/category';

import { APP_CONFIG, AppConfig } from '../../../app-config.module';


@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private _http: HttpClient,  @Inject(APP_CONFIG) private config: AppConfig) { }

  public getAll() {
    return [
      new Category(1, 'Direito'),
      new Category(2, 'Artes'),
      new Category(3, 'Tecnologia'),
      new Category(4, 'Matematica'),
    ];
    // return this._http.get<Category[]>(`${API_URL}/category`);
  }

  public getById(categoryId: number) {
    return this._http.get<Category>(`${this.config.apiEndpoint}/category/${categoryId}`);
  }
}
