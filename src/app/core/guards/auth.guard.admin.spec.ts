import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { authGuardAdmin } from './auth.guard.admin';
import { UserService } from '../services/user/user.service';
import { BrowserStorageService } from '../services/platform/browser-storage.service';
import { APP_CONFIG } from '../../app-config.module';

describe('authGuardAdmin', () => {
  const storageKey = 'shareBookUser';

  beforeEach(() => {
    localStorage.removeItem(storageKey);
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        UserService,
        BrowserStorageService,
        { provide: APP_CONFIG, useValue: { apiEndpoint: 'http://api.test' } },
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
  });

  afterEach(() => localStorage.removeItem(storageKey));

  it('allows activation when the logged-in user has the Administrator profile', () => {
    localStorage.setItem(storageKey, JSON.stringify({ userId: '1', profile: 'Administrator' }));

    const result = TestBed.runInInjectionContext(() =>
      authGuardAdmin({} as any, { url: '/book/list' } as any)
    );

    expect(result).toBeTrue();
  });

  it('redirects to / and blocks activation for a non-admin user', () => {
    localStorage.setItem(storageKey, JSON.stringify({ userId: '1', profile: 'Regular' }));
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigate');

    const result = TestBed.runInInjectionContext(() =>
      authGuardAdmin({} as any, { url: '/book/list' } as any)
    );

    expect(result).toBeFalse();
    expect(navigateSpy).toHaveBeenCalledWith(['/'], { queryParams: { returnUrl: '/book/list' } });
  });

  it('redirects to / when logged out', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigate');

    const result = TestBed.runInInjectionContext(() =>
      authGuardAdmin({} as any, { url: '/book/list' } as any)
    );

    expect(result).toBeFalse();
    expect(navigateSpy).toHaveBeenCalled();
  });
});
