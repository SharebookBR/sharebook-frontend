import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Book } from '../../models/book';
import { FreightOptions } from '../../models/freightOptions';

import { APP_CONFIG, AppConfig } from '../../../app-config.module';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  // TODO TypicodeInterceptor
  constructor(private _http: HttpClient, @Inject(APP_CONFIG) private config: AppConfig) { }

  public getAll() {
    return this._http.get<Book[]>(`${this.config.apiEndpoint}`);
  }

  public create(book: Book) {
    return this._http.post<Book>(`${this.config.apiEndpoint}`, book);
  }

  public getById(bookId: number) {
    return this._http.get<Book>(`${this.config.apiEndpoint}/${bookId}`);
  }

  public update(book: Book) {
    return this._http.put<Book>(`${this.config.apiEndpoint}`, book);
  }

  public delete(bookId: number) {
    return this._http.delete(`${this.config.apiEndpoint}/${bookId}`);
  }

  public getFreightOptions() {
    return [
      new FreightOptions(2, 'Cidade'),
      new FreightOptions(3, 'Estado'),
      new FreightOptions(4, 'País'),
      new FreightOptions(5, 'Mundo'),
      new FreightOptions(1, 'Não vou pagar'),
    ];
    // return this._http.get<Category[]>(`${API_URL}/book/category`);
  }
}
