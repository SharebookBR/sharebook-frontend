import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Book } from '../../models/book';
import { BooksVM } from '../../models/booksVM';
import { DonateBookUser } from '../../models/donateBookUser';
import { map } from 'rxjs/operators';

import { APP_CONFIG, AppConfig } from '../../../app-config.module';
import { TrackingNumberBookVM } from '../../models/trackingNumberBookVM';
import { FacilitatorNotes } from '../../models/facilitatorNotes';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  // TODO TypicodeInterceptor
  constructor(private _http: HttpClient, @Inject(APP_CONFIG) private config: AppConfig) {}

  public getAll() {
    return this._http.get<BooksVM[]>(`${this.config.apiEndpoint}/book/1/9999`);
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

  public cancelDonation(bookId: number) {
    return this._http.post<any>(`${this.config.apiEndpoint}/book/cancel/${bookId}`, null);
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

  public getRequestersList(bookId: string) {
    return this._http.get(`${this.config.apiEndpoint}/book/RequestersList/${bookId}`);
  }

  public donateBookUser(bookId: string, donateBookUser: DonateBookUser) {
    return this._http.put<any>(`${this.config.apiEndpoint}/book/Donate/${bookId}`, donateBookUser);
  }

  public renewChooseDate(bookId: string) {
    return this._http.put<any>(`${this.config.apiEndpoint}/book/RenewChooseDate/${bookId}`, null);
  }

  public requestBook(bookId: string, reason: string) {
    const request = {
      'BookId': bookId,
      'Reason': reason
    };
    return this._http.post<any>(`${this.config.apiEndpoint}/book/Request/`, request);
  }

  public getRequested(bookId: string) {
    return this._http.get<any>(`${this.config.apiEndpoint}/book/Requested/${bookId}`);
  }

  public getRequestedBooks(page: number, items: number) {
    return this._http.get<any>(`${this.config.apiEndpoint}/book/MyRequests/${page}/${items}`);
  }

  public getDonatedBooks() {
    return this._http.get<any>(`${this.config.apiEndpoint}/book/MyDonations`);
  }

  public setTrackingNumber(bookId: string, trackingNumberBookVM: TrackingNumberBookVM) {
    return this._http.post<any>(`${this.config.apiEndpoint}/book/InformTrackingNumber/${bookId}`, trackingNumberBookVM);
  }

  public setFacilitatorNotes(facilitatorNotes: FacilitatorNotes) {
    return this._http.post<any>(`${this.config.apiEndpoint}/book/AddFacilitatorNotes`, facilitatorNotes);
  }

  public getMainUsers(bookId: string) {
    return this._http.get<any>(`${this.config.apiEndpoint}/book/MainUsers/${bookId}`);
  }
}
