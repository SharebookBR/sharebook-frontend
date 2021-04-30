import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, inject } from '@angular/core/testing';

import { ContactUsService } from './contact-us.service';
import { AppConfigModule } from '../../../app-config.module';

describe('ContactUsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppConfigModule, HttpClientTestingModule],
      providers: [ContactUsService],
    });
  });

  it('should be created', inject(
    [ContactUsService],
    (service: ContactUsService) => {
      expect(service).toBeTruthy();
    }
  ));
});
