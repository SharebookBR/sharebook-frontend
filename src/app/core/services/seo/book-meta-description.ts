import { BookType } from '../../models/book';

export interface BookMetaDescriptionInput {
  title?: string;
  author?: string;
  type: BookType;
  synopsis?: string;
}

const TARGET_LENGTH = 170;
const ELLIPSIS = '…';

export function buildBookMetaDescription(input: BookMetaDescriptionInput): string {
  const title = normalizeText(input.title) || 'Livro';
  const author = normalizeText(input.author);
  const synopsis = normalizeText(input.synopsis);
  const typeLabel = input.type === 'Eletronic' ? 'Livro digital' : 'Livro físico';
  const identity = `${typeLabel}: ${title}${author ? `, de ${author}` : ''}.`;

  if (!synopsis) {
    return `${identity} Conheça esta obra no ShareBook.`;
  }

  const synopsisBudget = TARGET_LENGTH - identity.length - 1;
  if (synopsisBudget <= 0) {
    return identity;
  }

  if (synopsis.length <= synopsisBudget) {
    return `${identity} ${synopsis}`;
  }

  const completeSentences = getCompleteSentences(synopsis, synopsisBudget);
  if (completeSentences) {
    return `${identity} ${completeSentences}`;
  }

  const excerpt = truncateAtWord(synopsis, synopsisBudget - ELLIPSIS.length);
  return excerpt ? `${identity} ${excerpt}${ELLIPSIS}` : identity;
}

function normalizeText(value?: string): string {
  return (value || '').replace(/\s+/g, ' ').trim();
}

function getCompleteSentences(text: string, maxLength: number): string {
  const sentenceEnd = /[.!?](?=\s|$)/g;
  let lastEnd = 0;
  let match: RegExpExecArray | null;

  while ((match = sentenceEnd.exec(text)) !== null) {
    const end = match.index + 1;
    if (end > maxLength) {
      break;
    }
    lastEnd = end;
  }

  return lastEnd ? text.slice(0, lastEnd) : '';
}

function truncateAtWord(text: string, maxLength: number): string {
  if (maxLength <= 0) {
    return '';
  }

  const words = text.split(' ');
  let excerpt = '';

  for (const word of words) {
    const candidate = excerpt ? `${excerpt} ${word}` : word;
    if (candidate.length > maxLength) {
      break;
    }
    excerpt = candidate;
  }

  return excerpt.replace(/[,:;.!?\-–—]+$/, '').trim();
}
