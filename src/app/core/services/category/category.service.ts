import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from '../../models/category';

const API_URL = 'http://localhost:3000';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private _http: HttpClient) { }

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
    return this._http.get<Category>(`${API_URL}/category/${categoryId}`);
  }
}
