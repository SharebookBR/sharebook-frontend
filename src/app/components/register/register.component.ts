import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { UserService } from '../../core/services/user/user.service';
import { AlertService } from '../../core/services/alert/alert.service';

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
      email: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]],
      passwordSalt: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]],
      phone: ['', []],
      linkedin: ['', []],
      postalCode: ['', [Validators.required]]
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
