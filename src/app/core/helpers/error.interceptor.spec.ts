import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpErrorResponse, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { errorInterceptor } from './error.interceptor';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { PlatformService } from '../services/platform/platform.service';

describe('errorInterceptor', () => {
  let logoutSpy: jasmine.Spy;
  let reloadSpy: jasmine.Spy;
  let isBrowserSpy: jasmine.Spy;

  beforeEach(() => {
    logoutSpy = jasmine.createSpy('logout');
    reloadSpy = jasmine.createSpy('reload');
    isBrowserSpy = jasmine.createSpy('isBrowser').and.returnValue(true);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthenticationService, useValue: { logout: logoutSpy } },
        { provide: PlatformService, useValue: { reload: reloadSpy, isBrowser: isBrowserSpy } },
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
      ],
    });
  });

  afterEach(() => TestBed.inject(HttpTestingController).verify());

  it('on a 401 response, logs the user out and reloads the app', () => {
    let caught: any;
    TestBed.inject(HttpClient)
      .get('http://api.test/book/1')
      .subscribe({ error: (err) => (caught = err) });

    const req = TestBed.inject(HttpTestingController).expectOne('http://api.test/book/1');
    req.flush({ messages: ['Sessão expirada'] }, { status: 401, statusText: 'Unauthorized' });

    expect(logoutSpy).toHaveBeenCalled();
    expect(reloadSpy).toHaveBeenCalled();
    expect(caught).toEqual(['Sessão expirada']);
  });

  it('on a non-401 error, rethrows the error message without logging out', () => {
    let caught: any;
    TestBed.inject(HttpClient)
      .get('http://api.test/book/1')
      .subscribe({ error: (err) => (caught = err) });

    const req = TestBed.inject(HttpTestingController).expectOne('http://api.test/book/1');
    req.flush({ messages: ['Livro não encontrado'] }, { status: 404, statusText: 'Not Found' });

    expect(logoutSpy).not.toHaveBeenCalled();
    expect(reloadSpy).not.toHaveBeenCalled();
    expect(caught).toEqual(['Livro não encontrado']);
  });

  it('logs the error to the console when running outside the browser (SSR)', () => {
    isBrowserSpy.and.returnValue(false);
    const consoleSpy = spyOn(console, 'error');

    TestBed.inject(HttpClient)
      .get('http://api.test/book/1')
      .subscribe({ error: () => {} });

    const req = TestBed.inject(HttpTestingController).expectOne('http://api.test/book/1');
    req.flush({ messages: ['Falha de rede'] }, { status: 500, statusText: 'Server Error' });

    expect(consoleSpy).toHaveBeenCalled();
  });
});
