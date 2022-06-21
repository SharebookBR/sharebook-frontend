import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, inject } from '@angular/core/testing';

import { MeetupService } from './meetup.service';

import { AppConfigModule } from '../../../app-config.module';

describe('BookService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppConfigModule, HttpClientTestingModule],
      providers: [MeetupService],
    });
  });

  it('should be created', inject([MeetupService], (service: MeetupService) => {
    expect(service).toBeTruthy();
  }));
});
