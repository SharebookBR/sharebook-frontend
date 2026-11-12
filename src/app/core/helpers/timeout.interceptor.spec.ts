import { PLATFORM_ID } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { APP_CONFIG } from '../../app-config.module';
import { SSR_API_TIMEOUT_MS } from '../ssr/ssr-degraded';
import { timeoutInterceptor } from './timeout.interceptor';

describe('timeoutInterceptor', () => {
  const configure = (platformId: 'server' | 'browser') => {
    TestBed.configureTestingModule({
      providers: [
        { provide: PLATFORM_ID, useValue: platformId },
        { provide: APP_CONFIG, useValue: { apiEndpoint: 'http://api.test' } },
        provideHttpClient(withInterceptors([timeoutInterceptor])),
        provideHttpClientTesting(),
      ],
    });
  };

  it('no SSR, falha com TimeoutError quando a API não responde dentro do limite', fakeAsync(() => {
    configure('server');
    let caught: any;
    TestBed.inject(HttpClient)
      .get('http://api.test/book/Recommendations/1')
      .subscribe({ error: (err) => (caught = err) });

    TestBed.inject(HttpTestingController).expectOne('http://api.test/book/Recommendations/1');
    tick(SSR_API_TIMEOUT_MS - 1);
    expect(caught).toBeUndefined();

    tick(1);
    expect(caught?.name).toBe('TimeoutError');
  }));

  it('no SSR, resposta dentro do limite chega normalmente', fakeAsync(() => {
    configure('server');
    let body: any;
    TestBed.inject(HttpClient)
      .get('http://api.test/book/Slug/x')
      .subscribe((value) => (body = value));

    TestBed.inject(HttpTestingController).expectOne('http://api.test/book/Slug/x').flush({ id: '1' });
    tick(SSR_API_TIMEOUT_MS);

    expect(body).toEqual({ id: '1' });
  }));

  it('no navegador, não corta a chamada (rede móvel lenta não pode quebrar)', fakeAsync(() => {
    configure('browser');
    let caught: any;
    TestBed.inject(HttpClient)
      .get('http://api.test/book/Recommendations/1')
      .subscribe({ error: (err) => (caught = err) });

    TestBed.inject(HttpTestingController).expectOne('http://api.test/book/Recommendations/1');
    tick(SSR_API_TIMEOUT_MS * 5);

    expect(caught).toBeUndefined();
  }));

  it('não limita POST nem hosts que não são da nossa API', fakeAsync(() => {
    configure('server');
    const errors: any[] = [];
    const http = TestBed.inject(HttpClient);
    http.post('http://api.test/book', {}).subscribe({ error: (err) => errors.push(err) });
    http.get('https://viacep.com.br/ws/01001000/json').subscribe({ error: (err) => errors.push(err) });

    const controller = TestBed.inject(HttpTestingController);
    controller.expectOne('http://api.test/book');
    controller.expectOne('https://viacep.com.br/ws/01001000/json');
    tick(SSR_API_TIMEOUT_MS * 5);

    expect(errors).toEqual([]);
  }));
});
