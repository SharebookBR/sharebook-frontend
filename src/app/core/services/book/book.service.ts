import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Book } from '../../models/book';
import { FreightOptions } from '../../models/freightOptions';

const API_URL = 'http://localhost:3000/book';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  // TODO TypicodeInterceptor
  constructor(private _http: HttpClient) { }

  public getAll() {
    return this._http.get<Book[]>(`${API_URL}`);
  }

  public create(book: Book) {
    return this._http.post<Book>(`${API_URL}`, book);
  }

  public getById(bookId: number) {
    return this._http.get<Book>(`${API_URL}/${bookId}`);
  }

  public update(book: Book) {
    return this._http.put<Book>(`${API_URL}`, book);
  }

  public delete(bookId: number) {
    return this._http.delete(`${API_URL}/${bookId}`);
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
