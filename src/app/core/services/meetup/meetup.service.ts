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

  public getAll(): Observable<MeetupList> {
    return this._http.get<MeetupList>(`${this.config.apiEndpoint}/Meetup`);
  }
}
