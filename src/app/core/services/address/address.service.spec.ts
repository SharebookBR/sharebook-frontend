import { Address } from './../../models/address';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { TestBed, inject } from '@angular/core/testing';
import { AddressService } from './address.service';
import * as AppConst from '../../../core/utils/app.const';

describe('AddressService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AddressService],
    });
  });

  afterEach(inject([HttpTestingController], (httpMock: HttpTestingController) => {
    httpMock.verify();
  }));

  it('should ...', inject([AddressService], (service: AddressService) => {
    expect(service).toBeTruthy();
  }));

  it('getAddressByPostalCode should return error', inject(
    [HttpTestingController, AddressService],
    (httpMock: HttpTestingController, service: AddressService) => {
      const viaCepData = {
        erro: true,
      };
      const addresObject = new Address();
      addresObject.postalCode = undefined;
      addresObject.street = undefined;
      addresObject.complement = undefined;
      addresObject.neighborhood = undefined;
      addresObject.city = undefined;
      addresObject.state = undefined;

      service.getAddressByPostalCode('99999999').subscribe((res) => {
        expect(res).toEqual(addresObject);
      });

      const req = httpMock.expectOne(AppConst.postalCodeWebService + '99999999/json/');
      expect(req.request.method).toBe('GET');
      req.flush(viaCepData);
    }
  ));

  it('getAddressByPostalCode should return address data', inject(
    [HttpTestingController, AddressService],
    (httpMock: HttpTestingController, service: AddressService) => {
      const viaCepData = {
        cep: '01310-940',
        logradouro: 'Avenida Paulista 900',
        complemento: '',
        bairro: 'Bela Vista',
        localidade: 'São Paulo',
        uf: 'SP',
        unidade: '',
        ibge: '3550308',
        gia: '1004',
      };
      const addresObject = new Address();
      addresObject.postalCode = viaCepData.cep;
      addresObject.street = viaCepData.logradouro;
      addresObject.complement = viaCepData.complemento;
      addresObject.neighborhood = viaCepData.bairro;
      addresObject.city = viaCepData.localidade;
      addresObject.state = viaCepData.uf;

      service.getAddressByPostalCode('01310940').subscribe((res) => {
        expect(res).toEqual(addresObject);
      });

      const req = httpMock.expectOne(AppConst.postalCodeWebService + '01310940/json/');
      expect(req.request.method).toBe('GET');
      req.flush(viaCepData);
    }
  ));
});
