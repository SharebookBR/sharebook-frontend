import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { UserService } from '../../core/services/user/user.service';
import { ToastrService } from 'ngx-toastr';
import { PasswordValidation } from '../../core/utils/passwordValidation';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  formGroup: FormGroup;

  private _destroySubscribes$ = new Subject<void>();

  constructor(
    private _scUser: UserService,
    private _toastr: ToastrService,
    private _router: Router,
    private _formBuilder: FormBuilder
  ) {
    this.formGroup = _formBuilder.group(
      {
        oldPassword: ['', [Validators.required]],
        newPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(32)]],
        confirmPassword: ['', [Validators.required]]
      },
      {
        validators: PasswordValidation.MatchPassword
      }
    );
  }

  ngOnInit() {}

  changePassword() {
    if (this.formGroup.valid) {
      this._scUser.changePassword(this.formGroup.value)
      .pipe(
        takeUntil(this._destroySubscribes$)
      )
      .subscribe(
        data => {
          if (data.success || data.authenticated) {
            this._toastr.success('Senha atualizada com sucesso');
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
