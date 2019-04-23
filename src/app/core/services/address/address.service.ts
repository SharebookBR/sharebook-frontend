import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';

import { Address } from '../../models/address';
import * as AppConst from '../../../core/utils/app.const';

@Injectable()
export class AddressService {
  resultado: Address;

  constructor(private http: HttpClient) {}

  getAddressByPostalCode(cep: string) {
    return this.http
      .get(AppConst.postalCodeWebService + `${cep}/json/`)
      .pipe(map(data => (this.resultado = this.convertResponseToAddress(data))));
  }

  private convertResponseToAddress(addressResponse): Address {
    const address = new Address();

    address.postalCode = addressResponse.cep;
    address.street = addressResponse.logradouro;
    address.complement = addressResponse.complemento;
    address.neighborhood = addressResponse.bairro;
    address.city = addressResponse.localidade;
    address.state = addressResponse.uf;
    return address;
  }
}
