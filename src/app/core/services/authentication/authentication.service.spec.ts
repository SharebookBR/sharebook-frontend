import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthenticationService } from './authentication.service';
import { UserService } from '../user/user.service';
import { AppConfigModule } from '../../../app-config.module';

describe('AuthenticationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppConfigModule, HttpClientTestingModule],
      providers: [AuthenticationService, UserService],
    });
  });

  it('should be created', inject(
    [AuthenticationService],
    (service: AuthenticationService) => {
      expect(service).toBeTruthy();
    }
  ));
});
