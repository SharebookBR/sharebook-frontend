/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AddressService } from './address.service';

describe('Service: Cep', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AddressService]
    });
  });

  it('should ...', inject([AddressService], (service: AddressService) => {
    expect(service).toBeTruthy();
  }));
});
