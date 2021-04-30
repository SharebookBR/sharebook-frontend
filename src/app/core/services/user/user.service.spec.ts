import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, inject } from '@angular/core/testing';

import { UserService } from './user.service';

import { AppConfigModule } from '../../../app-config.module';

describe('UserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppConfigModule, HttpClientTestingModule],
      providers: [UserService],
    });
  });

  it('should be created', inject([UserService], (service: UserService) => {
    expect(service).toBeTruthy();
  }));
});
