import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Book } from '../../models/book';
import { FreightOptions } from '../../models/freightOptions';
import { map } from 'rxjs/operators';

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
    return this._http.post<Book>(`${this.config.apiEndpoint}/book`, book);
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
    return this._http.get<any>(`${this.config.apiEndpoint}/book/freightOptions`)
      .pipe(map(response => {
        return response;
    }));
  }
}
