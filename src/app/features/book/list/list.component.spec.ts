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

  it('does not show the limit block for ebooks or non-available books', () => {
    const baseBook = {
      status: BookDonationStatus.AVAILABLE,
      totalInterested: 2,
      maxRequestsPerBook: 10,
    } as any;

    expect(component.canShowRequestLimit({ ...baseBook, type: 'Eletronic' })).toBeFalse();
    expect(component.canShowRequestLimit({ ...baseBook, type: 'Printed', status: BookDonationStatus.WAITING_DECISION })).toBeFalse();
    expect(component.getPrimaryMetric({ ...baseBook, type: 'Printed', status: BookDonationStatus.WAITING_DECISION })).toBe('2 pessoas interessadas');
  });
});
