import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_CONFIG, AppConfig } from '../../../app-config.module';
import { Meetup, MeetupList } from '../../models/Meetup';

@Injectable({
  providedIn: 'root',
})
export class MeetupService {
  constructor(
    private _http: HttpClient,

    @Inject(APP_CONFIG)
    private config: AppConfig
  ) {}

  public get(page: number, pageSize: number): Observable<MeetupList> {
    return this._http.get<MeetupList>(`${this.config.apiEndpoint}/Meetup?page=${page}&pagesize=${pageSize}`);
  }

  public search(criteria: string): Observable<Meetup[]> {
    return this._http.get<Meetup[]>(`${this.config.apiEndpoint}/Meetup/Search?criteria=${criteria}`);
  }
}
