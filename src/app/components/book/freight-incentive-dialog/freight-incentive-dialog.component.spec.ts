import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreightIncentiveDialogComponent } from './freight-incentive-dialog.component';

describe('FreightIncentiveDialogComponent', () => {
  let component: FreightIncentiveDialogComponent;
  let fixture: ComponentFixture<FreightIncentiveDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FreightIncentiveDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FreightIncentiveDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
