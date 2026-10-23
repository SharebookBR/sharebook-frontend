import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';

import { UserService } from 'src/app/core/services/user/user.service';
import { GoogleAnalyticsService } from 'src/app/core/services/analytics/google-analytics.service';

@Component({
    selector: 'app-unsubscribe',
    templateUrl: './unsubscribe.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class UnsubscribeComponent implements OnInit, OnDestroy {
  private _destroySubscribes$ = new Subject<void>();
  private _userId = '';
  private _token = '';

  public state: 'confirm' | 'loading' | 'success' | 'error' | 'rate_limited' = 'confirm';

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _userService: UserService,
    private _ga: GoogleAnalyticsService
  ) {}

  ngOnInit() {
    this._activatedRoute.queryParams.pipe(takeUntil(this._destroySubscribes$)).subscribe((params) => {
      this._userId = params['userId'] || '';
      this._token = params['token'] || '';

      if (!this._userId || !this._token) {
        this.state = 'error';
        return;
      }

      this._ga.sendEvent('unsubscribe_confirm_view');
    });
  }

  confirm() {
    if (!this._userId || !this._token || this.state === 'loading') {
      return;
    }

    this.state = 'loading';
    this._userService
      .unsubscribe(this._userId, this._token)
      .pipe(
        takeUntil(this._destroySubscribes$),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 429) {
            this.state = 'rate_limited';
            this._ga.sendEvent('unsubscribe_rate_limited');
          } else {
            this.state = 'error';
            this._ga.sendEvent('unsubscribe_invalid_link');
          }

          return EMPTY;
        })
      )
      .subscribe((response) => {
        if (response?.success) {
          this.state = 'success';
          this._ga.sendEvent('unsubscribe_confirmed');
          return;
        }

        this.state = 'error';
        this._ga.sendEvent('unsubscribe_invalid_link');
      });
  }

  tryAgain() {
    if (this.state === 'rate_limited') {
      this.state = 'confirm';
    }
  }

  ngOnDestroy() {
    this._destroySubscribes$.next();
    this._destroySubscribes$.complete();
  }
}
