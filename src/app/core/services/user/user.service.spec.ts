import { TestBed, inject } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { UserService } from './user.service';
import { BrowserStorageService } from '../platform/browser-storage.service';
import { APP_CONFIG } from '../../../app-config.module';

describe('UserService', () => {
  const config = { apiEndpoint: 'http://api.test' };
  const storageKey = 'shareBookUser';

  beforeEach(() => {
    localStorage.removeItem(storageKey);
    TestBed.configureTestingModule({
      providers: [
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

  it('setLoggedUser/getLoggedUser: broadcasts the logged user to subscribers', inject(
    [UserService],
    (service: UserService) => {
      const received: any[] = [];
      service.getLoggedUser().subscribe((u) => received.push(u));

      const user = { userId: '1', name: 'Vagner' };
      service.setLoggedUser(user as any);

      expect(received).toEqual([user]);
    }
  ));

  it('getLoggedUserFromLocalStorage: parses the stored user when present', inject(
    [UserService],
    (service: UserService) => {
      const user = { userId: '1', name: 'Vagner' };
      localStorage.setItem(storageKey, JSON.stringify(user));

      expect(service.getLoggedUserFromLocalStorage()).toEqual(user);
    }
  ));

  it('getLoggedUserFromLocalStorage: returns undefined when nothing is stored', inject(
    [UserService],
    (service: UserService) => {
      expect(service.getLoggedUserFromLocalStorage()).toBeUndefined();
    }
  ));

  it('register: on response.authenticated, persists the user and publishes it', inject(
    [HttpTestingController, UserService],
    (httpMock: HttpTestingController, service: UserService) => {
      const received: any[] = [];
      service.getLoggedUser().subscribe((u) => received.push(u));

      let resolved: any;
      service.register({ email: 'new@test.com' } as any).subscribe((r) => (resolved = r));

      const req = httpMock.expectOne(`${config.apiEndpoint}/Account/Register`);
      expect(req.request.method).toBe('POST');

      const response = { authenticated: true, userId: '2' };
      req.flush(response);

      expect(resolved).toEqual(response);
      expect(JSON.parse(localStorage.getItem(storageKey))).toEqual(response);
      expect(received).toEqual([response]);
    }
  ));

  it('register: when not authenticated, resolves the response but does not touch storage', inject(
    [HttpTestingController, UserService],
    (httpMock: HttpTestingController, service: UserService) => {
      let resolved: any;
      service.register({ email: 'new@test.com' } as any).subscribe((r) => (resolved = r));

      const req = httpMock.expectOne(`${config.apiEndpoint}/Account/Register`);
      const response = { authenticated: false, messages: ['E-mail já cadastrado'] };
      req.flush(response);

      expect(resolved).toEqual(response);
      expect(localStorage.getItem(storageKey)).toBeNull();
    }
  ));

  it('getUserData: GETs /Account', inject(
    [HttpTestingController, UserService],
    (httpMock: HttpTestingController, service: UserService) => {
      service.getUserData().subscribe();
      const req = httpMock.expectOne(`${config.apiEndpoint}/Account`);
      expect(req.request.method).toBe('GET');
      req.flush({});
    }
  ));

  it('update: PUTs the profile to /Account', inject(
    [HttpTestingController, UserService],
    (httpMock: HttpTestingController, service: UserService) => {
      const userInfo = { name: 'Vagner' } as any;
      service.update(userInfo).subscribe();
      const req = httpMock.expectOne(`${config.apiEndpoint}/Account`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toBe(userInfo);
      req.flush({});
    }
  ));

  it('getProfile: GETs /account/profile', inject(
    [HttpTestingController, UserService],
    (httpMock: HttpTestingController, service: UserService) => {
      service.getProfile().subscribe();
      const req = httpMock.expectOne(`${config.apiEndpoint}/account/profile`);
      expect(req.request.method).toBe('GET');
      req.flush({});
    }
  ));

  it('whoAccessed: reads the userId from the stored session and includes it in the URL', inject(
    [HttpTestingController, UserService],
    (httpMock: HttpTestingController, service: UserService) => {
      localStorage.setItem(storageKey, JSON.stringify({ userId: '42' }));

      service.whoAccessed().subscribe();

      const req = httpMock.expectOne(`${config.apiEndpoint}/Account/WhoAccessed/42`);
      expect(req.request.method).toBe('GET');
      req.flush([]);
    }
  ));

  it('whoAccessed: falls back to an empty userId segment when nothing is stored', inject(
    [HttpTestingController, UserService],
    (httpMock: HttpTestingController, service: UserService) => {
      service.whoAccessed().subscribe();

      const req = httpMock.expectOne(`${config.apiEndpoint}/Account/WhoAccessed/`);
      expect(req.request.method).toBe('GET');
      req.flush([]);
    }
  ));

  it('unsubscribe: GETs /Account/Unsubscribe with userId and token as query params', inject(
    [HttpTestingController, UserService],
    (httpMock: HttpTestingController, service: UserService) => {
      service.unsubscribe('7', 'tok-123').subscribe();

      const req = httpMock.expectOne(
        (r) => r.url === `${config.apiEndpoint}/Account/Unsubscribe`
      );
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('userId')).toBe('7');
      expect(req.request.params.get('token')).toBe('tok-123');
      req.flush({ success: true });
    }
  ));
});
