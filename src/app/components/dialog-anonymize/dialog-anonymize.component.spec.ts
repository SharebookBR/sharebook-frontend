import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAnonymizeComponent } from './dialog-anonymize.component';

describe('DialogWHoAccessedComponent', () => {
  let component: DialogAnonymizeComponent;
  let fixture: ComponentFixture<DialogAnonymizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogAnonymizeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAnonymizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
