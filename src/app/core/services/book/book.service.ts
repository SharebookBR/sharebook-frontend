import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Book } from '../../models/book';
import { BooksVM } from '../../models/booksVM';
import { DonateBookUser } from '../../models/donateBookUser';
import { map } from 'rxjs/operators';

import { APP_CONFIG, AppConfig } from '../../../app-config.module';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  // TODO TypicodeInterceptor
  constructor(private _http: HttpClient, @Inject(APP_CONFIG) private config: AppConfig) {}

  public getAll() {
    return this._http.get<BooksVM[]>(`${this.config.apiEndpoint}/book/1/100`);
  }

  public getTop15NewBooks() {
    return this._http.get<Book[]>(`${this.config.apiEndpoint}/book/Top15NewBooks`);
  }

  public getRandom15Books() {
    return this._http.get<Book[]>(`${this.config.apiEndpoint}/book/Random15Books`);
  }

  public create(book: Book) {
    return this._http.post<any>(`${this.config.apiEndpoint}/book`, book);
  }

  public getById(bookId: string) {
    return this._http.get<Book>(`${this.config.apiEndpoint}/book/${bookId}`);
  }

  public getBySlug(bookSlug: string) {
    return this._http.get<Book>(`${this.config.apiEndpoint}/book/Slug/${bookSlug}`);
  }

  public update(book: Book) {
    return this._http.put<Book>(`${this.config.apiEndpoint}/book/${book.id}`, book);
  }

  public delete(bookId: number) {
    return this._http.delete(`${this.config.apiEndpoint}/book/${bookId}`);
  }

  public getFreightOptions() {
    return this._http.get<any>(`${this.config.apiEndpoint}/book/freightOptions`).pipe(
      map(response => {
        return response;
      })
    );
  }

  public getGranteeUsersByBookId(bookId: string) {
    return this._http.get(`${this.config.apiEndpoint}/book/GranteeUsersByBookId/${bookId}`);
  }

  public donateBookUser(bookId: string, donateBookUser: DonateBookUser) {
    return this._http.put<any>(`${this.config.apiEndpoint}/book/Donate/${bookId}`, donateBookUser);
  }

  public requestBook(bookId: string) {
    return this._http.post<any>(`${this.config.apiEndpoint}/book/Request/${bookId}`, null);
  }

  public getRequested(bookId: string) {
    return this._http.get<any>(`${this.config.apiEndpoint}/book/Requested/${bookId}`);
  }

}
