import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardBookComponent } from './card-book.component';

describe('CardBookComponent', () => {
  let component: CardBookComponent;
  let fixture: ComponentFixture<CardBookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardBookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
