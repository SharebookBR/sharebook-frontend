import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { BookCardComponent } from './book-card.component';

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
});
