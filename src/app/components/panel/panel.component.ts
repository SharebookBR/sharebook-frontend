import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { UserService } from '../../core/services/user/user.service';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit, OnDestroy {
  isAdmin: boolean;

  private _destroySubscribes$ = new Subject<void>();

  constructor(private _scUser: UserService) { }

  ngOnInit() {
    this._scUser.getProfile()
      .pipe(
        takeUntil(this._destroySubscribes$)
      )
      .subscribe(profile => (this.isAdmin = profile.profile === 'Administrator' ? true : false));
  }

  ngOnDestroy() {
    this._destroySubscribes$.next();
    this._destroySubscribes$.complete();
  }
}
