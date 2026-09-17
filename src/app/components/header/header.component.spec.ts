import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { AuthenticationService } from '../../core/services/authentication/authentication.service';
import { EnvironmentSwitcherService } from '../../core/services/environment-switcher/environment-switcher.service';
import { UserService } from '../../core/services/user/user.service';
import { HeaderComponent } from './header.component';

@Component({ selector: 'app-input-search', template: '' })
class InputSearchStubComponent {
  @Output() searchSubmitted = new EventEmitter<string>();
  focus = jasmine.createSpy('focus');
}

describe('HeaderComponent mobile search', () => {
  let fixture: ComponentFixture<HeaderComponent>;
  let component: HeaderComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, MatIconModule, RouterTestingModule],
      declarations: [HeaderComponent, InputSearchStubComponent],
      providers: [
        {
          provide: UserService,
          useValue: {
            getLoggedUserFromLocalStorage: () => null,
            getLoggedUser: () => of(null),
          },
        },
        {
          provide: AuthenticationService,
          useValue: { checkTokenValidity: () => undefined, logout: () => undefined },
        },
        {
          provide: EnvironmentSwitcherService,
          useValue: { isDevMode: () => false },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('opens the mobile search and moves focus into its input', fakeAsync(() => {
    const toggle = fixture.debugElement.query(By.css('.mobile-top-bar__search-toggle'));

    toggle.triggerEventHandler('click', new Event('click'));
    fixture.detectChanges();
    tick();

    const search = fixture.debugElement.query(By.directive(InputSearchStubComponent));
    expect(component.mobileSearchOpen).toBeTrue();
    expect(toggle.attributes['aria-expanded']).toBe('true');
    expect(search.componentInstance.focus).toHaveBeenCalled();
  }));

  it('closes after submitting while preserving navigation focus behavior', fakeAsync(() => {
    component.toggleMobileSearch();
    fixture.detectChanges();
    tick();
    const search = fixture.debugElement.query(By.directive(InputSearchStubComponent));

    search.componentInstance.searchSubmitted.emit('odisseia');
    fixture.detectChanges();

    expect(component.mobileSearchOpen).toBeFalse();
    expect(fixture.debugElement.query(By.css('#mobile-search-panel'))).toBeNull();
  }));

  it('returns focus to the toggle when Escape closes the search', fakeAsync(() => {
    const toggle = fixture.debugElement.query(By.css('.mobile-top-bar__search-toggle'));
    const focusSpy = spyOn(toggle.nativeElement, 'focus');
    component.toggleMobileSearch();
    fixture.detectChanges();
    tick();

    component.handleEscape();
    fixture.detectChanges();
    tick();

    expect(component.mobileSearchOpen).toBeFalse();
    expect(focusSpy).toHaveBeenCalled();
  }));
});
