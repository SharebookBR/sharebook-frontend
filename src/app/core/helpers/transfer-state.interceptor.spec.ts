import { PLATFORM_ID, TransferState, makeStateKey } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { transferStateInterceptor } from './transfer-state.interceptor';

describe('transferStateInterceptor', () => {
  function configure(platform: 'browser' | 'server') {
    TestBed.configureTestingModule({
      providers: [
        TransferState,
        { provide: PLATFORM_ID, useValue: platform },
        provideHttpClient(withInterceptors([transferStateInterceptor])),
        provideHttpClientTesting(),
      ],
    });
  }

  afterEach(() => TestBed.inject(HttpTestingController).verify());

  it('does not touch non-GET requests', () => {
    configure('browser');

    TestBed.inject(HttpClient).post('http://api.test/book', {}).subscribe();

    const req = TestBed.inject(HttpTestingController).expectOne('http://api.test/book');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('on the browser, serves a stored key from TransferState instead of hitting the network', () => {
    configure('browser');
    const transferState = TestBed.inject(TransferState);
    const url = 'http://api.test/book/1';
    transferState.set(makeStateKey<any>(url), { id: '1', title: 'Cached Book' });

    let result: any;
    TestBed.inject(HttpClient).get(url).subscribe((r) => (result = r));

    TestBed.inject(HttpTestingController).expectNone(url);
    expect(result).toEqual({ id: '1', title: 'Cached Book' });
    expect(transferState.hasKey(makeStateKey(url))).toBeFalse();
  });

  it('on the browser without a stored key, falls through to the network', () => {
    configure('browser');

    let result: any;
    TestBed.inject(HttpClient).get('http://api.test/book/1').subscribe((r) => (result = r));

    const req = TestBed.inject(HttpTestingController).expectOne('http://api.test/book/1');
    req.flush({ id: '1' });

    expect(result).toEqual({ id: '1' });
  });

  it('on the server, stores the response body in TransferState after the request resolves', () => {
    configure('server');
    const transferState = TestBed.inject(TransferState);
    const url = 'http://api.test/book/1';

    TestBed.inject(HttpClient).get(url).subscribe();

    const req = TestBed.inject(HttpTestingController).expectOne(url);
    req.flush({ id: '1', title: 'Server Book' });

    expect(transferState.get(makeStateKey<any>(url), null)).toEqual({ id: '1', title: 'Server Book' });
  });
});
