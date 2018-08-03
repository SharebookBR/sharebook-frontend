import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { UserService } from '../../core/services/user/user.service';
import { AlertService } from '../../core/services/alert/alert.service';
import { PasswordValidation } from '../../core/utils/passwordValidation';
import * as AppConst from '../../core/utils/app.const';

@Component({
  selector: 'app-form',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  formGroup: FormGroup;

  constructor(
    private _scUser: UserService,
    private _scAlert: AlertService,
    private _router: Router,
    private _formBuilder: FormBuilder
  ) {
    this.formGroup = _formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.pattern(AppConst.emailPattern)]],
      password: ['', [Validators.required, Validators.pattern(AppConst.passwordPattern)]],
      confirmPassword: ['', [Validators.required]],
      phone: ['', [Validators.pattern(AppConst.phonePattern)]],
      linkedin: ['', [Validators.pattern(AppConst.linkedInUrlPattern)]],
      postalCode: ['', [Validators.required, Validators.pattern(AppConst.postalCodePattern)]]
    }, {
      validator: PasswordValidation.MatchPassword
    });
  }

  ngOnInit() {
  }

  registerUser() {
    if (this.formGroup.valid) {
      this._scUser.register(this.formGroup.value).subscribe(
        data => {
          if (data.success || data.authenticated) {
            this._scAlert.success('Registro realizado com sucesso', true);
            this._router.navigate(['/']);
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
