import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CardMeetupComponent } from './card-meetup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Meetup } from 'src/app/core/models/Meetup';

describe('CardBookComponent', () => {
  let component: CardMeetupComponent;
  let fixture: ComponentFixture<CardMeetupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, FormsModule, ReactiveFormsModule],
      declarations: [CardMeetupComponent, CardMeetupComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardMeetupComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.meetup = new Meetup();
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
