import { Component, OnInit } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { PlatformService } from './core/services/platform/platform.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(
    private _router: Router,
    private _viewportScroller: ViewportScroller,
    private _platform: PlatformService
  ) {}

  ngOnInit() {
    this._router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        setTimeout(() => {
          this._viewportScroller.scrollToPosition([0, 0]);
          this._platform.scrollToTop();
        }, 0);
      });
  }
}
