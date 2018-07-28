import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { UserService } from '../../core/services/user/user.service';
import { AlertService } from '../../core/services/alert/alert.service';
import * as AppConst from '../../core/utils/app.const';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  formGroup: FormGroup;
  private _subscription: Subscription;

  constructor(
    private _scUser: UserService,
    private _scAlert: AlertService,
    private _router: Router,
    private _formBuilder: FormBuilder
  ) {

    this.formGroup = _formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.pattern(AppConst.emailPattern)]],
      phone: ['', [Validators.pattern(AppConst.phonePattern)]],
      linkedin: ['', [Validators.pattern(AppConst.linkedInUrlPattern)]],
      postalCode: ['', [Validators.required, Validators.pattern(AppConst.postalCodePattern)]]
    });
  }

  ngOnInit() {
    this._subscription = this._scUser.getUserData().subscribe(updateUserVM => {
      const foo = {
        name: updateUserVM.name,
        email: updateUserVM.email,
        phone: updateUserVM.phone,
        linkedin: updateUserVM.linkedin,
        postalCode: updateUserVM.postalCode
      };
      this.formGroup.setValue(foo);
    });
  }

  updateUser() {
    if (this.formGroup.valid) {
      this._scUser.update(this.formGroup.value).subscribe(
        data => {
          if (data.success || data.authenticated) {
            this._scAlert.success('Registro atualizado com sucesso', true);
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
