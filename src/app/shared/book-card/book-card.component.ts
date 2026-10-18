import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { releaseBadgeLabel } from 'src/app/core/utils/release-date';

export interface BookCardInput {
  slug: string;
  imageUrl: string;
  thumbnailUrl?: string;
  title: string;
  type: string;
  releaseDate?: string | null;
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

  // O backend só envia releaseDate enquanto o livro está Scheduled (vira null ao liberar).
  get isUpcoming(): boolean {
    return !this.isEbook && !!this.book?.releaseDate;
  }

  get releaseLabel(): string {
    return releaseBadgeLabel(this.book?.releaseDate);
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
