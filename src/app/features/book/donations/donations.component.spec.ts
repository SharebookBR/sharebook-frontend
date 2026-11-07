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

  it('shows pre-launch details and hides its primary action until publication', () => {
    expect(component.canShowReleaseInterest({ type: 'Printed', status: BookDonationStatus.SCHEDULED } as any)).toBeTrue();
    expect(component.canShowReleaseInterest({ type: 'Printed', status: BookDonationStatus.AVAILABLE } as any)).toBeFalse();
    expect(component.canShowReleaseInterest({ type: 'Eletronic', status: BookDonationStatus.SCHEDULED } as any)).toBeFalse();
    expect(component.canPrimaryAction({ type: 'Printed', status: BookDonationStatus.SCHEDULED } as any)).toBeFalse();
    expect(component.canPrimaryAction({ type: 'Printed', status: BookDonationStatus.AVAILABLE } as any)).toBeTrue();
  });

  it('uses the canonical label for the requests action', () => {
    expect(component.getPrimaryActionLabel({ type: 'Printed', status: BookDonationStatus.AVAILABLE } as any)).toBe('Ver solicitações');
  });

  it('provides only donor actions to the shared card', () => {
    const card = component.getCard({
      title: 'Livro da pessoa doadora',
      author: 'Pessoa autora',
      type: 'Printed',
      status: BookDonationStatus.AVAILABLE,
      totalInterested: 2,
    } as any);

    expect(card.actions.map((action) => action.id)).toEqual(['donate', 'CancelDonation']);
    expect(card.actions.map((action) => action.id)).not.toContain('edit');
    expect(card.actions.map((action) => action.id)).not.toContain('adminNotes');
    expect(card.actions.map((action) => action.id)).not.toContain('approve');
  });
});
