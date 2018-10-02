import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Address } from '../../models/address';

@Injectable()
export class AddressService {

  resultado: Address;
  constructor(private http: HttpClient) { }

  getAddressByPostalCode(cep: string) {
    return this.http
      .get(`https://viacep.com.br/ws/${cep}/json/`)
      .map(data => this.resultado = this.convertResponseToAddress(data));
  }

  private convertResponseToAddress(addressResponse): Address {
    const address = new Address();

    address.PostalCode   = addressResponse.cep;
    address.Street       = addressResponse.logradouro;
    address.Complement   = addressResponse.complemento;
    address.Neighborhood = addressResponse.bairro;
    address.City         = addressResponse.localidade;
    address.State        = addressResponse.uf;
    return address;
  }
}
