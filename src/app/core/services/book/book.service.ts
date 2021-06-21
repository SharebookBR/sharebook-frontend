import { BookToAdminProfile } from './../../models/BookToAdminProfile';
import { UserInfoBook } from './../../models/UserInfoBook';
import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Book } from '../../models/book';
import { BookVM } from '../../models/bookVM';
import { DonateBookUser } from '../../models/donateBookUser';
import { map } from 'rxjs/operators';

import { APP_CONFIG, AppConfig } from '../../../app-config.module';
import { TrackingNumberBookVM } from '../../models/trackingNumberBookVM';
import { FacilitatorNotes } from '../../models/facilitatorNotes';
import { Observable } from 'rxjs';
import { Requesters } from '../../models/requesters';
import { MyRequest } from '../../models/MyRequest';
import { MyDonation } from '../../models/MyDonation';
import { FullSearch } from '../../models/FullSearch';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  // TODO TypicodeInterceptor
  constructor(
    private _http: HttpClient,
    @Inject(APP_CONFIG) private config: AppConfig
  ) { }

  public getAll(): Observable<BookVM> {
    return this._http.get<BookVM>(`${this.config.apiEndpoint}/book/1/9999`);
  }

  public getAvailableBooks() {
    return this._http.get<Book[]>(
      `${this.config.apiEndpoint}/book/AvailableBooks`
    );
  }

  public getRandomEbooks() {
    return this._http.get<Book[]>(
      `${this.config.apiEndpoint}/book/random15ebooks`
    );
  }

  public getRandom15Books() {
    return this._http.get<Book[]>(
      `${this.config.apiEndpoint}/book/Random15Books`
    );
  }

  public create(book: Book) {
    return this._http.post<any>(`${this.config.apiEndpoint}/book`, book);
  }

  public getById(bookId: string): Observable<BookToAdminProfile> {
    return this._http.get<BookToAdminProfile>(`${this.config.apiEndpoint}/book/${bookId}`);
  }

  public getBySlug(bookSlug: string) {
    return this._http.get<Book>(
      `${this.config.apiEndpoint}/book/Slug/${bookSlug}`
    );
  }

  public update(book: Book) {
    return this._http.put<any>(
      `${this.config.apiEndpoint}/book/${book.id}`,
      book
    );
  }

  public delete(bookId: string) {
    return this._http.delete(`${this.config.apiEndpoint}/book/${bookId}`);
  }

  public cancelDonation(bookId: string) {
    return this._http.post<any>(
      `${this.config.apiEndpoint}/book/cancel/${bookId}`,
      null
    );
  }

  public getFreightOptions() {
    return this._http
      .get<any>(`${this.config.apiEndpoint}/book/freightOptions`)
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  public getGranteeUsersByBookId(bookId: string) {
    return this._http.get(
      `${this.config.apiEndpoint}/book/GranteeUsersByBookId/${bookId}`
    );
  }

  public getRequestersList(bookId: string): Observable<Requesters[]> {
    return this._http.get<Requesters[]>(
      `${this.config.apiEndpoint}/book/RequestersList/${bookId}`
    );
  }

  public donateBookUser(bookId: string, donateBookUser: DonateBookUser) {
    return this._http.put<any>(
      `${this.config.apiEndpoint}/book/Donate/${bookId}`,
      donateBookUser
    );
  }

  public renewChooseDate(bookId: string) {
    return this._http.put<any>(
      `${this.config.apiEndpoint}/book/RenewChooseDate/${bookId}`,
      null
    );
  }

  public requestBook(bookId: string, reason: string) {
    const request = {
      BookId: bookId,
      Reason: reason,
    };
    return this._http.post<any>(
      `${this.config.apiEndpoint}/book/Request/`,
      request
    );
  }

  public getRequested(bookId: string) {
    return this._http.get<any>(
      `${this.config.apiEndpoint}/book/Requested/${bookId}`
    );
  }

  public getRequestedBooks(page: number, items: number): Observable<MyRequest> {
    return this._http.get<MyRequest>(
      `${this.config.apiEndpoint}/book/MyRequests/${page}/${items}`
    );
  }

  public getDonatedBooks(): Observable<MyDonation[]> {
    return this._http.get<MyDonation[]>(`${this.config.apiEndpoint}/book/MyDonations`);
  }

  public setTrackingNumber(
    bookId: string,
    trackingNumberBookVM: TrackingNumberBookVM
  ) {
    return this._http.post<any>(
      `${this.config.apiEndpoint}/book/InformTrackingNumber/${bookId}`,
      trackingNumberBookVM
    );
  }

  public setFacilitatorNotes(facilitatorNotes: FacilitatorNotes) {
    return this._http.post<any>(
      `${this.config.apiEndpoint}/book/AddFacilitatorNotes`,
      facilitatorNotes
    );
  }

  public getFullSearch(
    criteria: string,
    page: number,
    items: number
  ): Observable<FullSearch> {
    return this._http.get<FullSearch>(
      `${this.config.apiEndpoint}/book/FullSearch/${encodeURIComponent(
        criteria
      )}/${page}/${items}`
    );
  }

  public getMainUsers(bookId: string): Observable<UserInfoBook> {
    return this._http.get<UserInfoBook>(
      `${this.config.apiEndpoint}/book/MainUsers/${bookId}`
    );
  }

  public approve(bookId: string) {
    return this._http.post<any>(
      `${this.config.apiEndpoint}/book/Approve/${bookId}`,
      {}
    );
  }
}
