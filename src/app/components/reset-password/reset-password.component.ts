import { Component, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ToastrService } from 'ngx-toastr';

import { UserService } from '../../core/services/user/user.service';
import * as AppConst from '../../core/utils/app.const';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnDestroy {
  formGroup: UntypedFormGroup;

  private _destroySubscribes$ = new Subject<void>();

  constructor(
    private _scUser: UserService,
    private _router: Router,
    private _formBuilder: UntypedFormBuilder,
    private _toastr: ToastrService
  ) {
    this.formGroup = _formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(AppConst.emailPattern)]]
    });
  }

  resetPassword() {
    if (this.formGroup.valid) {
      this._scUser.resetPassword(this.formGroup.value)
      .pipe(
        takeUntil(this._destroySubscribes$)
      )
      .subscribe(
        data => {
          if (data.success || data.authenticated) {
            this._toastr.info(data.successMessage);
            this._router.navigate(['/panel']);
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
