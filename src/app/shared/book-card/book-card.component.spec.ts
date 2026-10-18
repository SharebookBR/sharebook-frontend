import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { BookCardComponent, BookCardInput } from './book-card.component';

describe('BookCardComponent', () => {
  let fixture: ComponentFixture<BookCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [BookCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BookCardComponent);
    fixture.componentInstance.book = {
      slug: 'clean-code',
      imageUrl: 'https://api.sharebook.com.br/Images/Books/clean-code.png',
      thumbnailUrl: 'https://api.sharebook.com.br/Images/Books/Thumbs/clean-code.webp',
      title: 'Clean Code',
      type: 'Eletronic',
    };
    fixture.detectChanges();
  });

  it('defers cover decoding with stable dimensions', () => {
    const image = fixture.debugElement.query(By.css('img')).nativeElement as HTMLImageElement;

    expect(image.getAttribute('loading')).toBe('lazy');
    expect(image.getAttribute('decoding')).toBe('async');
    expect(image.getAttribute('width')).toBe('170');
    expect(image.getAttribute('height')).toBe('230');
    expect(image.src).toContain('/Images/Books/Thumbs/clean-code.webp');
  });

  it('falls back to the original cover when the thumbnail fails', () => {
    const image = fixture.debugElement.query(By.css('img')).nativeElement as HTMLImageElement;

    image.dispatchEvent(new Event('error'));
    fixture.detectChanges();

    expect(image.src).toContain('/Images/Books/clean-code.png');
  });

  function renderBook(overrides: Partial<BookCardInput>): ComponentFixture<BookCardComponent> {
    const created = TestBed.createComponent(BookCardComponent);
    created.componentInstance.book = { ...fixture.componentInstance.book, ...overrides };
    created.detectChanges();
    return created;
  }

  it('shows the coming-soon badge for a physical book with a future release date', () => {
    const future = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const badge = renderBook({ type: 'Printed', releaseDate: future }).debugElement.query(By.css('.book-release-badge'));

    expect(badge).not.toBeNull();
    expect(badge.nativeElement.textContent).toContain('Em breve');
  });

  it('hides the coming-soon badge without a release date', () => {
    expect(renderBook({ type: 'Printed', releaseDate: null }).debugElement.query(By.css('.book-release-badge'))).toBeNull();
  });

  it('hides the coming-soon badge for ebooks even with a release date', () => {
    expect(renderBook({ type: 'Eletronic', releaseDate: '2999-01-01' }).debugElement.query(By.css('.book-release-badge'))).toBeNull();
  });
});
