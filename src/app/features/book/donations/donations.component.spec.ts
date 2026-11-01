import { DonationsComponent } from './donations.component';
import { BookDonationStatus } from 'src/app/features/book/BookDonationStatus';

describe('DonationsComponent pre-launch interest', () => {
  let component: DonationsComponent;

  beforeEach(() => {
    component = new DonationsComponent(
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any
    );
  });

  it('shows requested notifications for physical books regardless of status', () => {
    expect(component.canShowReleaseInterest({ type: 'Printed', status: BookDonationStatus.SCHEDULED } as any)).toBeTrue();
    expect(component.canShowReleaseInterest({ type: 'Printed', status: BookDonationStatus.AVAILABLE } as any)).toBeTrue();
    expect(component.canShowReleaseInterest({ type: 'Eletronic', status: BookDonationStatus.SCHEDULED } as any)).toBeFalse();
  });
});
