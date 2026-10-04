import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { jwtInterceptor } from './jwt.interceptor';
import { BrowserStorageService } from '../services/platform/browser-storage.service';
import * as AppConst from '../utils/app.const';
import { APP_CONFIG } from '../../app-config.module';

describe('jwtInterceptor', () => {
  const storageKey = 'shareBookUser';

  beforeEach(() => {
    localStorage.removeItem(storageKey);
    TestBed.configureTestingModule({
      providers: [
        BrowserStorageService,
        { provide: APP_CONFIG, useValue: { apiEndpoint: 'http://api.test' } },
        provideHttpClient(withInterceptors([jwtInterceptor])),
        provideHttpClientTesting(),
      ],
    });
  });

  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
    localStorage.removeItem(storageKey);
  });

  it('adds the Authorization header when a session with accessToken is stored', () => {
    localStorage.setItem(storageKey, JSON.stringify({ accessToken: 'abc123' }));

    TestBed.inject(HttpClient).get('http://api.test/book/1').subscribe();

    const req = TestBed.inject(HttpTestingController).expectOne('http://api.test/book/1');
    expect(req.request.headers.get('Authorization')).toBe('Bearer abc123');
    req.flush({});
  });

  it('does not add the header when there is no stored session', () => {
    TestBed.inject(HttpClient).get('http://api.test/book/1').subscribe();

    const req = TestBed.inject(HttpTestingController).expectOne('http://api.test/book/1');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({});
  });

  it('does not add the header to the postal-code lookup service, even with a session stored', () => {
    localStorage.setItem(storageKey, JSON.stringify({ accessToken: 'abc123' }));

    TestBed.inject(HttpClient).get(`${AppConst.postalCodeWebService}01310940/json/`).subscribe();

    const req = TestBed.inject(HttpTestingController).expectOne(
      `${AppConst.postalCodeWebService}01310940/json/`
    );
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({});
  });

  it('does not leak the token to other hosts, such as a presigned S3 URL', () => {
    localStorage.setItem(storageKey, JSON.stringify({ accessToken: 'abc123' }));
    const s3Url = 'https://bucket.s3.amazonaws.com/livro.pdf?X-Amz-Signature=x';

    TestBed.inject(HttpClient).get(s3Url).subscribe();

    const req = TestBed.inject(HttpTestingController).expectOne(s3Url);
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({});
  });

  it('does not match a host that merely starts with the API endpoint', () => {
    localStorage.setItem(storageKey, JSON.stringify({ accessToken: 'abc123' }));
    const lookalike = 'http://api.test.evil.com/steal';

    TestBed.inject(HttpClient).get(lookalike).subscribe();

    const req = TestBed.inject(HttpTestingController).expectOne(lookalike);
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({});
  });
});
