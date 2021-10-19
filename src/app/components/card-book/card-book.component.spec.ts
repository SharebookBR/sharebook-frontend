import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CardBookComponent } from './card-book.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('CardBookComponent', () => {
  let component: CardBookComponent;
  let fixture: ComponentFixture<CardBookComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, FormsModule, ReactiveFormsModule],
      declarations: [CardBookComponent, CardBookComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardBookComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    const book = {
      title: 'Como desenhar super-heróis',
      slug: 'como-desenhar-super-herois',
      imageUrl:
        'https://www.sharebook.com.br/Images/Books/como-desenhar-super-herois.jpeg',
      approved: true,
    };
    component.content = book;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
