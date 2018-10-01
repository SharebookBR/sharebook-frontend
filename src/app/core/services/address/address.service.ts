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

  private convertResponseToAddress(addressNaResposta): Address {
    const address = new Address();

    address.PostalCode   = addressNaResposta.cep;
    address.Street       = addressNaResposta.logradouro;
    address.Complement   = addressNaResposta.complemento;
    address.Neighborhood = addressNaResposta.bairro;
    address.City         = addressNaResposta.localidade;
    address.State        = addressNaResposta.uf;
    return address;
  }
}
