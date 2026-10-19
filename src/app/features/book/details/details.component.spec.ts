import { HttpClient } from '@angular/common/http';
import { DetailsComponent } from './details.component';

describe('DetailsComponent release interest analytics', () => {
  function createComponent() {
    const router = { navigate: jasmine.createSpy('navigate') };
    const analytics = { sendEvent: jasmine.createSpy('sendEvent') };
    const authentication = { checkTokenValidity: jasmine.createSpy('checkTokenValidity') };
    const component = new DetailsComponent(
      {} as any,
      {} as any,
      {} as any,
      router as any,
      {} as any,
      authentication as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      analytics as any,
      {} as any,
      {} as any,
      null as any,
      {} as any
    );
    component.bookInfo = { title: 'Clean Code', slug: 'clean-code' } as any;
    return { component, router, analytics };
  }

  it('tracks a logged-out click before redirecting to enter', () => {
    const { component, router, analytics } = createComponent();

    component.onWantToBeNotified();

    expect(analytics.sendEvent).toHaveBeenCalledWith('release_interest_click', {
      book_title: 'Clean Code',
      book_slug: 'clean-code',
      auth_state: 'logged_out'
    });
    expect(analytics.sendEvent).toHaveBeenCalledBefore(router.navigate);
  });

  it('tracks a logged-in click before subscribing', () => {
    const { component, analytics } = createComponent();
    component.userProfile = 'User';
    spyOn(component as any, 'subscribeToRelease');

    component.onWantToBeNotified();

    expect(analytics.sendEvent).toHaveBeenCalledWith('release_interest_click', {
      book_title: 'Clean Code',
      book_slug: 'clean-code',
      auth_state: 'logged_in'
    });
    expect((component as any).subscribeToRelease).toHaveBeenCalled();
  });
});
