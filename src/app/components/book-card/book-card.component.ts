import { Component, Input } from '@angular/core';

export interface BookCardInput {
  slug: string;
  imageUrl: string;
  thumbnailUrl?: string;
  title: string;
  type: string;
}

@Component({
  selector: 'app-book-card',
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.css'],
})
export class BookCardComponent {
  @Input() book: BookCardInput;

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
