import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthenticationService } from '../../core/services/authentication/authentication.service';
import { AlertService } from '../../core/services/alert/alert.service';

@Component({
  selector: 'app-form',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formGroup: FormGroup;
  returnUrl: string;

  constructor(
    private _scAuthentication: AuthenticationService,
    private _scAlert: AlertService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _formBuilder: FormBuilder
  ) {
    this.formGroup = _formBuilder.group({
      email: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit() {

        // reset login status
        this._scAuthentication.logout();

        // get return url from route parameters or default to '/'
        this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';

  }

  loginUser() {
    if (this.formGroup.valid) {
      this._scAuthentication.login(
        this.formGroup.value.email,
        this.formGroup.value.password).subscribe(
          data => {
            if (data.success || data.authenticated) {
              this._router.navigate([this.returnUrl]);
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
