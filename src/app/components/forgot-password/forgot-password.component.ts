import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { UserService } from '../../core/services/user/user.service';
import { ToastrService } from 'ngx-toastr';
import { PasswordValidation } from '../../core/utils/passwordValidation';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  formGroup: FormGroup;

  private _destroySubscribes$ = new Subject<void>();

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _scUser: UserService,
    private _toastr: ToastrService
  ) {
    this.formGroup = _formBuilder.group(
      {
        hashCodePassword: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(32)]],
        confirmPassword: ['', [Validators.required]]
      },
      {
        validators: PasswordValidation.MatchPassword
      }
    );
  }

  ngOnInit() {
    let hashCodePassword = '';
    this._activatedRoute.params
    .pipe(
      takeUntil(this._destroySubscribes$)
    )
    .subscribe(param => {
      hashCodePassword = param.hashCodePassword;

      const changeUserPasswordByHashCodeVM = {
        hashCodePassword: hashCodePassword,
        newPassword: '',
        confirmPassword: ''
      };

      this.formGroup.setValue(changeUserPasswordByHashCodeVM);
    });
  }

  changePassword() {
    if (this.formGroup.valid) {
      this._scUser.changeUserPasswordByHashCode(this.formGroup.value)
      .pipe(
        takeUntil(this._destroySubscribes$)
      )
      .subscribe(
        data => {
          if (data.success || data.authenticated) {
            this._toastr.success('Senha atualizada com sucesso');
            this._router.navigate(['/login']);
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
