import { HttpClientTestingModule } from '@angular/common/http/testing';

import { TestBed, inject } from '@angular/core/testing';
import { AddressService } from './address.service';

describe('AddressService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AddressService],
    });
  });

  it('should ...', inject([AddressService], (service: AddressService) => {
    expect(service).toBeTruthy();
  }));
});
