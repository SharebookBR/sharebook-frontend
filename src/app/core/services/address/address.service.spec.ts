/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AddressService } from './address.service';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('AddressService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AddressService,
        HttpClient,
        HttpHandler
      ],
    });
  });

  it('should ...', inject([AddressService], (service: AddressService) => {
    expect(service).toBeTruthy();
  }));
});
