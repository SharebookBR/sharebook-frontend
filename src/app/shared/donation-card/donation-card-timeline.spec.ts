import { buildDonationCardTimeline } from './donation-card-timeline';

describe('buildDonationCardTimeline', () => {
  it('keeps the same chronology for every card consumer', () => {
    const timeline = buildDonationCardTimeline({
      creationDate: '2026-11-10',
      releaseDate: '2026-12-01',
      chooseDate: '2027-01-01T00:00:00Z',
      isDigital: false,
      isScheduled: true,
    });

    expect(timeline.map(({ date, label }) => ({ date, label }))).toEqual([
      { date: '10/11/2026', label: 'Inclusão' },
      { date: '01/12/2026', label: 'Liberação' },
      { date: '01/01/2027', label: 'Decisão' },
    ]);
  });

  it('makes only past or current dates reached', () => {
    const timeline = buildDonationCardTimeline({
      creationDate: '2000-01-01T00:00:00Z',
      approvedAt: '2001-01-01T00:00:00Z',
      chooseDate: '2999-01-01T00:00:00Z',
      isDigital: false,
      isScheduled: false,
    });

    expect(timeline.map(({ label, isReached }) => ({ label, isReached }))).toEqual([
      { label: 'Inclusão', isReached: true },
      { label: 'Liberação', isReached: true },
      { label: 'Decisão', isReached: false },
    ]);
  });
});
