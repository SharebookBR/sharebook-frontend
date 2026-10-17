import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

export interface BookCardInput {
  slug: string;
  imageUrl: string;
  thumbnailUrl?: string;
  title: string;
  type: string;
  releaseAtUtc?: string | null;
}

@Component({
    selector: 'app-book-card',
    templateUrl: './book-card.component.html',
    styleUrls: ['./book-card.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class BookCardComponent {
  @Input() book: BookCardInput;
  @Input() layout: 'default' | 'shelf' = 'default';

  get isUpcoming(): boolean {
    const release = this.book?.releaseAtUtc;
    return !this.isEbook && !!release && new Date(release).getTime() > Date.now();
  }

  get releaseLabel(): string {
    return this.book?.releaseAtUtc
      ? new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeZone: 'America/Sao_Paulo' }).format(new Date(this.book.releaseAtUtc))
      : '';
  }

  get isEbook(): boolean {
    return this.book?.type === 'Eletronic';
  }

  useOriginalCover(event: Event): void {
    const image = event.target as HTMLImageElement;
    const originalUrl = this.book?.imageUrl;

    if (originalUrl && image.dataset.originalFallbackApplied !== 'true') {
      image.dataset.originalFallbackApplied = 'true';
      image.src = originalUrl;
    }
  }
}
