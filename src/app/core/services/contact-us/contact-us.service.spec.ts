import { TestBed, inject } from '@angular/core/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';

import { ContactUsService } from './contact-us.service';
import { AppConfigModule } from '../../../app-config.module';

describe('ContactUsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContactUsService, HttpClient, HttpHandler],
      imports: [AppConfigModule]
    });
  });

  it('should be created', inject([ContactUsService], (service: ContactUsService) => {
    expect(service).toBeTruthy();
  }));
});
