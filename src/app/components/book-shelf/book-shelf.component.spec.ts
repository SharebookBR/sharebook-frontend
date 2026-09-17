import { CommonModule } from '@angular/common';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { BookCardModule } from '../book-card/book-card.module';
import { BookShelfComponent } from './book-shelf.component';

describe('BookShelfComponent', () => {
  let fixture: ComponentFixture<BookShelfComponent>;
  let component: BookShelfComponent;

  const books = [
    { slug: 'book-one', imageUrl: 'assets/img/img-placeholder.png', title: 'Book One', type: 'Printed' },
    { slug: 'book-two', imageUrl: 'assets/img/img-placeholder.png', title: 'Book Two', type: 'Eletronic' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, RouterTestingModule, BookCardModule],
      declarations: [BookShelfComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BookShelfComponent);
    component = fixture.componentInstance;
    component.title = 'Continue explorando';
    component.books = books;
    fixture.detectChanges();
  });

  it('emits the selected book with its one-based position', () => {
    spyOn(component.bookSelected, 'emit');

    fixture.debugElement.queryAll(By.css('.book-shelf__item'))[1].triggerEventHandler('click', new MouseEvent('click'));

    expect(component.bookSelected.emit).toHaveBeenCalledWith({
      book: books[1],
      position: 2,
    });
  });

  it('keeps arrow state aligned with the visible scroll range', fakeAsync(() => {
    const track = fixture.debugElement.query(By.css('.book-shelf__track')).nativeElement as HTMLElement;
    Object.defineProperty(track, 'clientWidth', { configurable: true, value: 500 });
    Object.defineProperty(track, 'scrollWidth', { configurable: true, value: 1000 });
    Object.defineProperty(track, 'scrollLeft', { configurable: true, value: 2, writable: true });

    tick();
    component.updateArrows();
    expect(component.leftDisabled).toBeTrue();
    expect(component.rightDisabled).toBeFalse();

    track.scrollLeft = 500;
    component.updateArrows();
    expect(component.leftDisabled).toBeFalse();
    expect(component.rightDisabled).toBeTrue();
  }));
});
