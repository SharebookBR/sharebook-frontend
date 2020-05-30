import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardBookComponent } from './card-book.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Component, ViewChild } from '@angular/core';

describe('CardBookComponent', () => {
  @Component({
    selector: `app-test-card-book`,
    template: `<app-card-book></app-card-book>`,
  })
  class TestCardBookComponent {
    @ViewChild(CardBookComponent)
    public cardBookComponent: CardBookComponent;
  }

  let component: TestCardBookComponent;
  let fixture: ComponentFixture<TestCardBookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, FormsModule, ReactiveFormsModule],
      declarations: [CardBookComponent, TestCardBookComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestCardBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should show TEST INPUT', () => {
  //   const book = {
  //     title: 'Como desenhar super-heróis',
  //     slug: 'como-desenhar-super-herois',
  //     imageUrl:
  //       'https://www.sharebook.com.br/Images/Books/como-desenhar-super-herois.jpeg',
  //     approved: true,
  //   };
  //   component.cardBookComponent.content = book;
  //   fixture.detectChanges();
  //   expect(fixture.nativeElement.querySelector('card-title').innerText).toEqual(
  //     book.title
  //   );
  // });

  // it('should show DIFFERENT TEST INPUT', () => {
  //   component.cardBookComponent.content = 'different test input';
  //   fixture.detectChanges();
  //   expect(fixture.nativeElement.querySelector('div').innerText).toEqual(
  //     'DIFFERENT TEST INPUT'
  //   );
  // });
});
