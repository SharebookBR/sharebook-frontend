import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { UserService } from 'src/app/core/services/user/user.service';

@Component({
    selector: 'app-unsubscribe',
    templateUrl: './unsubscribe.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class UnsubscribeComponent implements OnInit, OnDestroy {
  private _destroySubscribes$ = new Subject<void>();
  public state: 'loading' | 'success' | 'error' = 'loading';

  constructor(private _activatedRoute: ActivatedRoute, private _userService: UserService) {}

  ngOnInit() {
    this._activatedRoute.queryParams.pipe(takeUntil(this._destroySubscribes$)).subscribe((params) => {
      const userId = params['userId'];
      const token = params['token'];

      this._userService
        .unsubscribe(userId, token)
        .pipe(takeUntil(this._destroySubscribes$))
        .subscribe(
          (response) => {
            this.state = response?.success ? 'success' : 'error';
          },
          () => {
            this.state = 'error';
          }
        );
    });
  }

  ngOnDestroy() {
    this._destroySubscribes$.next();
    this._destroySubscribes$.complete();
  }
}
