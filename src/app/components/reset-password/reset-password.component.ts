import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { UserService } from '../../core/services/user/user.service';
import { AlertService } from '../../core/services/alert/alert.service';
import * as AppConst from '../../core/utils/app.const';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  formGroup: FormGroup;

  constructor(
    private _scUser: UserService,
    private _scAlert: AlertService,
    private _router: Router,
    private _formBuilder: FormBuilder
  ) {
    this.formGroup = _formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(AppConst.emailPattern)]]
    });
  }

  ngOnInit() {
  }

  resetPassword() {
    if (this.formGroup.valid) {
      this._scUser.resetPassword(this.formGroup.value.email).subscribe(
        data => {
          console.log(data.successMessage);
          if (data.success || data.authenticated) {
            alert(data.successMessage);
            this._router.navigate(['/panel']);
          } else {
            this._scAlert.error(data.messages[0]);
          }
        },
        error => {
          this._scAlert.error(error);
        }
      );
    }
  }

}
