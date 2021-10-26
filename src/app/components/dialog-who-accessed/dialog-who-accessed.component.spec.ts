import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogWHoAccessedComponent } from './dialog-who-accessed.component';

describe('DialogWHoAccessedComponent', () => {
  let component: DialogWHoAccessedComponent;
  let fixture: ComponentFixture<DialogWHoAccessedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogWHoAccessedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogWHoAccessedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
