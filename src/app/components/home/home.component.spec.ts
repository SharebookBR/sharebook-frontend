import { ChangeDetectorRef, TransferState } from '@angular/core';
import { HomeComponent } from './home.component';
import { GoogleAnalyticsService } from 'src/app/core/services/analytics/google-analytics.service';

describe('HomeComponent campaign analytics', () => {
  const campaignParams = {
    placement: 'home_hero',
    campaign: 'livros_em_movimento',
    variant: 'editorial_warm'
  };
  let analytics: jasmine.SpyObj<GoogleAnalyticsService>;

  function createComponent(platformId: any = 'browser'): HomeComponent {
    analytics = jasmine.createSpyObj<GoogleAnalyticsService>('GoogleAnalyticsService', ['sendEvent']);

    return new HomeComponent(
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as ChangeDetectorRef,
      { get: () => 1 } as unknown as TransferState,
      analytics,
      platformId
    );
  }

  beforeEach(() => sessionStorage.clear());

  it('records the banner view once per browser session', () => {
    const component = createComponent();

    (component as any).trackCampaignBannerView();
    (component as any).trackCampaignBannerView();

    expect(analytics.sendEvent).toHaveBeenCalledTimes(1);
    expect(analytics.sendEvent).toHaveBeenCalledWith('vakinha_banner_view', campaignParams);
  });

  it('records every explicit CTA click with the campaign context', () => {
    const component = createComponent();

    component.trackCampaignCtaClick();

    expect(analytics.sendEvent).toHaveBeenCalledWith('vakinha_cta_click', campaignParams);
  });

  it('does not attempt a banner view during SSR', () => {
    const component = createComponent('server');

    (component as any).trackCampaignBannerView();

    expect(analytics.sendEvent).not.toHaveBeenCalled();
  });
});
