import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { UserService } from '../../core/services/user/user.service';
import { AlertService } from '../../core/services/alert/alert.service';
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
    private _scAlert: AlertService,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _AddressService: AddressService
  ) {

    this.formGroup = _formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
      email: ['', [Validators.required, Validators.pattern(AppConst.emailPattern)]],
      phone: ['', [Validators.pattern(AppConst.phonePattern)]],
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
    this._subscription = this._scUser.getUserData().subscribe(updateUserVM => {
      const foo = {
        name: updateUserVM.name,
        email: updateUserVM.email,
        phone: updateUserVM.phone,
        linkedin: updateUserVM.linkedin,
        Address: {
          postalCode: updateUserVM.address.postalCode,
          street: updateUserVM.address.street,
          number: updateUserVM.address.number,
          complement: updateUserVM.address.complement,
          neighborhood: updateUserVM.address.neighborhood,
          city: updateUserVM.address.city,
          state: updateUserVM.address.state,
          country: updateUserVM.address.country
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

  getAddressByPostalCode(postalCode: string) {

    this.isGettingAddress = true;

    this._AddressService.getAddressByPostalCode(postalCode)
      .subscribe((address: Address) => {

        this.address = address;
        this.address.country = 'Brasil';
        this.formGroup['controls'].Address['controls'].street.setValue(this.address.street);
        this.formGroup['controls'].Address['controls'].complement.setValue(this.address.complement);
        this.formGroup['controls'].Address['controls'].neighborhood.setValue(this.address.neighborhood);
        this.formGroup['controls'].Address['controls'].city.setValue(this.address.city);
        this.formGroup['controls'].Address['controls'].state.setValue(this.address.state);
        this.formGroup['controls'].Address['controls'].country.setValue(this.address.country);
        this.isGettingAddress = false;

      });
  }
}
