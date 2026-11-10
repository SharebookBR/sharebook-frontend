import { formatReleaseDate, todaySaoPaulo } from 'src/app/core/utils/release-date';

export interface DonationCardTimelineItem {
  date: string;
  label: string;
  isReached: boolean;
}

export interface DonationCardTimelineSource {
  creationDate?: Date | string | null;
  approvedAt?: Date | string | null;
  chooseDate?: Date | string | null;
  releaseDate?: string | null;
  isDigital: boolean;
  isScheduled: boolean;
}

/**
 * A linha do tempo é uma responsabilidade visual do card compartilhado.
 * As páginas só adaptam os seus dados para esta fonte única.
 */
export function buildDonationCardTimeline(source: DonationCardTimelineSource): DonationCardTimelineItem[] {
  const timeline: DonationCardTimelineItem[] = [];

  if (source.creationDate) {
    timeline.push(createTimelineItem(source.creationDate, 'Inclusão'));
  }

  const releaseDate = source.isScheduled ? source.releaseDate : source.approvedAt;
  if (releaseDate) {
    timeline.push(createTimelineItem(
      releaseDate,
      source.isDigital ? 'Publicação' : 'Liberação',
    ));
  }

  if (!source.isDigital && source.chooseDate) {
    timeline.push(createTimelineItem(source.chooseDate, 'Decisão'));
  }

  return timeline;
}

function createTimelineItem(value: Date | string, label: string): DonationCardTimelineItem {
  const isoDate = toIsoDate(value);

  return {
    date: isoDate ? formatReleaseDate(isoDate, true) : '-',
    label,
    isReached: !!isoDate && isoDate <= todaySaoPaulo(),
  };
}

function toIsoDate(value: Date | string): string | null {
  if (typeof value === 'string') {
    const isoDate = value.slice(0, 10);
    return /^\d{4}-\d{2}-\d{2}$/.test(isoDate) ? isoDate : null;
  }

  if (Number.isNaN(value.getTime())) {
    return null;
  }

  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`;
}
