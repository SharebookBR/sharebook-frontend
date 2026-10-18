import {
  daysUntilRelease,
  formatReleaseDate,
  isUpcomingRelease,
  releaseBadgeLabel,
  releaseCountdownLabel,
  todaySaoPaulo,
} from './release-date';

describe('release-date', () => {
  // 2026-11-01 02:30 UTC ainda é 31/10 23:30 em São Paulo.
  const lateNightSp = new Date('2026-11-01T02:30:00Z');
  // 2026-11-01 10:00 UTC = 07:00 em São Paulo.
  const morningSp = new Date('2026-11-01T10:00:00Z');

  it('todaySaoPaulo uses the São Paulo calendar day, not UTC', () => {
    expect(todaySaoPaulo(lateNightSp)).toBe('2026-10-31');
    expect(todaySaoPaulo(morningSp)).toBe('2026-11-01');
  });

  it('daysUntilRelease counts calendar days from today in São Paulo', () => {
    expect(daysUntilRelease('2026-11-01', morningSp)).toBe(0);
    expect(daysUntilRelease('2026-11-15', morningSp)).toBe(14);
    expect(daysUntilRelease('2026-11-01', lateNightSp)).toBe(1);
    expect(daysUntilRelease('2026-10-30', morningSp)).toBe(-2);
  });

  it('daysUntilRelease ignores missing or invalid dates', () => {
    expect(daysUntilRelease(null, morningSp)).toBeNull();
    expect(daysUntilRelease(undefined, morningSp)).toBeNull();
    expect(daysUntilRelease('amanhã', morningSp)).toBeNull();
  });

  it('isUpcomingRelease is false on the release day itself', () => {
    expect(isUpcomingRelease('2026-11-02', morningSp)).toBeTrue();
    expect(isUpcomingRelease('2026-11-01', morningSp)).toBeFalse();
    expect(isUpcomingRelease(null, morningSp)).toBeFalse();
  });

  it('formatReleaseDate does not shift the day through timezones', () => {
    expect(formatReleaseDate('2026-11-15')).toBe('15/11');
    expect(formatReleaseDate('2026-11-15', true)).toBe('15/11/2026');
    expect(formatReleaseDate('2026-11-15T00:00:00')).toBe('15/11');
    expect(formatReleaseDate(null)).toBe('');
  });

  it('releaseBadgeLabel gives a short label for every distance', () => {
    expect(releaseBadgeLabel('2026-11-15', morningSp)).toBe('Em breve · 14 dias');
    expect(releaseBadgeLabel('2026-11-02', morningSp)).toBe('Em breve · amanhã');
    expect(releaseBadgeLabel('2026-11-01', morningSp)).toBe('Em breve · hoje');
    expect(releaseBadgeLabel('2026-10-30', morningSp)).toBe('Em breve');
    expect(releaseBadgeLabel(null, morningSp)).toBe('Em breve');
  });

  it('releaseCountdownLabel pluralizes and hides after release', () => {
    expect(releaseCountdownLabel('2026-11-02', morningSp)).toBe('Falta 1 dia');
    expect(releaseCountdownLabel('2026-11-15', morningSp)).toBe('Faltam 14 dias');
    expect(releaseCountdownLabel('2026-11-01', morningSp)).toBe('');
  });
});
