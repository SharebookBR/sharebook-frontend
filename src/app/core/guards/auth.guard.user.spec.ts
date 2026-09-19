import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { authGuardUser } from './auth.guard.user';
import { BrowserStorageService } from '../services/platform/browser-storage.service';

describe('authGuardUser', () => {
  const storageKey = 'shareBookUser';

  beforeEach(() => {
    localStorage.removeItem(storageKey);
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [BrowserStorageService],
    });
  });

  afterEach(() => localStorage.removeItem(storageKey));

  it('allows activation when there is a logged-in user in storage', () => {
    localStorage.setItem(storageKey, JSON.stringify({ userId: '1' }));

    const result = TestBed.runInInjectionContext(() =>
      authGuardUser({} as any, { url: '/panel' } as any)
    );

    expect(result).toBeTrue();
  });

  it('redirects to /login with returnUrl and blocks activation when logged out', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigate');

    const result = TestBed.runInInjectionContext(() =>
      authGuardUser({} as any, { url: '/panel' } as any)
    );

    expect(result).toBeFalse();
    expect(navigateSpy).toHaveBeenCalledWith(['/login'], { queryParams: { returnUrl: '/panel' } });
  });
});
