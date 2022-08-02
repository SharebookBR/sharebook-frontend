import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { MeetupService } from '../../core/services/meetup/meetup.service';
import { Meetup } from 'src/app/core/models/Meetup';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
})
export class SearchResultsComponent implements OnInit, OnDestroy {
  public criteria: string;
  public showInfo: boolean = false;
  isLoading: boolean = true;
  public meetups: Meetup[] = [];

  private _destroySubscribes$ = new Subject<void>();

  constructor(private _route: ActivatedRoute, private _toastr: ToastrService, private _scMeetup: MeetupService) {}

  ngOnInit() {
    this.getParamByUri();
    this.getMeetups();
  }
  getMeetups() {
    this._scMeetup
      .search(this.criteria)
      .pipe(takeUntil(this._destroySubscribes$))
      .subscribe((meetups) => {
        this.meetups = meetups;
        this.isLoading = false;
      });
  }

  private getParamByUri(): void {
    this._route.params.pipe(takeUntil(this._destroySubscribes$)).subscribe(
      (param) => {
        this.criteria = param['criteria'];
      },
      (error: HttpErrorResponse) => {
        this._toastr.error(error.message ? error.message : error.toString());
      }
    );
  }

  ngOnDestroy() {
    this._destroySubscribes$.next();
    this._destroySubscribes$.complete();
  }

  public toogleInfo() {
    this.showInfo = !this.showInfo;
  }
}
