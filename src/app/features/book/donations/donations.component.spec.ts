import { DonationsComponent } from './donations.component';
import { BookDonationStatus } from 'src/app/features/book/BookDonationStatus';

describe('DonationsComponent release interest', () => {
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

  it('shows release-interest details in every physical donation status except waiting approval', () => {
    expect(component.canShowReleaseInterest({ type: 'Printed', status: BookDonationStatus.SCHEDULED } as any)).toBeTrue();
    expect(component.canShowReleaseInterest({ type: 'Printed', status: BookDonationStatus.AVAILABLE } as any)).toBeTrue();
    expect(component.canShowReleaseInterest({ type: 'Printed', status: BookDonationStatus.WAITING_DECISION } as any)).toBeTrue();
    expect(component.canShowReleaseInterest({ type: 'Printed', status: BookDonationStatus.WAITING_SEND } as any)).toBeTrue();
    expect(component.canShowReleaseInterest({ type: 'Printed', status: BookDonationStatus.RECEIVED } as any)).toBeTrue();
    expect(component.canShowReleaseInterest({ type: 'Printed', status: BookDonationStatus.WAITING_APPROVAL } as any)).toBeFalse();
    expect(component.canShowReleaseInterest({ type: 'Eletronic', status: BookDonationStatus.SCHEDULED } as any)).toBeFalse();
  });

  it('hides the primary action for a pre-launch donation', () => {
    expect(component.canPrimaryAction({ type: 'Printed', status: BookDonationStatus.SCHEDULED } as any)).toBeFalse();
    expect(component.canPrimaryAction({ type: 'Printed', status: BookDonationStatus.AVAILABLE } as any)).toBeTrue();
  });

  it('uses the same notification detail shown in the administrative cards', () => {
    const card = component.getCard({
      title: 'Livro da pessoa doadora',
      author: 'Pessoa autora',
      type: 'Printed',
      status: BookDonationStatus.AVAILABLE,
      releaseInterestCount: 24,
    } as any);

    expect(card.details).toContain(jasmine.objectContaining({
      label: 'Notificações',
      icon: 'notifications',
      value: 24,
    }));
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

  it('shows the request-limit progress for an available physical donation', () => {
    const card = component.getCard({
      title: 'Livro da pessoa doadora',
      author: 'Pessoa autora',
      type: 'Printed',
      status: BookDonationStatus.AVAILABLE,
      totalInterested: 10,
      maxRequestsPerBook: 50,
    } as any);

    expect(card.details.map((detail) => detail.label)).not.toContain('Pessoas interessadas');
    expect(card.progress).toEqual(jasmine.objectContaining({
      label: '10 de 50 solicitações',
      percentage: 20,
      value: 10,
      max: 50,
    }));
  });

  it('shows the request-limit progress in every physical status except awaiting approval and pre-launch', () => {
    const baseDonation = { type: 'Printed', totalInterested: 3, maxRequestsPerBook: 50 } as any;

    expect(component.canShowRequestLimit({ ...baseDonation, status: BookDonationStatus.WAITING_APPROVAL })).toBeFalse();
    expect(component.canShowRequestLimit({ ...baseDonation, status: BookDonationStatus.SCHEDULED })).toBeFalse();
    expect(component.canShowRequestLimit({ ...baseDonation, status: BookDonationStatus.WAITING_DECISION })).toBeTrue();
    expect(component.canShowRequestLimit({ ...baseDonation, status: BookDonationStatus.WAITING_SEND })).toBeTrue();
    expect(component.canShowRequestLimit({ ...baseDonation, status: BookDonationStatus.SENT })).toBeTrue();
    expect(component.canShowRequestLimit({ ...baseDonation, status: BookDonationStatus.RECEIVED })).toBeTrue();
  });

  it('uses the shared timeline for the donation cycle', () => {
    const card = component.getCard({
      title: 'Livro da pessoa doadora',
      author: 'Pessoa autora',
      type: 'Printed',
      status: BookDonationStatus.AVAILABLE,
      creationDate: '2000-01-01T00:00:00Z',
      approvedAt: '2001-01-01T00:00:00Z',
      chooseDate: '2026-11-15T03:00:00Z',
    } as any);

    expect(card.timeline?.map((item) => item.label)).toEqual(['Inclusão', 'Liberação', 'Decisão']);
    expect(card.decisionNotice).toContain('Decisão');
  });
});
