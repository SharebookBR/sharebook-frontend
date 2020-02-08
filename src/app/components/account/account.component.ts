import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { UserService } from '../../core/services/user/user.service';
import { ToastrService } from 'ngx-toastr';
import { AddressService } from '../../core/services/address/address.service';
import * as AppConst from '../../core/utils/app.const';
import { Address } from '../../core/models/address';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  formGroup: FormGroup;
  private _subscription: Subscription;
  address = new Address();
  isGettingAddress: boolean;

  constructor(
    private _scUser: UserService,
    private _toastr: ToastrService,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _AddressService: AddressService
  ) {

    this.formGroup = _formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
      email: ['', [Validators.required, Validators.pattern(AppConst.emailPattern)]],
      phone: ['', [Validators.required, Validators.pattern(AppConst.phonePattern)]],
      linkedin: ['', [Validators.pattern(AppConst.linkedInUrlPattern)]],
      Address: _formBuilder.group({
        postalCode: ['', [Validators.required, Validators.pattern(AppConst.postalCodePattern)]],
        street: ['', [Validators.required]],
        number: ['', [Validators.required]],
        complement: [''],
        neighborhood: ['', [Validators.required]],
        city: ['', [Validators.required]],
        state: ['', [Validators.required]],
        country: ['', [Validators.required]]
      })
    });
  }

  ngOnInit() {
    this._subscription = this._scUser.getUserData().subscribe(userInfo => {
      const foo = {
        name: userInfo.name,
        email: userInfo.email,
        phone: userInfo.phone,
        linkedin: userInfo.linkedin,
        allowSendingEmail: [true, null],
        Address: {
          postalCode: userInfo.address.postalCode,
          street: userInfo.address.street,
          number: userInfo.address.number,
          complement: userInfo.address.complement,
          neighborhood: userInfo.address.neighborhood,
          city: userInfo.address.city,
          state: userInfo.address.state,
          country: userInfo.address.country
        }
      };
      this.formGroup.setValue(foo);
    });
  }

  updateUser() {
    if (this.formGroup.valid) {
      this._scUser.update(this.formGroup.value).subscribe(
        data => {
          if (data.success || data.authenticated) {
            this._toastr.success('Registro atualizado com sucesso');
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

  onGetAddressByPostalCode() {
    this.getAddressByPostalCode(this.formGroup['controls'].Address['controls'].postalCode.value);
  }

  getAddressByPostalCode(postalCode: string) {

    this.isGettingAddress = true;

    this._AddressService.getAddressByPostalCode(postalCode)
      .subscribe((address: Address) => {

        this.address = address;
        this.address.country = 'Brasil';
        this.formGroup['controls'].Address['controls'].street.setValue(this.address.street.substring(0, 80));
        this.formGroup['controls'].Address['controls'].neighborhood.setValue(this.address.neighborhood.substring(0, 50));
        this.formGroup['controls'].Address['controls'].city.setValue(this.address.city.substring(0, 50));
        this.formGroup['controls'].Address['controls'].state.setValue(this.address.state.substring(0, 30));
        this.formGroup['controls'].Address['controls'].country.setValue(this.address.country.substring(0, 50));
        this.isGettingAddress = false;

      });
  }
}
