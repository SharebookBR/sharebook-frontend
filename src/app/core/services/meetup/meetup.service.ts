import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { APP_CONFIG, AppConfig } from '../../../app-config.module';
import { Meetup, MeetupList } from '../../models/Meetup';
import { PlatformService } from '../platform/platform.service';

@Injectable({
  providedIn: 'root',
})
export class MeetupService {
  constructor(
    private _http: HttpClient,
    @Inject(APP_CONFIG)
    private config: AppConfig,
    private _transferState: TransferState,
    private _platform: PlatformService
  ) {}

  public get(page: number, pageSize: number, upcoming: boolean = false): Observable<MeetupList> {
    const stateKey = makeStateKey<MeetupList>(`meetups-${page}-${pageSize}-${upcoming}`);
    const storedMeetups = this._platform.isBrowser()
      ? this._transferState.get<MeetupList | null>(stateKey, null)
      : null;

    if (storedMeetups) {
      return new Observable<MeetupList>((observer) => {
        observer.next(storedMeetups);
        observer.complete();
      });
    }

    return this._http.get<MeetupList>(
      `${this.config.apiEndpoint}/Meetup?page=${page}&pagesize=${pageSize}&upcoming=${upcoming}`
    ).pipe(
      tap((meetups) => this._transferState.set(stateKey, meetups))
    );
  }

  public search(criteria: string): Observable<Meetup[]> {
    return this._http.get<Meetup[]>(`${this.config.apiEndpoint}/Meetup/Search?criteria=${criteria}`);
  }
}
