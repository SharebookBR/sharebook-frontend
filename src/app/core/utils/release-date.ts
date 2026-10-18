const SAO_PAULO = 'America/Sao_Paulo';
const DAY_MS = 24 * 60 * 60 * 1000;

/** Data de hoje em São Paulo como 'YYYY-MM-DD' (o backend libera livros por data nesse fuso). */
export function todaySaoPaulo(now: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: SAO_PAULO, year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
}

function toDayNumber(isoDate: string): number {
  const [year, month, day] = isoDate.split('-').map(Number);
  return Date.UTC(year, month - 1, day) / DAY_MS;
}

/** Quantos dias faltam até a liberação (0 = hoje, negativo = já passou). null se a data for inválida. */
export function daysUntilRelease(releaseDate: string | null | undefined, now: Date = new Date()): number | null {
  if (!releaseDate || !/^\d{4}-\d{2}-\d{2}/.test(releaseDate)) {
    return null;
  }
  return toDayNumber(releaseDate.slice(0, 10)) - toDayNumber(todaySaoPaulo(now));
}

export function isUpcomingRelease(releaseDate: string | null | undefined, now: Date = new Date()): boolean {
  const days = daysUntilRelease(releaseDate, now);
  return days !== null && days > 0;
}

/** 'dd/MM' (ou 'dd/MM/yyyy' com withYear) sem passar por Date, para não deslocar o dia por fuso. */
export function formatReleaseDate(releaseDate: string | null | undefined, withYear = false): string {
  if (!releaseDate || !/^\d{4}-\d{2}-\d{2}/.test(releaseDate)) {
    return '';
  }
  const [year, month, day] = releaseDate.slice(0, 10).split('-');
  return withYear ? `${day}/${month}/${year}` : `${day}/${month}`;
}

export function releaseCountdownLabel(releaseDate: string | null | undefined, now: Date = new Date()): string {
  const days = daysUntilRelease(releaseDate, now);
  if (days === null || days <= 0) {
    return '';
  }
  return days === 1 ? 'Falta 1 dia' : `Faltam ${days} dias`;
}

/** Texto curto do badge: 'Em breve · 14 dias', 'Em breve · amanhã', 'Em breve · hoje'. */
export function releaseBadgeLabel(releaseDate: string | null | undefined, now: Date = new Date()): string {
  const days = daysUntilRelease(releaseDate, now);
  if (days === null || days < 0) {
    return 'Em breve';
  }
  if (days === 0) {
    return 'Em breve · hoje';
  }
  return days === 1 ? 'Em breve · amanhã' : `Em breve · ${days} dias`;
}
