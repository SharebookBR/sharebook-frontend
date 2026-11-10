import { ListComponent } from './list.component';
import { BookDonationStatus } from 'src/app/features/book/BookDonationStatus';

describe('ListComponent request limit', () => {
  let component: ListComponent;

  beforeEach(() => {
    component = new ListComponent(
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any
    );
  });

  it('shows the effective limit block for an available physical book', () => {
    const book = {
      type: 'Printed',
      status: BookDonationStatus.AVAILABLE,
      totalInterested: 46,
      maxRequestsPerBook: 50,
    } as any;

    expect(component.canShowRequestLimit(book)).toBeTrue();
    expect(component.getRequestCountLabel(book)).toBe('46 de 50 solicitações');
    expect(component.getRequestPercentage(book)).toBe(92);
    expect(component.getRequestProgressPercentage(book)).toBe(92);
    expect(component.getRequestProgressValue(book)).toBe(46);
    expect(component.getRequestAvailabilityLabel(book)).toBe('Restam 4 vagas');
  });

  it('uses singular and reached-limit availability copy', () => {
    const book = {
      type: 'Printed',
      status: BookDonationStatus.AVAILABLE,
      totalInterested: 9,
      maxRequestsPerBook: 10,
    } as any;

    expect(component.getRequestAvailabilityLabel(book)).toBe('Resta 1 vaga');
    expect(component.getRequestProgressAriaLabel(book)).toBe('9 de 10 solicitações; Resta 1 vaga');

    book.totalInterested = 10;
    expect(component.getRequestAvailabilityLabel(book)).toBe('Limite atingido');
    expect(component.getRequestProgressPercentage(book)).toBe(100);
    expect(component.getRequestProgressValue(book)).toBe(10);

    book.totalInterested = 12;
    expect(component.getRequestPercentage(book)).toBe(100);
    expect(component.getRequestProgressValue(book)).toBe(10);
  });

  it('shows the limit block in every physical status except awaiting approval and pre-launch', () => {
    const baseBook = {
      status: BookDonationStatus.AVAILABLE,
      totalInterested: 2,
      maxRequestsPerBook: 10,
    } as any;

    expect(component.canShowRequestLimit({ ...baseBook, type: 'Eletronic' })).toBeFalse();
    expect(component.canShowRequestLimit({ ...baseBook, type: 'Printed', status: BookDonationStatus.WAITING_APPROVAL })).toBeFalse();
    expect(component.canShowRequestLimit({ ...baseBook, type: 'Printed', status: BookDonationStatus.SCHEDULED })).toBeFalse();
    expect(component.canShowRequestLimit({ ...baseBook, type: 'Printed', status: BookDonationStatus.WAITING_DECISION })).toBeTrue();
    expect(component.canShowRequestLimit({ ...baseBook, type: 'Printed', status: BookDonationStatus.WAITING_SEND })).toBeTrue();
    expect(component.canShowRequestLimit({ ...baseBook, type: 'Printed', status: BookDonationStatus.SENT })).toBeTrue();
    expect(component.canShowRequestLimit({ ...baseBook, type: 'Printed', status: BookDonationStatus.RECEIVED })).toBeTrue();
  });

  it('shows rejection only for donations awaiting approval', () => {
    expect(component.canRejectDonation({ status: BookDonationStatus.WAITING_APPROVAL } as any)).toBeTrue();
    expect(component.canRejectDonation({ status: BookDonationStatus.AVAILABLE } as any)).toBeFalse();
    expect(component.canRejectDonation({ status: BookDonationStatus.CANCELED } as any)).toBeFalse();
  });

  it('shows approval only for donations awaiting approval', () => {
    expect(component.canApproveDonation({ status: BookDonationStatus.WAITING_APPROVAL } as any)).toBeTrue();
    expect(component.canApproveDonation({ status: BookDonationStatus.AVAILABLE } as any)).toBeFalse();
    expect(component.canApproveDonation({ status: BookDonationStatus.CANCELED } as any)).toBeFalse();
  });

  it('hides cancellation while a donation is awaiting approval', () => {
    expect(component.canCancelDonation({ status: BookDonationStatus.WAITING_APPROVAL } as any)).toBeFalse();
    expect(component.canCancelDonation({ status: BookDonationStatus.CANCELED } as any)).toBeFalse();
    expect(component.canCancelDonation({ status: BookDonationStatus.AVAILABLE } as any)).toBeTrue();
  });

  it('provides administrative actions only from the admin page model', () => {
    const card = component.getCard({
      title: 'Livro pendente',
      author: 'Pessoa autora',
      type: 'Printed',
      status: BookDonationStatus.WAITING_APPROVAL,
      creationDate: '2026-11-02',
    } as any);

    expect(card.actions.map((action) => action.id)).toEqual([
      'approve',
      'reject',
      'edit',
      'adminNotes',
      'showUsersInfo',
    ]);
  });

  it('shows scheduled dates in calendar order with notification and request icons', () => {
    const card = component.getCard({
      title: 'Livro agendado',
      author: 'Pessoa autora',
      type: 'Printed',
      status: BookDonationStatus.SCHEDULED,
      creationDate: '2026-11-10',
      releaseDate: '2026-12-01',
      chooseDate: '2027-01-01T00:00:00Z',
      donor: 'Roberto Montanha',
      releaseInterestCount: 3,
    } as any);

    expect(card.releaseDate).toBe('2026-12-01');
    expect(card.timeline?.map(({ date, label }) => ({ date, label }))).toEqual([
      { date: '10/11/2026', label: 'Inclusão' },
      { date: '01/12/2026', label: 'Liberação' },
      { date: '01/01/2027', label: 'Decisão' },
    ]);
    expect(card.details.map((detail) => detail.label)).toEqual([
      'Pessoa doadora',
      'Notificações',
    ]);
    expect(card.details[0].value).toBe('Roberto Montanha');
    expect(card.details[card.details.length - 1].icon).toBe('notifications');
  });

  it('uses the request progress bar after the book has left pre-launch', () => {
    const card = component.getCard({
      title: 'Livro disponível',
      author: 'Pessoa autora',
      type: 'Printed',
      status: BookDonationStatus.WAITING_DECISION,
      creationDate: '2026-11-10',
      totalInterested: 2,
      maxRequestsPerBook: 50,
    } as any);

    expect(card.details.map((detail) => detail.label)).not.toContain('Solicitações');
    expect(card.progress).toEqual(jasmine.objectContaining({ label: '2 de 50 solicitações', value: 2, max: 50 }));
  });

  it('shows notifications in every physical status except awaiting approval', () => {
    const approvedCard = component.getCard({
      title: 'Livro disponível',
      author: 'Pessoa autora',
      type: 'Printed',
      status: BookDonationStatus.WAITING_SEND,
      creationDate: '2026-11-10',
      releaseInterestCount: 4,
    } as any);
    const pendingCard = component.getCard({
      title: 'Livro pendente',
      author: 'Pessoa autora',
      type: 'Printed',
      status: BookDonationStatus.WAITING_APPROVAL,
      creationDate: '2026-11-10',
      releaseInterestCount: 4,
    } as any);

    expect(approvedCard.details).toContain(jasmine.objectContaining({
      label: 'Notificações', icon: 'notifications', value: 4,
    }));
    expect(pendingCard.details.map((detail) => detail.label)).not.toContain('Notificações');
  });

  it('keeps the timeline for a released book and bolds only dates already reached', () => {
    const card = component.getCard({
      title: 'Livro disponível',
      author: 'Pessoa autora',
      type: 'Printed',
      status: BookDonationStatus.AVAILABLE,
      creationDate: '2000-01-01T00:00:00Z',
      approvedAt: '2001-01-01T00:00:00Z',
      chooseDate: '2999-01-01T00:00:00Z',
      donor: 'Pessoa doadora',
    } as any);

    expect(card.timeline?.map(({ label, isReached }) => ({ label, isReached }))).toEqual([
      { label: 'Inclusão', isReached: true },
      { label: 'Liberação', isReached: true },
      { label: 'Decisão', isReached: false },
    ]);
  });
});
