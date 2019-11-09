import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ToastrService } from 'ngx-toastr';

import { AuthenticationService } from '../../core/services/authentication/authentication.service';
import * as AppConst from '../../core/utils/app.const';

@Component({
  selector: 'app-form',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  formGroup: FormGroup;
  returnUrl: string;
  private _destroySubscribes$ = new Subject<void>();

  constructor(
    private _scAuthentication: AuthenticationService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _toastr: ToastrService
  ) {
    this.formGroup = _formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(AppConst.emailPattern)]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit() {

        // reset login status
        this._scAuthentication.logout();

        // get return url from route parameters or default to '/'
        this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/panel';

  }

  loginUser() {
    if (this.formGroup.valid) {
      this._scAuthentication.login(
        this.formGroup.value.email,
        this.formGroup.value.password)
        .pipe(takeUntil(this._destroySubscribes$))
        .subscribe(
          data => {
            if (data.success || data.authenticated) {
              this._router.navigate([this.returnUrl]);
            } else {
              this._toastr.error(data.messages[0]);
            }
          },
          error => {
            this._toastr.error(error);
          }
        );
    }
  }

  ngOnDestroy() {
    this._destroySubscribes$.next();
    this._destroySubscribes$.complete();
  }

}
