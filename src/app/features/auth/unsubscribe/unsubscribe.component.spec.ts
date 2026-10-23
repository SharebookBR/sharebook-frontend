import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, of, throwError } from 'rxjs';

import { GoogleAnalyticsService } from 'src/app/core/services/analytics/google-analytics.service';
import { UserService } from 'src/app/core/services/user/user.service';
import { UnsubscribeComponent } from './unsubscribe.component';

describe('UnsubscribeComponent', () => {
  let component: UnsubscribeComponent;
  let fixture: ComponentFixture<UnsubscribeComponent>;
  let queryParams: BehaviorSubject<Record<string, string>>;

  const userServiceMock = {
    unsubscribe: jasmine.createSpy('unsubscribe'),
  };
  const googleAnalyticsMock = {
    sendEvent: jasmine.createSpy('sendEvent'),
  };

  beforeEach(async () => {
    queryParams = new BehaviorSubject({ userId: 'user-id', token: 'token' });
    userServiceMock.unsubscribe.calls.reset();
    googleAnalyticsMock.sendEvent.calls.reset();

    await TestBed.configureTestingModule({
      declarations: [UnsubscribeComponent],
      imports: [MatButtonModule, MatProgressSpinnerModule, RouterTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: { queryParams } },
        { provide: UserService, useValue: userServiceMock },
        { provide: GoogleAnalyticsService, useValue: googleAnalyticsMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UnsubscribeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('opens a confirmation screen without calling the API', () => {
    expect(component.state).toBe('confirm');
    expect(userServiceMock.unsubscribe).not.toHaveBeenCalled();
    expect(googleAnalyticsMock.sendEvent).toHaveBeenCalledWith('unsubscribe_confirm_view');
  });

  it('confirms with a POST only after the user chooses to unsubscribe', () => {
    userServiceMock.unsubscribe.and.returnValue(of({ success: true }));

    component.confirm();

    expect(userServiceMock.unsubscribe).toHaveBeenCalledWith('user-id', 'token');
    expect(component.state).toBe('success');
    expect(googleAnalyticsMock.sendEvent).toHaveBeenCalledWith('unsubscribe_confirmed');
  });

  it('tracks a throttled confirmation attempt', () => {
    userServiceMock.unsubscribe.and.returnValue(throwError(() => ({ status: 429 })));

    component.confirm();

    expect(component.state).toBe('rate_limited');
    expect(googleAnalyticsMock.sendEvent).toHaveBeenCalledWith('unsubscribe_rate_limited');
  });
});
