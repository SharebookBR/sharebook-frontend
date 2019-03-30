import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import { UserService } from '../../core/services/user/user.service';
import { ToastrService } from 'ngx-toastr';
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
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _toastr: ToastrService
  ) {
    this.formGroup = _formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(AppConst.emailPattern)]]
    });
  }

  ngOnInit() {
  }

  resetPassword() {
    if (this.formGroup.valid) {
      this._scUser.resetPassword(this.formGroup.value).subscribe(
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

}
