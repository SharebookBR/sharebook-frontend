/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CepService } from './cep.service';

describe('Service: Cep', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CepService]
    });
  });

  it('should ...', inject([CepService], (service: CepService) => {
    expect(service).toBeTruthy();
  }));
});
