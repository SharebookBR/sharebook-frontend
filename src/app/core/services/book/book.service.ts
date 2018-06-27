import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Book } from '../../models/book';

const API_URL = 'http://localhost:3000';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  // TODO TypicodeInterceptor
  constructor(private _http: HttpClient) { }

  public getAll() {
    return this._http.get<Book[]>(`${API_URL}/books`);
  }

  public create(book: Book) {
    console.log(book);
    return this._http.post<Book>(`${API_URL}/books`, book);
  }

  public getById(bookId: number) {
    return this._http.get<Book>(`${API_URL}/books/${bookId}`);
  }

  public update(book: Book) {
    return this._http.put<Book>(`${API_URL}/books`, book);
  }

  public delete(bookId: number) {
    return this._http.delete(`${API_URL}/books/${bookId}`);
  }

}
