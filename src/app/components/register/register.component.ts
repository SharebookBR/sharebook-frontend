import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ToastrService } from 'ngx-toastr';

import { UserService } from '../../core/services/user/user.service';

import { PasswordValidation } from '../../core/utils/passwordValidation';
import { AddressService } from '../../core/services/address/address.service';
import * as AppConst from '../../core/utils/app.const';
import { Address } from '../../core/models/address';

@Component({
  selector: 'app-form',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  formGroup: FormGroup;
  address = new Address();
  isGettingAddress: boolean;
  isMinor = false;

  private _destroySubscribes$ = new Subject<void>();

  constructor(
    private _scUser: UserService,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _AddressService: AddressService,
    private _toastr: ToastrService
  ) {
    this.formGroup = _formBuilder.group(
      {
        name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
        age: ['', [Validators.required, Validators.max(100), Validators.min(8)]],
        parentEmail: ['', [Validators.required, Validators.pattern(AppConst.emailPattern)]],
        email: ['', [Validators.required, Validators.pattern(AppConst.emailPattern)]],
        password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(32)]],
        confirmPassword: ['', [Validators.required]],
        phone: ['', [Validators.required, Validators.pattern(AppConst.phonePattern)]],
        postalCode: ['', [Validators.required, Validators.pattern(AppConst.postalCodePattern)]],
        street: ['', [Validators.required]],
        number: ['', [Validators.required]],
        complement: [''],
        neighborhood: ['', [Validators.required]],
        city: ['', [Validators.required]],
        state: ['', [Validators.required]],
        country: ['', [Validators.required]],
        allowSendingEmail: [true, null],
        acceptTermOfUse: [false, null],
        recaptchaReactive: new FormControl(null, Validators.required),
      },
      {
        validators: PasswordValidation.MatchPassword,
      }
    );
  }

  ngOnInit() {
    this.formGroup.controls['age'].valueChanges.subscribe((age) => {
      if (age < 12) {
        this.isMinor = true;
        this.formGroup.controls['parentEmail'].enable();
      } else {
        this.isMinor = false;
        this.formGroup.controls['parentEmail'].disable();
      }
    });
  }

  registerUser() {
    if (this.formGroup.valid) {
      this._scUser
        .register(this.formGroup.value)
        .pipe(takeUntil(this._destroySubscribes$))
        .subscribe(
          (data) => {
            if (data.success || data.authenticated) {
              const msg = data.successMessage ? data.successMessage : 'Registro realizado com sucesso';
              this._toastr.success(msg);
              this._router.navigate(['/']);
            } else {
              this._toastr.error(data.messages[0]);
            }
          },
          (error) => {
            this._toastr.error(error);
          }
        );
    }
  }

  getAddressByPostalCode(postalCode: string) {
    this.isGettingAddress = true;

    this._AddressService
      .getAddressByPostalCode(postalCode)
      .pipe(takeUntil(this._destroySubscribes$))
      .subscribe((address: Address) => {
        this.address = address;
        this.address.country = 'Brasil';
        this.formGroup.controls['street'].setValue(this.address.street.substring(0, 80));
        this.formGroup.controls['complement'].setValue(this.address.complement.substring(0, 50));
        this.formGroup.controls['neighborhood'].setValue(this.address.neighborhood.substring(0, 50));
        this.formGroup.controls['city'].setValue(this.address.city.substring(0, 50));
        this.formGroup.controls['state'].setValue(this.address.state.substring(0, 30));
        this.formGroup.controls['country'].setValue(this.address.country.substring(0, 50));
        this.isGettingAddress = false;
      });
  }

  ngOnDestroy() {
    this._destroySubscribes$.next();
    this._destroySubscribes$.complete();
  }
}
