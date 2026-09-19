import { TestBed, inject } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthenticationService } from './authentication.service';
import { UserService } from '../user/user.service';
import { BrowserStorageService } from '../platform/browser-storage.service';
import { APP_CONFIG } from '../../../app-config.module';

function getStoredUser(key: string): any {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : null;
}

describe('AuthenticationService', () => {
  const config = { apiEndpoint: 'http://api.test' };
  const storageKey = 'shareBookUser';

  beforeEach(() => {
    localStorage.removeItem(storageKey);
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        AuthenticationService,
        UserService,
        BrowserStorageService,
        { provide: APP_CONFIG, useValue: config },
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
  });

  afterEach(inject([HttpTestingController], (httpMock: HttpTestingController) => {
    httpMock.verify();
    localStorage.removeItem(storageKey);
  }));

  it('login: on success (response.success), persists user in localStorage, publishes it via UserService and resolves response.value', inject(
    [HttpTestingController, AuthenticationService, UserService],
    (httpMock: HttpTestingController, service: AuthenticationService, userService: UserService) => {
      const loggedUsers: any[] = [];
      userService.getLoggedUser().subscribe((u) => loggedUsers.push(u));

      let resolved: any;
      service.login('user@test.com', '123456').subscribe((value) => (resolved = value));

      const req = httpMock.expectOne(`${config.apiEndpoint}/Account/Login/`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ email: 'user@test.com', password: '123456' });
      expect(req.request.headers.get('x-requested-with')).toBe('web');

      const value = { userId: '1', token: 'abc' };
      req.flush({ success: true, value });

      expect(resolved).toEqual(value);
      expect(getStoredUser(storageKey)).toEqual(value);
      expect(loggedUsers).toEqual([value]);
    }
  ));

  it('login: also treats response.value.authenticated as success (alternate success shape)', inject(
    [HttpTestingController, AuthenticationService],
    (httpMock: HttpTestingController, service: AuthenticationService) => {
      let resolved: any;
      service.login('user@test.com', '123456').subscribe((value) => (resolved = value));

      const req = httpMock.expectOne(`${config.apiEndpoint}/Account/Login/`);
      const value = { authenticated: true, token: 'xyz' };
      req.flush({ success: false, value });

      expect(resolved).toEqual(value);
      expect(getStoredUser(storageKey)).toEqual(value);
    }
  ));

  it('login: on failure, does not touch localStorage but still resolves response.value', inject(
    [HttpTestingController, AuthenticationService],
    (httpMock: HttpTestingController, service: AuthenticationService) => {
      let resolved: any;
      service.login('user@test.com', 'wrong').subscribe((value) => (resolved = value));

      const req = httpMock.expectOne(`${config.apiEndpoint}/Account/Login/`);
      const value = { message: 'Invalid credentials' };
      req.flush({ success: false, value });

      expect(resolved).toEqual(value);
      expect(localStorage.getItem(storageKey)).toBeNull();
    }
  ));

  it('logout: clears the stored user and publishes null through UserService', inject(
    [AuthenticationService, UserService],
    (service: AuthenticationService, userService: UserService) => {
      localStorage.setItem(storageKey, JSON.stringify({ userId: '1' }));
      const loggedUsers: any[] = [];
      userService.getLoggedUser().subscribe((u) => loggedUsers.push(u));

      service.logout();

      expect(localStorage.getItem(storageKey)).toBeNull();
      expect(loggedUsers).toEqual([null]);
    }
  ));

  it('checkTokenValidity: does nothing when there is no stored user', inject(
    [AuthenticationService],
    (service: AuthenticationService) => {
      expect(() => service.checkTokenValidity()).not.toThrow();
      expect(localStorage.getItem(storageKey)).toBeNull();
    }
  ));

  it('checkTokenValidity: logs out when the stored token is already expired', inject(
    [AuthenticationService],
    (service: AuthenticationService) => {
      const expired = new Date(Date.now() - 60_000).toISOString();
      localStorage.setItem(storageKey, JSON.stringify({ userId: '1', expiration: expired }));

      service.checkTokenValidity();

      expect(localStorage.getItem(storageKey)).toBeNull();
    }
  ));

  it('checkTokenValidity: keeps the session when the token is still valid', inject(
    [AuthenticationService],
    (service: AuthenticationService) => {
      const future = new Date(Date.now() + 60 * 60_000).toISOString();
      localStorage.setItem(storageKey, JSON.stringify({ userId: '1', expiration: future }));

      service.checkTokenValidity();

      expect(localStorage.getItem(storageKey)).not.toBeNull();
    }
  ));
});
