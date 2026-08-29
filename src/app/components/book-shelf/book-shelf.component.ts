import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

import { BookCardInput } from '../book-card/book-card.component';

export interface BookShelfSelection {
  book: BookCardInput;
  position: number;
}

export type BookShelfAppearance = 'default' | 'recommendations';

@Component({
  selector: 'app-book-shelf',
  templateUrl: './book-shelf.component.html',
  styleUrls: ['./book-shelf.component.css'],
})
export class BookShelfComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() title = '';
  @Input() description = '';
  @Input() books: BookCardInput[] = [];
  @Input() moreLink: string | any[];
  @Input() moreLabel = 'Ver tudo';
  @Input() badgeText = '';
  @Input() appearance: BookShelfAppearance = 'default';
  @Input() ariaLabel = 'Livros';

  @Output() bookSelected = new EventEmitter<BookShelfSelection>();

  @ViewChild('track') private trackRef: ElementRef<HTMLElement>;

  leftDisabled = true;
  rightDisabled = true;

  private viewInitialized = false;
  private arrowUpdateTimer: ReturnType<typeof setTimeout>;

  ngAfterViewInit(): void {
    this.viewInitialized = true;
    this.scheduleArrowUpdate();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.books && this.viewInitialized) {
      this.scheduleArrowUpdate();
    }
  }

  ngOnDestroy(): void {
    if (this.arrowUpdateTimer) {
      clearTimeout(this.arrowUpdateTimer);
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateArrows();
  }

  scroll(direction: 'left' | 'right'): void {
    const track = this.trackRef?.nativeElement;
    if (!track) {
      return;
    }

    track.scrollBy({
      left: direction === 'right' ? 620 : -620,
      behavior: 'smooth',
    });
    this.scheduleArrowUpdate(400);
  }

  updateArrows(): void {
    const track = this.trackRef?.nativeElement;
    if (!track) {
      return;
    }

    this.leftDisabled = track.scrollLeft <= 2;
    this.rightDisabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
  }

  selectBook(book: BookCardInput, index: number): void {
    this.bookSelected.emit({ book, position: index + 1 });
  }

  trackBook(_index: number, book: BookCardInput): string {
    return book.slug;
  }

  private scheduleArrowUpdate(delay = 0): void {
    if (this.arrowUpdateTimer) {
      clearTimeout(this.arrowUpdateTimer);
    }

    this.arrowUpdateTimer = setTimeout(() => this.updateArrows(), delay);
  }
}
